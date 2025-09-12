export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateName = (name) => {
  return name.length >= 2
}

export const validatePhone = (phone) => {
  const re = /^\+?[1-9]\d{1,14}$/
  return re.test(phone)
}

export const validateCardNumber = (number) => {
  const re = /^\d{16}$/
  return re.test(number.replace(/\s/g, ''))
}

export const validateExpiryDate = (date) => {
  const re = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/
  if (!re.test(date)) return false
  
  const [month, year] = date.split('/')
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
  const today = new Date()
  return expiry > today
}

export const validateCVV = (cvv) => {
  const re = /^\d{3,4}$/
  return re.test(cvv)
}