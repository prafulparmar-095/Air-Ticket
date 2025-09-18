import { useState } from 'react'
import { Armchair } from 'lucide-react'

const SeatSelection = ({ flight, passengerCount, onSeatSelect }) => {
  const [selectedSeats, setSelectedSeats] = useState({})

  // Generate sample seat map
  const generateSeatMap = () => {
    const rows = 10
    const seatsPerRow = 6
    const seats = []
    
    for (let row = 1; row <= rows; row++) {
      for (let seat = 0; seat < seatsPerRow; seat++) {
        const seatLetter = String.fromCharCode(65 + seat)
        seats.push({
          id: `${row}${seatLetter}`,
          row,
          letter: seatLetter,
          available: Math.random() > 0.3
        })
      }
    }
    return seats
  }

  const seats = generateSeatMap()

  const handleSeatSelect = (seatId) => {
    const newSelectedSeats = { ...selectedSeats }
    
    if (newSelectedSeats[seatId]) {
      delete newSelectedSeats[seatId]
    } else {
      if (Object.keys(newSelectedSeats).length < passengerCount) {
        newSelectedSeats[seatId] = true
      }
    }
    
    setSelectedSeats(newSelectedSeats)
  }

  const handleConfirm = () => {
    onSeatSelect(Object.keys(selectedSeats))
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <Chair className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Seat Selection</h2>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">
            Select seats for {passengerCount} passenger(s)
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span className="text-sm">Occupied</span>
            </div>
          </div>
        </div>

        {/* Aircraft layout */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="text-center mb-4">
            <div className="w-20 h-4 bg-gray-300 rounded mx-auto mb-2"></div>
            <span className="text-sm text-gray-600">Cockpit</span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {seats.map((seat) => (
              <button
                key={seat.id}
                onClick={() => seat.available && handleSeatSelect(seat.id)}
                disabled={!seat.available}
                className={`w-10 h-10 rounded flex items-center justify-center text-sm font-medium border-2 ${
                  selectedSeats[seat.id]
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : seat.available
                    ? 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                }`}
              >
                {seat.id}
              </button>
            ))}
          </div>

          <div className="text-center mt-4">
            <div className="w-20 h-4 bg-gray-300 rounded mx-auto mt-2"></div>
            <span className="text-sm text-gray-600">Exit</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Selected seats:</p>
            <p className="font-semibold">
              {Object.keys(selectedSeats).length > 0
                ? Object.keys(selectedSeats).join(', ')
                : 'None selected'}
            </p>
          </div>
          <button
            onClick={handleConfirm}
            disabled={Object.keys(selectedSeats).length !== passengerCount}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Confirm Seats
          </button>
        </div>
      </div>
    </div>
  )
}

export default SeatSelection