const Vehicle = require('../models/vehicle');

module.exports.index = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('pages/customer/vehicles', {
      vehicles,
      title: 'My Vehicles - ParkSphere',
    });
  } catch (err) {
    next(err);
  }
};

module.exports.create = async (req, res, next) => {
  try {
    const { registrationNumber, vehicleType, isEV, make, model } = req.body;
    if (!registrationNumber) {
      req.flash('error', 'License plate / registration number is required.');
      return res.redirect('/customer/vehicles');
    }

    const existing = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase().trim() });
    if (existing) {
      req.flash('error', 'A vehicle with this license plate is already registered.');
      return res.redirect('/customer/vehicles');
    }

    const vehicle = new Vehicle({
      user: req.session.user._id,
      registrationNumber: registrationNumber.toUpperCase().trim(),
      vehicleType: vehicleType || 'SEDAN',
      isEV: isEV === 'on' || isEV === 'true',
      make: make || '',
      model: model || '',
    });

    await vehicle.save();
    req.flash('success', `Vehicle ${vehicle.registrationNumber} registered successfully!`);
    res.redirect('/customer/vehicles');
  } catch (err) {
    next(err);
  }
};

module.exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Vehicle.findOneAndDelete({ _id: id, user: req.session.user._id });
    req.flash('success', 'Vehicle removed.');
    res.redirect('/customer/vehicles');
  } catch (err) {
    next(err);
  }
};
