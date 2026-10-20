// Users Controller: handles customer dashboard and booking history
const Reservation = require('../models/reservation');
const Vehicle = require('../models/vehicle');
const Facility = require('../models/facility');

// Customer dashboard with trip stats and recent bookings
module.exports.customerDashboard = async (req, res, next) => {
  try {
    const currentUserId = req.session.user._id;

    // Concurrently fetch counts and recent trips using Promise.all for high performance
    const [activeBookingsCount, totalCompletedStays, registeredVehiclesCount, recentReservations] =
      await Promise.all([
        // Count reservations currently in flight or confirmed
        Reservation.countDocuments({
          user: currentUserId,
          status: { $in: ['CONFIRMED', 'ACTIVE'] },
        }),
        // Count lifetime completed parking sessions
        Reservation.countDocuments({
          user: currentUserId,
          status: 'COMPLETED',
        }),
        // Count total vehicles registered by this customer
        Vehicle.countDocuments({ user: currentUserId }),
        // Fetch up to 5 most recent reservations with linked facility and slot metadata
        Reservation.find({ user: currentUserId })
          .populate('facility', 'name address city')
          .populate('slot', 'slotNumber')
          .populate('vehicle', 'registrationNumber vehicleType')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    res.render('pages/customer/dashboard', {
      stats: {
        activeBookingsCount,
        totalCompleted: totalCompletedStays,
        vehiclesCount: registeredVehiclesCount,
      },
      recentBookings: recentReservations,
      title: 'Customer Dashboard - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};

// View complete reservation history for the logged-in customer
module.exports.customerBookings = async (req, res, next) => {
  try {
    const currentUserId = req.session.user._id;

    // Fetch all user reservations, populating facility pricing, slot attributes, and vehicle info
    const customerBookingsList = await Reservation.find({ user: currentUserId })
      .populate('facility', 'name address city pricing currency')
      .populate('slot', 'slotNumber slotType isEV')
      .populate('vehicle', 'registrationNumber vehicleType make model')
      .sort({ createdAt: -1 });

    res.render('pages/customer/bookings', {
      bookings: customerBookingsList,
      title: 'My Reservations - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};
