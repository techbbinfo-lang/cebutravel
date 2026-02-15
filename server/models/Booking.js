import { ObjectId } from 'mongodb';

let bookingsCollection;

export const initializeBookingsCollection = (db) => {
  bookingsCollection = db.collection('bookings');
};

export const Booking = {
  // Create a new booking
  async create(bookingData) {
    const booking = {
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await bookingsCollection.insertOne(booking);
    return { _id: result.insertedId, ...booking };
  },

  // Find booking by ID
  async findById(id) {
    return await bookingsCollection.findOne({ _id: new ObjectId(id) });
  },

  // Get user's bookings
  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const bookings = await bookingsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await bookingsCollection.countDocuments({
      userId: new ObjectId(userId),
    });
    return {
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Get all bookings for tour
  async findByTourId(tourId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const bookings = await bookingsCollection
      .find({ tourId: new ObjectId(tourId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await bookingsCollection.countDocuments({
      tourId: new ObjectId(tourId),
    });
    return {
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Get all bookings (admin)
  async getAll(filters = {}, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.userId) {
      query.userId = new ObjectId(filters.userId);
    }

    const bookings = await bookingsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await bookingsCollection.countDocuments(query);

    return {
      bookings,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Update booking status
  async updateStatus(id, status) {
    const result = await bookingsCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  },

  // Cancel booking
  async cancel(id) {
    return await this.updateStatus(id, 'cancelled');
  },

  // Delete booking
  async deleteById(id) {
    const result = await bookingsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result.deletedCount > 0;
  },

  // Check availability
  async checkAvailability(tourId, startDate, endDate) {
    const conflictingBookings = await bookingsCollection.countDocuments({
      tourId: new ObjectId(tourId),
      status: { $in: ['confirmed', 'pending'] },
      $or: [
        { startDate: { $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate) } },
      ],
    });
    return conflictingBookings === 0;
  },
};
