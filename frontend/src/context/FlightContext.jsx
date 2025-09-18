import React, { createContext, useContext, useReducer } from 'react';
import { flightService } from '../services/flights';
import { useNotification } from './NotificationContext';

const FlightContext = createContext();

const flightReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_FLIGHTS':
      return { ...state, flights: action.payload, loading: false };
    case 'SET_SELECTED_FLIGHT':
      return { ...state, selectedFlight: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, loading: false };
    case 'SET_SEARCH_PARAMS':
      return { ...state, searchParams: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'CLEAR_SEARCH_RESULTS':
      return { ...state, searchResults: [], searchParams: null };
    case 'SET_AVAILABLE_SEATS':
      return { ...state, availableSeats: action.payload };
    default:
      return state;
  }
};

const initialState = {
  flights: [],
  searchResults: [],
  selectedFlight: null,
  availableSeats: [],
  searchParams: null,
  loading: false,
  error: null
};

export const FlightProvider = ({ children }) => {
  const [state, dispatch] = useReducer(flightReducer, initialState);
  const { showNotification } = useNotification();

  const searchFlights = async (searchParams) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_SEARCH_PARAMS', payload: searchParams });
      
      const response = await flightService.searchFlights(searchParams);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.flights });
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to search flights', 'error');
      throw error;
    }
  };

  const getFlight = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const flight = await flightService.getFlight(id);
      dispatch({ type: 'SET_SELECTED_FLIGHT', payload: flight });
      return flight;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to load flight details', 'error');
      throw error;
    }
  };

  const getAvailableSeats = async (flightId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const seats = await flightService.getAvailableSeats(flightId);
      dispatch({ type: 'SET_AVAILABLE_SEATS', payload: seats });
      return seats;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to load available seats', 'error');
      throw error;
    }
  };

  const clearSearchResults = () => {
    dispatch({ type: 'CLEAR_SEARCH_RESULTS' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const clearSelectedFlight = () => {
    dispatch({ type: 'SET_SELECTED_FLIGHT', payload: null });
  };

  const clearAvailableSeats = () => {
    dispatch({ type: 'SET_AVAILABLE_SEATS', payload: [] });
  };

  // Admin functions
  const createFlight = async (flightData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newFlight = await flightService.createFlight(flightData);
      dispatch({ type: 'SET_FLIGHTS', payload: [...state.flights, newFlight] });
      showNotification('Flight created successfully!', 'success');
      return newFlight;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to create flight', 'error');
      throw error;
    }
  };

  const updateFlight = async (id, flightData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedFlight = await flightService.updateFlight(id, flightData);
      dispatch({
        type: 'SET_FLIGHTS',
        payload: state.flights.map(flight =>
          flight._id === id ? updatedFlight : flight
        )
      });
      showNotification('Flight updated successfully!', 'success');
      return updatedFlight;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to update flight', 'error');
      throw error;
    }
  };

  const deleteFlight = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await flightService.deleteFlight(id);
      dispatch({
        type: 'SET_FLIGHTS',
        payload: state.flights.filter(flight => flight._id !== id)
      });
      showNotification('Flight deleted successfully!', 'success');
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      showNotification('Failed to delete flight', 'error');
      throw error;
    }
  };

  return (
    <FlightContext.Provider value={{
      // State
      flights: state.flights,
      searchResults: state.searchResults,
      selectedFlight: state.selectedFlight,
      availableSeats: state.availableSeats,
      searchParams: state.searchParams,
      loading: state.loading,
      error: state.error,

      // Actions
      searchFlights,
      getFlight,
      getAvailableSeats,
      createFlight,
      updateFlight,
      deleteFlight,
      clearSearchResults,
      clearError,
      clearSelectedFlight,
      clearAvailableSeats
    }}>
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => {
  const context = useContext(FlightContext);
  if (!context) {
    throw new Error('useFlight must be used within a FlightProvider');
  }
  return context;
};