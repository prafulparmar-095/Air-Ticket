import { createContext, useContext, useReducer } from 'react'
import { useAuth } from './AuthContext'

export const BookingContext = createContext()

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FLIGHT':
      return { ...state, selectedFlight: action.payload }
    case 'SET_PASSENGERS':
      return { ...state, passengers: action.payload }
    case 'SET_SEATS':
      return { ...state, selectedSeats: action.payload }
    case 'SET_BOOKING':
      return { ...state, currentBooking: action.payload }
    case 'CLEAR_BOOKING':
      return {
        selectedFlight: null,
        passengers: [],
        selectedSeats: {},
        currentBooking: null
      }
    default:
      return state
  }
}

export const BookingProvider = ({ children }) => {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(bookingReducer, {
    selectedFlight: null,
    passengers: [],
    selectedSeats: {},
    currentBooking: null
  })

  const setFlight = (flight) => {
    dispatch({ type: 'SET_FLIGHT', payload: flight })
  }

  const setPassengers = (passengers) => {
    dispatch({ type: 'SET_PASSENGERS', payload: passengers })
  }

  const setSeats = (seats) => {
    dispatch({ type: 'SET_SEATS', payload: seats })
  }

  const setBooking = (booking) => {
    dispatch({ type: 'SET_BOOKING', payload: booking })
  }

  const clearBooking = () => {
    dispatch({ type: 'CLEAR_BOOKING' })
  }

  const value = {
    ...state,
    setFlight,
    setPassengers,
    setSeats,
    setBooking,
    clearBooking
  }

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  )
}

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext)
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider')
  }
  return context
}