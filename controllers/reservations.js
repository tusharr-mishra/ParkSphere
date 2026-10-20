// Reservation Controller: handles booking creation, conflict detection, cancellation, check-in, and check-out
const Reservation = require('../models/reservation');
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Payment = require('../models/payment');
const AuditLog = require('../models/auditLog');
const ExpressError = require('../utils/ExpressError');

// Generate unique booking confirmation code (e.g. PS-849201)
const generateBookingCode = () => 'PS-' + Math.floor(100000 + Math.random() * 900000);

// Create a new reservation with overlap conflict check
module.exports.createReservation = async (req, res, next) => {
  try {
    const { facilityId, slotId, vehicleId, startTime, endTime } = req.body;
    const currentUserId = req.session.user._id;

    // Validate that all required booking parameters are present
    if (!facilityId || !slotId || !vehicleId || !startTime || !endTime) {
      req.flash('error', 'All reservation details must be selected.');
      return res.redirect(`/parking/${facilityId}`);
    }

    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(endTime);

    // Validate date sequence
    if (
      isNaN(requestedStart) ||
      isNaN(requestedEnd) ||
      requestedStart >= requestedEnd
    ) {
      req.flash('error', 'Invalid booking window. End time must be after start time.');
      return res.redirect(`/parking/${facilityId}`);
    }

    // Verify existence of facility, physical bay, and customer vehicle
    const targetFacility = await Facility.findById(facilityId);
    const targetSlot = await Slot.findById(slotId);
    const targetVehicle = await Vehicle.findById(vehicleId);

    if (!targetFacility || !targetSlot || !targetVehicle) {
      req.flash('error', 'Selected facility, slot, or vehicle does not exist.');
      return res.redirect('/parking');
    }

    // Concurrency check: ensure bay isn't already booked for this time window
    // Overlap exists if: existing.startTime < requestedEnd AND existing.endTime > requestedStart
    const existingConflict = await Reservation.findOne({
      slot: targetSlot._id,
      status: { $in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
      startTime: { $lt: requestedEnd },
      endTime: { $gt: requestedStart },
    });

      if (existingConflict) {
        req.flash(
          'error',
          `Bay ${targetSlot.slotNumber} was just reserved by another driver for this time window. Please select another open bay.`
        );
        return res.redirect(`/parking/${facilityId}`);
      }

      // Check maintenance status
      if (targetSlot.status === 'MAINTENANCE') {
        req.flash(
          'error',
          `Bay ${targetSlot.slotNumber} is currently under maintenance. Please select an active bay.`
        );
        return res.redirect(`/parking/${facilityId}`);
      }

      // Authoritative server-side fee computation
      const durationHours = Math.max(
        1,
        Math.ceil((requestedEnd - requestedStart) / (1000 * 60 * 60))
      );
      const calculatedAmount = durationHours * targetFacility.pricing.hourlyRate;
      const uniqueBookingCode = generateBookingCode();

      // Instantiate new reservation document
      const newReservation = new Reservation({
        bookingCode: uniqueBookingCode,
        user: currentUserId,
        facility: targetFacility._id,
        slot: targetSlot._id,
        vehicle: targetVehicle._id,
        startTime: requestedStart,
        endTime: requestedEnd,
        estimatedAmount: calculatedAmount,
        finalAmount: calculatedAmount,
        status: 'CONFIRMED',
      });

      await newReservation.save();

      // Create matching ledger entry in Payments collection
      const paymentRecord = new Payment({
        reservation: newReservation._id,
        user: currentUserId,
        amount: calculatedAmount,
        method: 'DEMO_CARD',
        status: 'COMPLETED',
        transactionId: 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      });
      await paymentRecord.save();

      // Immutable audit log recording the booking creation
      await AuditLog.create({
        actor: currentUserId,
        action: 'CREATE_RESERVATION',
        entityType: 'Reservation',
        entityId: newReservation._id.toString(),
        metadata: {
          bookingCode: uniqueBookingCode,
          estimatedAmount: calculatedAmount,
          durationHours,
        },
      });

      req.flash('success', `Reservation confirmed! Booking Code: ${uniqueBookingCode}`);
      return res.redirect('/customer/bookings');
    } catch (error) {
      next(error);
    }
  };

// Cancel a reservation
module.exports.cancelReservation = async (req, res, next) => {
  try {
    const reservationId = req.params.id;
    const currentUserId = req.session.user._id;

    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    // Only allow customer to cancel their own reservation
    if (
      reservation.user.toString() !== currentUserId.toString() &&
      req.session.user.role === 'CUSTOMER'
    ) {
      req.flash('error', 'Unauthorized to cancel this reservation.');
      return res.redirect('/customer/bookings');
    }

    // Only pending or confirmed reservations can be cancelled
    if (reservation.status !== 'CONFIRMED' && reservation.status !== 'PENDING') {
      req.flash(
        'error',
        `Cannot cancel a reservation with status ${reservation.status}.`
      );
      return res.redirect('/customer/bookings');
    }

    reservation.status = 'CANCELLED';
    await reservation.save();

    // Log cancellation
    await AuditLog.create({
      actor: currentUserId,
      action: 'CANCEL_RESERVATION',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: { bookingCode: reservation.bookingCode },
    });

    req.flash(
      'success',
      `Reservation ${reservation.bookingCode} cancelled successfully.`
    );
    res.redirect('/customer/bookings');
  } catch (error) {
    next(error);
  }
};

// Check-in: Driver arrives at facility gate
module.exports.checkIn = async (req, res, next) => {
  try {
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId);

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    // Only confirmed bookings can check in
    if (reservation.status !== 'CONFIRMED') {
      req.flash(
        'error',
        `Check-in is only allowed for CONFIRMED bookings. Current status: ${reservation.status}`
      );
      return res.redirect('/customer/bookings');
    }

    // Set to active and record entry time
    reservation.status = 'ACTIVE';
    reservation.actualEntryTime = new Date();
    await reservation.save();

    // Mark slot occupied
    await Slot.findByIdAndUpdate(reservation.slot, { status: 'OCCUPIED' });

    // Log check-in
    await AuditLog.create({
      actor: req.session.user._id,
      action: 'CHECK_IN',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: {
        bookingCode: reservation.bookingCode,
        entryTime: reservation.actualEntryTime,
      },
    });

    req.flash('success', 'Checked in successfully! Parking session is now ACTIVE.');
    res.redirect(
      req.session.user.role === 'OPERATOR' ? '/operator/dashboard' : '/customer/bookings'
    );
  } catch (error) {
    next(error);
  }
};

// Check-out: Driver departs gate, calculate final fee
module.exports.checkOut = async (req, res, next) => {
  try {
    const reservationId = req.params.id;
    const reservation = await Reservation.findById(reservationId).populate('facility');

    if (!reservation) {
      req.flash('error', 'Reservation not found.');
      return res.redirect('/customer/bookings');
    }

    // State machine guard: Only ACTIVE bookings may check out
    if (reservation.status !== 'ACTIVE') {
      req.flash(
        'error',
        `Check-out is only allowed for ACTIVE bookings. Current status: ${reservation.status}`
      );
      return res.redirect('/customer/bookings');
    }

    // Authoritative check-out timestamp
    reservation.actualExitTime = new Date();
    const entryTimestamp = reservation.actualEntryTime || reservation.startTime;
    const actualHoursParked = Math.max(
      1,
      Math.ceil((reservation.actualExitTime - entryTimestamp) / (1000 * 60 * 60))
    );

    const hourlyRate = reservation.facility?.pricing?.hourlyRate || 10;
    const currency = reservation.facility?.currency || 'INR';
    const currSymbol = currency === 'INR' ? '₹' : (currency === 'GBP' ? '£' : '$');

    // Finalize fee calculation
    reservation.finalAmount = actualHoursParked * hourlyRate;
    reservation.status = 'COMPLETED';
    await reservation.save();

    // Release physical bay back to AVAILABLE
    await Slot.findByIdAndUpdate(reservation.slot, { status: 'AVAILABLE' });

    // Update matching payment record
    await Payment.findOneAndUpdate(
      { reservation: reservation._id },
      { amount: reservation.finalAmount, status: 'COMPLETED' }
    );

    // Record check-out in audit log
    await AuditLog.create({
      actor: req.session.user._id,
      action: 'CHECK_OUT',
      entityType: 'Reservation',
      entityId: reservation._id.toString(),
      metadata: {
        bookingCode: reservation.bookingCode,
        durationHours: actualHoursParked,
        finalAmount: reservation.finalAmount,
      },
    });

    req.flash(
      'success',
      `Check-out complete! Total finalized fee: ${currSymbol} ${reservation.finalAmount.toFixed(2)}`
    );
    res.redirect(
      req.session.user.role === 'OPERATOR' ? '/operator/dashboard' : '/customer/bookings'
    );
  } catch (error) {
    next(error);
  }
};
