import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { bookingService } from '../services/bookings';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const BookingContext = createContext();

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload, loading: false };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking._id === action.payload._id ? action.payload : booking
        )
      };
    case 'REMOVE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.payload)
      };
    case 'SET_SELECTED_BOOKING':
      return { ...state, selectedBooking: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const bookings = await bookingService.getBookings();
      dispatch({ type: 'SET_BOOKINGS', payload: bookings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to load bookings', 'error');
    }
  };

  const getBooking = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const booking = await bookingService.getBooking(id);
      dispatch({ type: 'SET_SELECTED_BOOKING', payload: booking });
      return booking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to load booking details', 'error');
      throw error;
    }
  };

  const getBookingByReference = async (reference) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const booking = await bookingService.getBookingByReference(reference);
      dispatch({ type: 'SET_SELECTED_BOOKING', payload: booking });
      return booking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Booking not found', 'error');
      throw error;
    }
  };

  const createBooking = async (bookingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newBooking = await bookingService.createBooking(bookingData);
      dispatch({ type: 'ADD_BOOKING', payload: newBooking });
      showNotification('Booking created successfully!', 'success');
      return newBooking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to create booking', 'error');
      throw error;
    }
  };

  const updateBooking = async (id, bookingData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedBooking = await bookingService.updateBooking(id, bookingData);
      dispatch({ type: 'UPDATE_BOOKING', payload: updatedBooking });
      showNotification('Booking updated successfully!', 'success');
      return updatedBooking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to update booking', 'error');
      throw error;
    }
  };

  const cancelBooking = async (id, reason) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await bookingService.cancelBooking(id, reason);
      const updatedBooking = await bookingService.getBooking(id);
      dispatch({ type: 'UPDATE_BOOKING', payload: updatedBooking });
      showNotification('Booking cancelled successfully!', 'success');
      return updatedBooking;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to cancel booking', 'error');
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearSelectedBooking = () => {
    dispatch({ type: 'SET_SELECTED_BOOKING', payload: null });
  };

  return (
    <BookingContext.Provider value={{
      bookings: state.bookings,
      selectedBooking: state.selectedBooking,
      loading: state.loading,
      error: state.error,
      loadBookings,
      getBooking,
      getBookingByReference,
      createBooking,
      updateBooking,
      cancelBooking,
      clearError,
      clearSelectedBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};