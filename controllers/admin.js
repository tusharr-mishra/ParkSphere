// Admin Controller: handles platform-wide metrics and audit log viewing
const User = require('../models/user');
const Facility = require('../models/facility');
const Reservation = require('../models/reservation');
const AuditLog = require('../models/auditLog');
const Payment = require('../models/payment');

// Admin dashboard with platform KPIs and recent users
module.exports.dashboard = async (req, res, next) => {
  try {
    // Concurrently aggregate core platform figures
    const [
      totalUsersCount,
      totalFacilitiesCount,
      totalReservationsCount,
      revenueAggregationResult,
      recentlyJoinedUsers,
    ] = await Promise.all([
      // Count total registered users
      User.countDocuments(),
      // Count active facilities in network
      Facility.countDocuments(),
      // Count total reservations created
      Reservation.countDocuments(),
      // MongoDB aggregation pipeline to compute gross completed revenue
      Payment.aggregate([
        { $match: { status: 'COMPLETED' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Fetch 10 most recently joined platform accounts
      User.find().sort({ createdAt: -1 }).limit(10),
    ]);

    // Extract total revenue from aggregation output (or 0 if no transactions exist yet)
    const grossPlatformRevenue =
      revenueAggregationResult.length > 0 ? revenueAggregationResult[0].total : 0;

    res.render('pages/admin/dashboard', {
      stats: {
        totalUsers: totalUsersCount,
        totalFacilities: totalFacilitiesCount,
        totalReservations: totalReservationsCount,
        totalRevenue: grossPlatformRevenue,
      },
      recentUsers: recentlyJoinedUsers,
      title: 'Administrator Governance - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};

// View audit logs of operational and administrative actions
module.exports.auditLogs = async (req, res, next) => {
  try {
    // Fetch recent 50 audit entries, populating actor identity details
    const recentAuditEntries = await AuditLog.find()
      .populate('actor', 'name email role')
      .sort({ timestamp: -1 })
      .limit(50);

    res.render('pages/admin/auditLogs', {
      logs: recentAuditEntries,
      title: 'Audit Log Explorer - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};
