import { MongoClient, ObjectId } from 'mongodb';

let usersCollection;

export const initializeUsersCollection = (db) => {
  usersCollection = db.collection('users');
};

export const User = {
  // Create a new user
  async create(userData) {
    const user = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await usersCollection.insertOne(user);
    return { _id: result.insertedId, ...user };
  },

  // Find user by email
  async findByEmail(email) {
    return await usersCollection.findOne({ email: email.toLowerCase() });
  },

  // Find user by ID
  async findById(id) {
    return await usersCollection.findOne({ _id: new ObjectId(id) });
  },

  // Find user with sensitive data excluded
  async findByIdPublic(id) {
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    return user;
  },

  // Update user
  async updateById(id, updateData) {
    const result = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
    return result.value;
  },

  // Check if user exists
  async exists(email) {
    return await usersCollection.findOne({ email: email.toLowerCase() });
  },

  // Get all users (for admin)
  async getAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const users = await usersCollection
      .find({}, { projection: { password: 0 } })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await usersCollection.countDocuments();
    return { users, total, page, pages: Math.ceil(total / limit) };
  },
};
