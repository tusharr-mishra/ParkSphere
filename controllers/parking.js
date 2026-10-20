// Parking Controller: handles parking facility catalog, search, facility details, and reviews
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Review = require('../models/review');
const Reservation = require('../models/reservation');
const ExpressError = require('../utils/ExpressError');

// Display parking catalog with search and filters
module.exports.index = async (req, res, next) => {
  try {
    const { city, isEV, maxPrice, sort, category } = req.query;

    // Filter only operational facilities
    const databaseQueryFilter = { isActive: true };

    // Case-insensitive regex search by city name
    if (city && city.trim() !== '') {
      databaseQueryFilter.city = new RegExp(city.trim(), 'i');
    }

    // Optional ceiling filter for hourly rate
    if (maxPrice && !isNaN(maxPrice)) {
      databaseQueryFilter['pricing.hourlyRate'] = { $lte: Number(maxPrice) };
    }

    // Amenity and category categorization
    if (isEV === 'true' || category === 'EV Charging') {
      databaseQueryFilter.amenities = { $in: ['EV_CHARGING', 'EV'] };
    } else if (category === 'Covered Garages') {
      databaseQueryFilter.amenities = { $in: ['COVERED'] };
    } else if (category === 'CCTV Secured') {
      databaseQueryFilter.amenities = { $in: ['CCTV', 'SECURITY_24_7'] };
    } else if (category === 'Valet Bays') {
      databaseQueryFilter.amenities = { $in: ['VALET'] };
    } else if (category === '24/7 Access') {
      databaseQueryFilter.amenities = { $in: ['SECURITY_24_7', '24_7'] };
    } else if (category === 'Downtown Hubs') {
      databaseQueryFilter.name = { $regex: /hub|downtown|plaza|center|centre|palika|market|cyber/i };
    } else if (category === 'Airport Parking') {
      databaseQueryFilter.name = { $regex: /airport|terminal|aerocity|transit/i };
    } else if (category === 'Underground') {
      databaseQueryFilter.name = { $regex: /underground|palika|basement/i };
    } else if (category === 'Budget Bays') {
      databaseQueryFilter['pricing.hourlyRate'] = { $lte: 70 };
    } else if (category === 'SUV / Trucks') {
      databaseQueryFilter.totalSlots = { $gte: 30 };
    } else if (category === 'Events & Arenas') {
      databaseQueryFilter.name = { $regex: /arena|stadium|complex|center|centre|park/i };
    } else if (category === 'Overnight Stays') {
      databaseQueryFilter.amenities = { $in: ['SECURITY_24_7', 'COVERED'] };
    } else if (category === 'Motorcycle') {
      databaseQueryFilter.amenities = { $in: ['COVERED', 'CCTV'] };
    }

    let facilitiesQuery = Facility.find(databaseQueryFilter);

    // Apply sorting rules
    if (sort === 'price_asc') {
      facilitiesQuery = facilitiesQuery.sort({ 'pricing.hourlyRate': 1 });
    } else if (sort === 'price_desc') {
      facilitiesQuery = facilitiesQuery.sort({ 'pricing.hourlyRate': -1 });
    } else {
      facilitiesQuery = facilitiesQuery.sort({ createdAt: -1 });
    }

    const matchedFacilities = await facilitiesQuery.exec();

    res.render('pages/parking/index', {
      facilities: matchedFacilities,
      category: category || 'Popular',
      searchQuery: {
        city: city || '',
        isEV: isEV === 'true',
        maxPrice: maxPrice || '',
        sort: sort || '',
      },
      title: 'ParkSphere | Smart Parking Platform',
    });
  } catch (error) {
    next(error);
  }
};

// Show single facility details, bays, and reviews
module.exports.show = async (req, res, next) => {
  try {
    const facilityId = req.params.id;

    const targetFacility = await Facility.findById(facilityId).populate(
      'operator',
      'name email'
    );

    if (!targetFacility) {
      req.flash('error', 'Parking facility not found.');
      return res.redirect('/parking');
    }

    const facilitySlots = await Slot.find({ facility: targetFacility._id }).sort({
      slotNumber: 1,
    });

    let customerVehicles = [];
    if (req.session.user) {
      customerVehicles = await Vehicle.find({ user: req.session.user._id });
    }

    const facilityReviews = await Review.find({ facility: targetFacility._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.render('pages/parking/show', {
      facility: targetFacility,
      slots: facilitySlots,
      userVehicles: customerVehicles,
      reviews: facilityReviews,
      title: `${targetFacility.name} - ParkSphere`,
    });
  } catch (error) {
    next(error);
  }
};

// API: Check slot availability for a time window
module.exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { facilityId } = req.params;
    const { startTime, endTime, isEV, vehicleType } = req.query;

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time and end time are required.',
      });
    }

    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(endTime);

    if (isNaN(requestedStart) || isNaN(requestedEnd) || requestedStart >= requestedEnd) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date window: End time must be after start time.',
      });
    }

    // Find bookings that overlap: existing.start < requestedEnd && existing.end > requestedStart
    const overlappingBookings = await Reservation.find({
      facility: facilityId,
      status: { $in: ['CONFIRMED', 'ACTIVE', 'PENDING'] },
      startTime: { $lt: requestedEnd },
      endTime: { $gt: requestedStart },
    }).select('slot');

    const blockedSlotIds = overlappingBookings.map((booking) => booking.slot.toString());

    const slotCriteria = {
      facility: facilityId,
      status: 'AVAILABLE',
      _id: { $nin: blockedSlotIds },
    };

    if (isEV === 'true') {
      slotCriteria.isEV = true;
    }
    if (vehicleType && vehicleType !== 'ALL') {
      slotCriteria.slotType = vehicleType;
    }

    const openSlots = await Slot.find(slotCriteria).sort({ slotNumber: 1 });

    res.json({
      success: true,
      data: {
        totalAvailable: openSlots.length,
        slots: openSlots,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Create a review
module.exports.createReview = async (req, res, next) => {
  try {
    const facilityId = req.params.id;
    const { rating, comment } = req.body;

    if (!req.session.user) {
      req.flash('error', 'Please sign in to post a review.');
      return res.redirect(`/parking/${facilityId}`);
    }

    await Review.create({
      facility: facilityId,
      user: req.session.user._id,
      rating: Number(rating) || 5,
      comment: (comment || 'Smooth, clean and hassle-free parking experience!').trim(),
    });

    req.flash('success', 'Thank you! Your verified review has been submitted.');
    res.redirect(`/parking/${facilityId}`);
  } catch (error) {
    next(error);
  }
};
