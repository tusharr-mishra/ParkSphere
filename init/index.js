// Database seed script - populates parking facilities and bays into MongoDB
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/user');
const Facility = require('../models/facility');
const Slot = require('../models/slot');
const Vehicle = require('../models/vehicle');
const Reservation = require('../models/reservation');
const Payment = require('../models/payment');
const Review = require('../models/review');
const AuditLog = require('../models/auditLog');
const { facilitiesData } = require('./data');

const DB_URL = process.env.ATLASDB_URL || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/parksphere';

const seedDatabase = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB at:', DB_URL.split('@').length > 1 ? DB_URL.split('@')[1] : DB_URL);
    await mongoose.connect(DB_URL);
    console.log('[Seed] Connected successfully.');

    // Clear all existing collections
    console.log('[Seed] Clearing database collections...');
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

    // Create Facilities and Bays (No dummy accounts or bookings)
    console.log(`[Seed] Generating ${facilitiesData.length} facilities and parking bays...`);
    const facilityRecords = [];

    for (let fData of facilitiesData) {
      const facility = await Facility.create(fData);
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

    const totalSlotsCount = await Slot.countDocuments();

    console.log('\n======================================================');
    console.log('  🎉 DATABASE INITIALIZED WITH CLEAN CATALOG!');
    console.log('------------------------------------------------------');
    console.log(`  Facilities Loaded: ${facilityRecords.length}`);
    console.log(`  Total Bays Ready:  ${totalSlotsCount}`);
    console.log('  User Accounts:     0 (Fresh for real sign up & testing)');
    console.log('  Reservations:      0');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Seeding failed with error:', err);
    process.exit(1);
  }
};

seedDatabase();
