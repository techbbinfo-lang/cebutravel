import { Tour } from '../models/Tour.js';
import { Review } from '../models/Review.js';

export const createTour = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      duration,
      category,
      location,
      groupSize,
      image,
      images,
      itinerary,
      highlights,
      included,
      notIncluded,
      difficulty,
      featured,
    } = req.body;

    const newTour = await Tour.create({
      title,
      description,
      price: parseFloat(price),
      duration,
      category,
      location,
      groupSize: parseInt(groupSize),
      image: image || images?.[0],
      images: images || [image],
      itinerary: itinerary || [],
      highlights: highlights || [],
      included: included || [],
      notIncluded: notIncluded || [],
      difficulty: difficulty || 'moderate',
      featured: featured || false,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: 'Tour created successfully',
      tour: newTour,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTours = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      minRating,
      location,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
      location,
      search,
      sort,
    };

    const result = await Tour.getAll(filters, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeaturedTours = async (req, res) => {
  try {
    const limit = req.query.limit || 6;
    const tours = await Tour.getFeatured(parseInt(limit));
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Check if user is admin or tour creator
    if (req.user.role !== 'admin' && tour.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this tour' });
    }

    const updatedTour = await Tour.updateById(req.params.id, req.body);
    res.status(200).json({
      message: 'Tour updated successfully',
      tour: updatedTour,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Check if user is admin or tour creator
    if (req.user.role !== 'admin' && tour.createdBy !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this tour' });
    }

    const deleted = await Tour.deleteById(req.params.id);
    if (!deleted) {
      return res.status(400).json({ error: 'Failed to delete tour' });
    }

    res.status(200).json({ message: 'Tour deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTourStats = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    const reviews = await Review.findByTourId(req.params.id, 1, 999);
    const ratingInfo = await Review.calculateAverageRating(req.params.id);

    res.status(200).json({
      tour: {
        id: tour._id,
        title: tour.title,
        price: tour.price,
        location: tour.location,
      },
      rating: ratingInfo.averageRating,
      reviewCount: ratingInfo.count,
      reviews: reviews.reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
