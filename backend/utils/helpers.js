const generateBookingReference = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const formatFlightDuration = (departure, arrival) => {
  const diff = new Date(arrival) - new Date(departure)
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

const calculateFlightPrice = (basePrice, travelClass, passengers) => {
  let multiplier = 1
  if (travelClass === 'business') multiplier = 1.5
  if (travelClass === 'first') multiplier = 2.5
  return basePrice * multiplier * passengers
}

module.exports = {
  generateBookingReference,
  formatFlightDuration,
  calculateFlightPrice
}