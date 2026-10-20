// Operator Controller: handles facility operations, gate queue, and slot maintenance
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Reservation = require('../models/reservation');
const AuditLog = require('../models/auditLog');

// Operator dashboard with live gate queue and metrics
module.exports.dashboard = async (req, res, next) => {
  try {
    const currentUserId = req.session.user._id;

    // Platform administrators can inspect all facilities; operators only see assigned ones
    const facilityFilter = req.session.user.role === 'ADMIN' ? {} : { operator: currentUserId };

    const managedFacilities = await Facility.find(facilityFilter);
    const managedFacilityIds = managedFacilities.map((facility) => facility._id);

    // Compute live operational KPIs across all assigned facilities
    const [totalBaysCount, activeParkedCarsCount, todayCompletedCount] = await Promise.all([
      Slot.countDocuments({ facility: { $in: managedFacilityIds } }),
      Reservation.countDocuments({ facility: { $in: managedFacilityIds }, status: 'ACTIVE' }),
      Reservation.countDocuments({ facility: { $in: managedFacilityIds }, status: 'COMPLETED' }),
    ]);

    // Retrieve active and incoming reservations requiring gate check-in or check-out
    const activeGateBookings = await Reservation.find({
      facility: { $in: managedFacilityIds },
      status: { $in: ['CONFIRMED', 'ACTIVE'] },
    })
      .populate('facility', 'name address city')
      .populate('slot', 'slotNumber')
      .populate('user', 'name email')
      .populate('vehicle', 'registrationNumber vehicleType')
      .sort({ startTime: 1 });

    res.render('pages/operator/dashboard', {
      facilities: managedFacilities,
      stats: {
        totalFacilities: managedFacilities.length,
        totalSlots: totalBaysCount,
        activeReservationsCount: activeParkedCarsCount,
        todayCompleted: todayCompletedCount,
      },
      activeBookings: activeGateBookings,
      title: 'Operator Dashboard - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};

// View bay inventory and maintenance state for a facility
module.exports.manageSlots = async (req, res, next) => {
  try {
    const { facilityId } = req.query;
    const currentUserId = req.session.user._id;

    const facilityFilter = req.session.user.role === 'ADMIN' ? {} : { operator: currentUserId };
    const managedFacilities = await Facility.find(facilityFilter);

    // Default to the first available facility if no specific facilityId query param is provided
    const targetFacilityId = facilityId || (managedFacilities[0] ? managedFacilities[0]._id : null);

    let slotsList = [];
    let selectedFacility = null;

    if (targetFacilityId) {
      selectedFacility = await Facility.findById(targetFacilityId);
      slotsList = await Slot.find({ facility: targetFacilityId }).sort({ slotNumber: 1 });
    }

    res.render('pages/operator/slots', {
      facilities: managedFacilities,
      selectedFacility,
      slots: slotsList,
      title: 'Slot State & Inventory - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};

// Toggle bay status between AVAILABLE and MAINTENANCE
module.exports.toggleSlotStatus = async (req, res, next) => {
  try {
    const { slotId } = req.params;
    const currentUserId = req.session.user._id;

    const targetSlot = await Slot.findById(slotId);
    if (!targetSlot) {
      req.flash('error', 'Target parking slot not found.');
      return res.redirect('/operator/slots');
    }

    // Toggle: if currently AVAILABLE, switch to MAINTENANCE; otherwise restore to AVAILABLE
    const updatedStatus = targetSlot.status === 'AVAILABLE' ? 'MAINTENANCE' : 'AVAILABLE';
    targetSlot.status = updatedStatus;
    await targetSlot.save();

    // Record this operational mutation in the immutable audit log
    await AuditLog.create({
      actor: currentUserId,
      action: 'TOGGLE_SLOT_STATUS',
      entityType: 'Slot',
      entityId: targetSlot._id.toString(),
      metadata: { slotNumber: targetSlot.slotNumber, status: updatedStatus },
    });

    req.flash('success', `Bay ${targetSlot.slotNumber} status switched to ${updatedStatus}.`);
    res.redirect(`/operator/slots?facilityId=${targetSlot.facility}`);
  } catch (error) {
    next(error);
  }
};
