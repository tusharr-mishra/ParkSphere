const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const ExpressError = require('../utils/ExpressError');

/**
 * Browse and search facilities with filtering
 */
module.exports.index = async (req, res, next) => {
  try {
    const { city, isEV, maxPrice, sort } = req.query;
    const filter = { isActive: true };

    if (city && city.trim() !== '') {
      filter.city = new RegExp(city.trim(), 'i');
    }

    if (maxPrice && !isNaN(maxPrice)) {
      filter['pricing.hourlyRate'] = { $lte: Number(maxPrice) };
    }

    let query = Facility.find(filter);

    if (sort === 'price_asc') {
      query = query.sort({ 'pricing.hourlyRate': 1 });
    } else if (sort === 'price_desc') {
      query = query.sort({ 'pricing.hourlyRate': -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const facilities = await query.exec();

    res.render('pages/parking/index', {
      facilities,
      searchQuery: { city: city || '', isEV: !!isEV, maxPrice: maxPrice || '', sort: sort || '' },
      title: 'Find Parking Facilities - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * View facility details, slot inventory, and booking modal
 */
module.exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id).populate('operator', 'name email');

    if (!facility) {
      req.flash('error', 'Parking facility not found.');
      return res.redirect('/parking');
    }

    // Load physical slots for this facility
    const slots = await Slot.find({ facility: facility._id }).sort({ slotNumber: 1 });

    // Load customer's registered vehicles if logged in
    let userVehicles = [];
    if (req.session.user) {
      userVehicles = await Vehicle.find({ user: req.session.user._id });
    }

    // Load facility reviews
    const reviews = await Review.find({ facility: facility._id }).populate('user', 'name').sort({ createdAt: -1 });

    res.render('pages/parking/show', {
      facility,
      slots,
      userVehicles,
      reviews,
      title: `${facility.name} - ParkSphere`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * API / Helper to check slot availability for a specified time interval
 * Overlap Rule: existing.startTime < requestedEnd AND existing.endTime > requestedStart
 * Blocking Statuses: CONFIRMED, ACTIVE, PENDING (unexpired)
 */
module.exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { facilityId } = req.params;
    const { startTime, endTime, isEV, vehicleType } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Start time and end time are required' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ success: false, message: 'Invalid start or end date interval' });
    }

    // 1. Find all active reservations that overlap the requested interval
    const blockingReservations = await Reservation.find({
      facility: facilityId,
      status: { $in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
      startTime: { $lt: end },
      endTime: { $gt: start },
    }).select('slot');

    const bookedSlotIds = blockingReservations.map((r) => r.slot.toString());

    // 2. Fetch available slots matching vehicle attributes
    const slotFilter = {
      facility: facilityId,
      status: 'AVAILABLE',
      _id: { $nin: bookedSlotIds },
    };

    if (isEV === 'true') {
      slotFilter.isEV = true;
    }
    if (vehicleType && vehicleType !== 'ALL') {
      slotFilter.slotType = vehicleType;
    }

    const availableSlots = await Slot.find(slotFilter).sort({ slotNumber: 1 });

    res.json({
      success: true,
      data: {
        totalAvailable: availableSlots.length,
        slots: availableSlots,
      },
    });
  } catch (err) {
    next(err);
  }
};
