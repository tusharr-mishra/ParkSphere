const User = require('../models/user');
const Facility = require('../models/facility');
const Reservation = require('../models/reservation');
const AuditLog = require('../models/auditLog');
const Payment = require('../models/payment');

module.exports.dashboard = async (req, res, next) => {
  try {
    const [totalUsers, totalFacilities, totalReservations, totalRevenueResult, recentUsers] =
      await Promise.all([
        User.countDocuments(),
        Facility.countDocuments(),
        Reservation.countDocuments(),
        Payment.aggregate([
          { $match: { status: 'COMPLETED' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        User.find().sort({ createdAt: -1 }).limit(10),
      ]);

    const totalRevenue = totalRevenueResult[0] ? totalRevenueResult[0].total : 0;

    res.render('pages/admin/dashboard', {
      stats: {
        totalUsers,
        totalFacilities,
        totalReservations,
        totalRevenue,
      },
      recentUsers,
      title: 'Administrator Governance - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.auditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find()
      .populate('actor', 'name email role')
      .sort({ timestamp: -1 })
      .limit(50);

    res.render('pages/admin/auditLogs', {
      logs,
      title: 'Audit Log Explorer - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};
