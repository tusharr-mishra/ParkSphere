const Reservation = require('../models/reservation');
const Vehicle = require('../models/vehicle');
const Facility = require('../models/facility');

module.exports.customerDashboard = async (req, res, next) => {
  try {
    const userId = req.session.user._id;

    const [activeBookingsCount, totalCompleted, vehiclesCount, recentBookings] = await Promise.all([
      Reservation.countDocuments({ user: userId, status: { $in: ['CONFIRMED', 'ACTIVE'] } }),
      Reservation.countDocuments({ user: userId, status: 'COMPLETED' }),
      Vehicle.countDocuments({ user: userId }),
      Reservation.find({ user: userId })
        .populate('facility', 'name address city')
        .populate('slot', 'slotNumber')
        .populate('vehicle', 'registrationNumber vehicleType')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.render('pages/customer/dashboard', {
      stats: { activeBookingsCount, totalCompleted, vehiclesCount },
      recentBookings,
      title: 'Customer Dashboard - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.customerBookings = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const bookings = await Reservation.find({ user: userId })
      .populate('facility', 'name address city pricing')
      .populate('slot', 'slotNumber slotType isEV')
      .populate('vehicle', 'registrationNumber vehicleType make model')
      .sort({ createdAt: -1 });

    res.render('pages/customer/bookings', {
      bookings,
      title: 'My Reservations - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};
