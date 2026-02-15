import { ObjectId } from 'mongodb';

let toursCollection;

export const initializeToursCollection = (db) => {
  toursCollection = db.collection('tours');
};

export const Tour = {
  // Create a new tour
  async create(tourData) {
    const tour = {
      ...tourData,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await toursCollection.insertOne(tour);
    return { _id: result.insertedId, ...tour };
  },

  // Find tour by ID
  async findById(id) {
    return await toursCollection.findOne({ _id: new ObjectId(id) });
  },

  // Get all tours with filtering
  async getAll(filters = {}, page = 1, limit = 12) {
    const skip = (page - 1) * limit;
    const query = {};

    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.minPrice !== undefined) {
      query.price = { $gte: filters.minPrice };
    }
    if (filters.maxPrice !== undefined) {
      query.price = query.price
        ? { ...query.price, $lte: filters.maxPrice }
        : { $lte: filters.maxPrice };
    }
    if (filters.minRating !== undefined) {
      query.rating = { $gte: filters.minRating };
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    let cursor = toursCollection.find(query);

    // Sorting options
    if (filters.sort === 'price-asc') {
      cursor = cursor.sort({ price: 1 });
    } else if (filters.sort === 'price-desc') {
      cursor = cursor.sort({ price: -1 });
    } else if (filters.sort === 'rating') {
      cursor = cursor.sort({ rating: -1 });
    } else {
      cursor = cursor.sort({ createdAt: -1 });
    }

    const tours = await cursor.skip(skip).limit(limit).toArray();
    const total = await toursCollection.countDocuments(query);

    return {
      tours,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Get featured tours
  async getFeatured(limit = 6) {
    return await toursCollection
      .find({ featured: true })
      .sort({ rating: -1 })
      .limit(limit)
      .toArray();
  },

  // Update tour
  async updateById(id, updateData) {
    const result = await toursCollection.findOneAndUpdate(
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

  // Delete tour
  async deleteById(id) {
    const result = await toursCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result.deletedCount > 0;
  },

  // Update rating
  async updateRating(id, newRating, reviewCount) {
    return await toursCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          rating: newRating,
          reviewCount: reviewCount,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    );
  },
};
