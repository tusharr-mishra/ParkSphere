require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const Payment = require('../models/payment');
const Review = require('../models/review');
const AuditLog = require('../models/auditLog');
const { facilitiesData } = require('./data');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parksphere';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('[Seed] Connected successfully.');

    // Clear existing records
    console.log('[Seed] Clearing old database collections...');
    await Promise.all([
      User.deleteMany({}),
      Facility.deleteMany({}),
      Slot.deleteMany({}),
      Vehicle.deleteMany({}),
      Reservation.deleteMany({}),
      Payment.deleteMany({}),
      Review.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    // 1. Create Seed Users
    console.log('[Seed] Creating Seed Users (Admin, Operators, Customers)...');
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const operatorPass = await bcrypt.hash('operator123', salt);
    const customerPass = await bcrypt.hash('customer123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@parksphere.com',
      password: adminPass,
      role: 'ADMIN',
      isEmailVerified: true,
    });

    const operatorSF = await User.create({
      name: 'SF Facility Operations',
      email: 'operator.sf@parksphere.com',
      password: operatorPass,
      role: 'OPERATOR',
      isEmailVerified: true,
    });

    const operatorSeattle = await User.create({
      name: 'Seattle Parking Manager',
      email: 'operator.seattle@parksphere.com',
      password: operatorPass,
      role: 'OPERATOR',
      isEmailVerified: true,
    });

    const customer1 = await User.create({
      name: 'Sarah Connor',
      email: 'customer@parksphere.com',
      password: customerPass,
      role: 'CUSTOMER',
      isEmailVerified: true,
    });

    const customer2 = await User.create({
      name: 'David Miller',
      email: 'david@parksphere.com',
      password: customerPass,
      role: 'CUSTOMER',
      isEmailVerified: true,
    });

    // 2. Create Vehicles for Customer
    console.log('[Seed] Registering demo vehicles...');
    const vehicle1 = await Vehicle.create({
      user: customer1._id,
      registrationNumber: '7XYZ890',
      vehicleType: 'SEDAN',
      isEV: true,
      make: 'Tesla',
      model: 'Model 3',
    });

    const vehicle2 = await Vehicle.create({
      user: customer1._id,
      registrationNumber: '6ABC123',
      vehicleType: 'SUV',
      isEV: false,
      make: 'Toyota',
      model: 'RAV4',
    });

    // 3. Create Facilities and Slots
    console.log('[Seed] Generating facilities and bays...');
    const facilityRecords = [];

    for (let fData of facilitiesData) {
      const assignedOp = fData.city === 'San Francisco' ? operatorSF._id : operatorSeattle._id;
      const facility = await Facility.create({
        ...fData,
        operator: assignedOp,
      });
      facilityRecords.push(facility);

      // Create individual slots for each facility
      const slotTypes = ['COMPACT', 'SEDAN', 'SEDAN', 'SUV', 'TWO_WHEELER'];
      const slotsToInsert = [];

      for (let i = 1; i <= facility.totalSlots; i++) {
        const slotNumber = `${String.fromCharCode(65 + Math.floor((i - 1) / 10))}-${String((i - 1) % 10 + 1).padStart(2, '0')}`;
        const slotType = slotTypes[i % slotTypes.length];
        const isEV = i % 4 === 0;

        slotsToInsert.push({
          facility: facility._id,
          slotNumber,
          slotType,
          isEV,
          status: 'AVAILABLE',
        });
      }

      await Slot.insertMany(slotsToInsert);
    }

    // 4. Create Sample Reservations
    console.log('[Seed] Creating sample reservations & audit trail...');
    const primaryFacility = facilityRecords[0];
    const availableSlots = await Slot.find({ facility: primaryFacility._id }).limit(3);

    // Active reservation
    const now = new Date();
    const activeRes = await Reservation.create({
      bookingCode: 'PS-892104',
      user: customer1._id,
      facility: primaryFacility._id,
      slot: availableSlots[0]._id,
      vehicle: vehicle1._id,
      startTime: new Date(now.getTime() - 45 * 60 * 1000), // 45m ago
      endTime: new Date(now.getTime() + 2 * 60 * 60 * 1000), // in 2h
      actualEntryTime: new Date(now.getTime() - 40 * 60 * 1000),
      estimatedAmount: 29.00,
      finalAmount: 29.00,
      status: 'ACTIVE',
    });
    // Mark slot occupied
    await Slot.findByIdAndUpdate(availableSlots[0]._id, { status: 'OCCUPIED' });

    // Completed reservation
    await Reservation.create({
      bookingCode: 'PS-712395',
      user: customer1._id,
      facility: primaryFacility._id,
      slot: availableSlots[1]._id,
      vehicle: vehicle1._id,
      startTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endTime: new Date(now.getTime() - 21 * 60 * 60 * 1000),
      actualEntryTime: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      actualExitTime: new Date(now.getTime() - 21 * 60 * 60 * 1000),
      estimatedAmount: 43.50,
      finalAmount: 43.50,
      status: 'COMPLETED',
    });

    // Sample Payment records
    await Payment.create({
      reservation: activeRes._id,
      user: customer1._id,
      amount: 29.00,
      method: 'DEMO_CARD',
      status: 'COMPLETED',
      transactionId: 'TXN-DEMO-001',
    });

    // Sample Review
    await Review.create({
      facility: primaryFacility._id,
      user: customer1._id,
      rating: 5,
      comment: 'Super seamless experience! Bay was open and EV charging worked perfectly.',
    });

    // Sample Audit Log
    await AuditLog.create({
      actor: admin._id,
      action: 'SYSTEM_SEED_INITIALIZE',
      entityType: 'System',
      entityId: 'SYSTEM',
      metadata: { facilitiesCount: facilityRecords.length, status: 'SUCCESS' },
    });

    console.log('\n======================================================');
    console.log('  🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('------------------------------------------------------');
    console.log('  Customer Login: customer@parksphere.com / customer123');
    console.log('  Operator Login: operator.sf@parksphere.com / operator123');
    console.log('  Admin Login:    admin@parksphere.com / admin123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Seeding failed with error:', err);
    process.exit(1);
  }
};

seedDatabase();
