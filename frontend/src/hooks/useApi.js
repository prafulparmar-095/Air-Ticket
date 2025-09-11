import { useState } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiCall) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall();
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    callApi
  };
};