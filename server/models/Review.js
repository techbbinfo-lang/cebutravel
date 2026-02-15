import { ObjectId } from 'mongodb';

let reviewsCollection;

export const initializeReviewsCollection = (db) => {
  reviewsCollection = db.collection('reviews');
};

export const Review = {
  // Create a new review
  async create(reviewData) {
    const review = {
      ...reviewData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await reviewsCollection.insertOne(review);
    return { _id: result.insertedId, ...review };
  },

  // Find review by ID
  async findById(id) {
    return await reviewsCollection.findOne({ _id: new ObjectId(id) });
  },

  // Get tour reviews
  async findByTourId(tourId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const reviews = await reviewsCollection
      .find({ tourId: new ObjectId(tourId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await reviewsCollection.countDocuments({
      tourId: new ObjectId(tourId),
    });

    return {
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Get user reviews
  async findByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const reviews = await reviewsCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();
    const total = await reviewsCollection.countDocuments({
      userId: new ObjectId(userId),
    });

    return {
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  },

  // Check if user already reviewed
  async hasReviewed(tourId, userId) {
    return await reviewsCollection.findOne({
      tourId: new ObjectId(tourId),
      userId: new ObjectId(userId),
    });
  },

  // Update review
  async updateById(id, updateData) {
    const result = await reviewsCollection.findOneAndUpdate(
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

  // Delete review
  async deleteById(id) {
    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(id),
    });
    return result.deletedCount > 0;
  },

  // Calculate average rating
  async calculateAverageRating(tourId) {
    const result = await reviewsCollection
      .aggregate([
        { $match: { tourId: new ObjectId(tourId) } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    if (result.length === 0) {
      return { averageRating: 0, count: 0 };
    }

    return {
      averageRating: Math.round(result[0].averageRating * 10) / 10,
      count: result[0].count,
    };
  },
};
