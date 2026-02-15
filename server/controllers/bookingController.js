import { Booking } from '../models/Booking.js';
import { Tour } from '../models/Tour.js';

export const createBooking = async (req, res) => {
  try {
    const { tourId, startDate, endDate, guestCount, totalPrice } = req.body;

    // Verify tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }

    // Check availability
    const isAvailable = await Booking.checkAvailability(tourId, startDate, endDate);
    if (!isAvailable) {
      return res.status(409).json({ error: 'Tour is not available for selected dates' });
    }

    // Verify guest count
    if (guestCount > tour.groupSize) {
      return res.status(400).json({
        error: `Maximum group size is ${tour.groupSize}`,
      });
    }

    const newBooking = await Booking.create({
      userId: req.user.id,
      tourId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      guestCount,
      totalPrice: parseFloat(totalPrice),
      status: 'confirmed',
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await Booking.findByUserId(req.user.id, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    const filters = { status };

    const result = await Booking.getAll(filters, parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, status);
    res.status(200).json({
      message: 'Booking status updated',
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const cancelledBooking = await Booking.cancel(req.params.id);
    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can delete bookings' });
    }

    const deleted = await Booking.deleteById(req.params.id);
    if (!deleted) {
      return res.status(400).json({ error: 'Failed to delete booking' });
    }

    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
