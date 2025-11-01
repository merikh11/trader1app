import React, { createContext, useState, useContext, useCallback } from 'react';

interface ToastContextType {
  showToast: (message: string) => void;
  hideToast: () => void;
  toastMessage: string | null;
  isVisible: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  // FIX: In a browser environment, setTimeout returns a number, not NodeJS.Timeout.
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  const hideToast = useCallback(() => {
    setIsVisible(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setTimeout(() => setToastMessage(null), 300); // Allow fade-out animation
  }, [timeoutId]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setIsVisible(true);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      hideToast();
    }, 3000);

    setTimeoutId(newTimeoutId);
  }, [hideToast, timeoutId]);
  

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toastMessage, isVisible }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};