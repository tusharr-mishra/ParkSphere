// Vehicle Controller: handles customer vehicle registration, list, and removal
const Vehicle = require('../models/vehicle');

// List customer vehicles
module.exports.index = async (req, res, next) => {
  try {
    const currentUserId = req.session.user._id;
    const registeredVehicles = await Vehicle.find({ user: currentUserId }).sort({ createdAt: -1 });

    res.render('pages/customer/vehicles', {
      vehicles: registeredVehicles,
      title: 'My Vehicles - ParkSphere',
    });
  } catch (error) {
    next(error);
  }
};

// Register a new vehicle
module.exports.create = async (req, res, next) => {
  try {
    const currentUserId = req.session.user._id;
    const { registrationNumber, vehicleType, isEV, make, model } = req.body;

    // Validation: Ensure the license plate is not empty
    if (!registrationNumber || registrationNumber.trim() === '') {
      req.flash('error', 'License plate / registration number is required.');
      return res.redirect('/customer/vehicles');
    }

    // Standardize registration number to uppercase without leading/trailing whitespace
    const cleanPlateNumber = registrationNumber.toUpperCase().trim();

    // Check if this license plate already exists across registered vehicles
    const existingVehicle = await Vehicle.findOne({ registrationNumber: cleanPlateNumber });
    if (existingVehicle) {
      req.flash('error', 'A vehicle with this license plate is already registered.');
      return res.redirect('/customer/vehicles');
    }

    // Determine EV compatibility (checkbox input sends 'on' or boolean string)
    const isElectricVehicle = isEV === 'on' || isEV === 'true';

    // Construct and save the new vehicle record
    const newVehicle = new Vehicle({
      user: currentUserId,
      registrationNumber: cleanPlateNumber,
      vehicleType: vehicleType || 'SEDAN',
      isEV: isElectricVehicle,
      make: (make || '').trim(),
      model: (model || '').trim(),
    });

    await newVehicle.save();

    req.flash('success', `Vehicle ${newVehicle.registrationNumber} registered successfully!`);
    res.redirect('/customer/vehicles');
  } catch (error) {
    next(error);
  }
};

// Remove a customer vehicle
module.exports.delete = async (req, res, next) => {
  try {
    const vehicleIdToDelete = req.params.id;
    const currentUserId = req.session.user._id;

    // Ensure the vehicle belongs to the currently logged in user before deletion
    const deletedVehicle = await Vehicle.findOneAndDelete({
      _id: vehicleIdToDelete,
      user: currentUserId,
    });

    if (!deletedVehicle) {
      req.flash('error', 'Vehicle not found or you are not authorized to remove it.');
      return res.redirect('/customer/vehicles');
    }

    req.flash('success', `Vehicle ${deletedVehicle.registrationNumber} removed successfully.`);
    res.redirect('/customer/vehicles');
  } catch (error) {
    next(error);
  }
};
