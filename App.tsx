import React from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { ToastProvider } from './context/ToastContext';
import Toast from './components/Toast';

const App = () => {
    return (
        <ToastProvider>
            <div className="min-h-screen bg-brand-primary font-sans">
                <Header />
                <main className="container mx-auto p-4 lg:p-8">
                    <Dashboard />
                </main>
                <Toast />
            </div>
        </ToastProvider>
    );
};

export default App;