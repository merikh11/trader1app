import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XMarkIcon } from './icons/XMarkIcon';

const Toast = () => {
  const { toastMessage, isVisible, hideToast } = useToast();

  if (!toastMessage) {
    return null;
  }

  return (
    <div
      aria-live="assertive"
      className={`fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-50 transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-brand-secondary shadow-lg ring-1 ring-black ring-opacity-5 border border-brand-border transform transition-all duration-300 ease-in-out ${
          isVisible ? 'translate-y-0 sm:translate-x-0' : 'translate-y-2 sm:translate-y-0 sm:translate-x-2'
        }`}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-6 w-6 text-brand-success" aria-hidden="true" />
            </div>
            <div className="ml-3 w-0 flex-1 pt-0.5">
              <p className="text-sm font-medium text-brand-text">{toastMessage}</p>
            </div>
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-md bg-brand-secondary text-brand-subtle hover:text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-accent"
                onClick={hideToast}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
