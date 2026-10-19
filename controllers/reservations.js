const Reservation = require('../models/reservation');
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Payment = require('../models/payment');
const AuditLog = require('../models/auditLog');
const ExpressError = require('../utils/ExpressError');

// Helper to generate readable, unique booking codes
const generateBookingCode = () => 'PS-' + Math.floor(100000 + Math.random() * 900000);

/**
 * Create a new parking reservation with strict conflict check and server-side pricing
 */
module.exports.createReservation = async (req, res, next) => {
  try {
    const { facilityId, slotId, vehicleId, startTime, endTime } = req.body;
    const userId = req.session.user._id;

    if (!facilityId || !slotId || !vehicleId || !startTime || !endTime) {
      req.flash('error', 'All reservation details must be selected.');
      return res.redirect(`/parking/${facilityId}`);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Validate date ordering
    if (isNaN(start) || isNaN(end) || start >= end) {
      req.flash('error', 'Invalid booking window. End time must be after start time.');
      return res.redirect(`/parking/${facilityId}`);
    }

    // Verify facility and slot exist
    const facility = await Facility.findById(facilityId);
    const slot = await Slot.findById(slotId);
    const vehicle = await Vehicle.findById(vehicleId);

    if (!facility || !slot || !vehicle) {
      req.flash('error', 'Selected facility, slot, or vehicle does not exist.');
      return res.redirect('/parking');
    }

    // CRITICAL CONCURRENCY & CONFLICT CHECK:
    // Overlap Predicate: existing.startTime < requestedEnd AND existing.endTime > requestedStart
    const conflict = await Reservation.findOne({
      slot: slot._id,
      status: { $in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      req.flash('error', 'The selected parking slot is already booked for this time window. Please choose another slot.');
      return res.redirect(`/parking/${facilityId}`);
    }

    // Authoritative server-side fee computation
    const durationHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    const estimatedAmount = durationHours * facility.pricing.hourlyRate;

    const bookingCode = generateBookingCode();

    const reservation = new Reservation({
      bookingCode,
      user: userId,
      facility: facility._id,
      slot: slot._id,
      vehicle: vehicle._id,
      startTime: start,
      endTime: end,
      estimatedAmount,
      finalAmount: estimatedAmount,
      status: 'CONFIRMED',
    });

    await reservation.save();

    // Create linked payment ledger record
    const payment = new Payment({
      reservation: reservation._id,
      user: userId,
      amount: estimatedAmount,
      method: 'DEMO_CARD',
      status: 'COMPLETED',
      transactionId: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    });
    await payment.save();

    // Audit log entry
    await AuditLog.create({
      actor: userId,
      action: 'CREATE_RESERVATION',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: { bookingCode, estimatedAmount, durationHours },
    });

    req.flash('success', `Reservation confirmed! Booking Code: ${bookingCode}`);
    res.redirect('/customer/bookings');
  } catch (err) {
    next(err);
  }
};

/**
 * Cancel an eligible reservation
 */
module.exports.cancelReservation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.session.user._id;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    // Check ownership or operator/admin permissions
    if (reservation.user.toString() !== userId.toString() && req.session.user.role === 'CUSTOMER') {
      req.flash('error', 'Unauthorized to cancel this reservation.');
      return res.redirect('/customer/bookings');
    }

    // State machine check: Only PENDING or CONFIRMED can be cancelled
    if (reservation.status !== 'CONFIRMED' && reservation.status !== 'PENDING') {
      req.flash('error', `Cannot cancel a reservation with status ${reservation.status}.`);
      return res.redirect('/customer/bookings');
    }

    reservation.status = 'CANCELLED';
    await reservation.save();

    // Audit log
    await AuditLog.create({
      actor: userId,
      action: 'CANCEL_RESERVATION',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: { bookingCode: reservation.bookingCode },
    });

    req.flash('success', `Reservation ${reservation.bookingCode} cancelled successfully.`);
    res.redirect('/customer/bookings');
  } catch (err) {
    next(err);
  }
};

/**
 * Check-in operation (Customer or Operator)
 */
module.exports.checkIn = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id);

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    if (reservation.status !== 'CONFIRMED') {
      req.flash('error', `Check-in is only allowed for CONFIRMED bookings. Current status: ${reservation.status}`);
      return res.redirect('/customer/bookings');
    }

    reservation.status = 'ACTIVE';
    reservation.actualEntryTime = new Date();
    await reservation.save();

    // Update physical slot state to OCCUPIED
    await Slot.findByIdAndUpdate(reservation.slot, { status: 'OCCUPIED' });

    // Audit log
    await AuditLog.create({
      actor: req.session.user._id,
      action: 'CHECK_IN',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: { bookingCode: reservation.bookingCode, entryTime: reservation.actualEntryTime },
    });

    req.flash('success', `Checked in successfully! Parking session is now ACTIVE.`);
    res.redirect(req.session.user.role === 'OPERATOR' ? '/operator/dashboard' : '/customer/bookings');
  } catch (err) {
    next(err);
  }
};

/**
 * Check-out operation and authoritative billing finalization
 */
module.exports.checkOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('facility');

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    if (reservation.status !== 'ACTIVE') {
      req.flash('error', `Check-out is only allowed for ACTIVE bookings. Current status: ${reservation.status}`);
      return res.redirect('/customer/bookings');
    }

    reservation.actualExitTime = new Date();
    const entry = reservation.actualEntryTime || reservation.startTime;
    const actualDurationHours = Math.max(1, Math.ceil((reservation.actualExitTime - entry) / (1000 * 60 * 60)));

    const hourlyRate = reservation.facility?.pricing?.hourlyRate || 10;
    reservation.finalAmount = actualDurationHours * hourlyRate;
    reservation.status = 'COMPLETED';
    await reservation.save();

    // Release physical slot back to AVAILABLE
    await Slot.findByIdAndUpdate(reservation.slot, { status: 'AVAILABLE' });

    // Update or log payment
    await Payment.findOneAndUpdate(
      { reservation: reservation._id },
      { amount: reservation.finalAmount, status: 'COMPLETED' }
    );

    // Audit log
    await AuditLog.create({
      actor: req.session.user._id,
      action: 'CHECK_OUT',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: {
        bookingCode: reservation.bookingCode,
        durationHours: actualDurationHours,
        finalAmount: reservation.finalAmount,
      },
    });

    req.flash('success', `Check-out complete! Total finalized fee: $${reservation.finalAmount.toFixed(2)}`);
    res.redirect(req.session.user.role === 'OPERATOR' ? '/operator/dashboard' : '/customer/bookings');
  } catch (err) {
    next(err);
  }
};
