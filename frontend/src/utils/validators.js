export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validateAge = (age) => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 1 && ageNum <= 120;
};

export const validateFlightSearch = (searchData) => {
  const errors = {};
  
  if (!searchData.from) errors.from = 'Departure city is required';
  if (!searchData.to) errors.to = 'Destination city is required';
  if (!searchData.departure) errors.departure = 'Departure date is required';
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};