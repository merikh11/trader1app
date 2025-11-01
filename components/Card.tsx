import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    return (
        <div
            className={`bg-brand-secondary rounded-lg shadow-lg border border-brand-border ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export default Card;
