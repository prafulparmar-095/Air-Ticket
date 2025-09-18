import React, { createContext, useContext, useReducer } from 'react';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [...state, { ...action.payload, id: Date.now() }];
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
    case 'CLEAR_ALL_NOTIFICATIONS':
      return [];
    default:
      return state;
  }
};

const initialState = [];

export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(notificationReducer, initialState);

  const showNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now();
    
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { id, message, type }
    });

    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  };

  const removeNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  const showSuccess = (message, duration = 5000) => {
    return showNotification(message, 'success', duration);
  };

  const showError = (message, duration = 5000) => {
    return showNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 5000) => {
    return showNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 5000) => {
    return showNotification(message, 'info', duration);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      showNotification,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      removeNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};