const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Reservation = require('../models/reservation');
const AuditLog = require('../models/auditLog');

module.exports.dashboard = async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const filter = req.session.user.role === 'ADMIN' ? {} : { operator: userId };

    const facilities = await Facility.find(filter);
    const facilityIds = facilities.map((f) => f._id);

    const [totalSlots, activeReservationsCount, todayCompleted] = await Promise.all([
      Slot.countDocuments({ facility: { $in: facilityIds } }),
      Reservation.countDocuments({ facility: { $in: facilityIds }, status: 'ACTIVE' }),
      Reservation.countDocuments({ facility: { $in: facilityIds }, status: 'COMPLETED' }),
    ]);

    const activeBookings = await Reservation.find({ facility: { $in: facilityIds }, status: { $in: ['CONFIRMED', 'ACTIVE'] } })
      .populate('facility', 'name')
      .populate('slot', 'slotNumber')
      .populate('user', 'name email')
      .populate('vehicle', 'registrationNumber vehicleType')
      .sort({ startTime: 1 });

    res.render('pages/operator/dashboard', {
      facilities,
      stats: {
        totalFacilities: facilities.length,
        totalSlots,
        activeReservationsCount,
        todayCompleted,
      },
      activeBookings,
      title: 'Operator Dashboard - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.manageSlots = async (req, res, next) => {
  try {
    const { facilityId } = req.query;
    const userId = req.session.user._id;

    const facilities = await Facility.find(req.session.user.role === 'ADMIN' ? {} : { operator: userId });
    const selectedFacilityId = facilityId || (facilities[0] ? facilities[0]._id : null);

    let slots = [];
    let selectedFacility = null;

    if (selectedFacilityId) {
      selectedFacility = await Facility.findById(selectedFacilityId);
      slots = await Slot.find({ facility: selectedFacilityId }).sort({ slotNumber: 1 });
    }

    res.render('pages/operator/slots', {
      facilities,
      selectedFacility,
      slots,
      title: 'Slot State & Inventory - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.toggleSlotStatus = async (req, res, next) => {
  try {
    const { slotId } = req.params;
    const slot = await Slot.findById(slotId);

    if (!slot) {
      req.flash('error', 'Slot not found.');
      return res.redirect('/operator/slots');
    }

    const newStatus = slot.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    slot.status = newStatus;
    await slot.save();

    await AuditLog.create({
      actor: req.session.user._id,
      action: 'TOGGLE_SLOT_STATUS',
      entityType: 'Slot',
      entityId: slot._id.toString(),
      metadata: { slotNumber: slot.slotNumber, status: newStatus },
    });

    req.flash('success', `Slot ${slot.slotNumber} status changed to ${newStatus}.`);
    res.redirect(`/operator/slots?facilityId=${slot.facility}`);
  } catch (err) {
    next(err);
  }
};
