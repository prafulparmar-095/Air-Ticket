export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};