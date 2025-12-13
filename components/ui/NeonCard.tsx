import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: 'purple' | 'blue' | 'green' | 'red';
}

const NeonCard: React.FC<NeonCardProps> = ({ children, className = '', onClick, accentColor = 'purple' }) => {
  const borderColors = {
    purple: 'hover:border-neonViolet', // Green
    blue: 'hover:border-electricBlue', // Maroon
    green: 'hover:border-neonViolet',
    red: 'hover:border-electricBlue',
  };

  const glowColors = {
    purple: 'hover:shadow-[0_4px_20px_rgba(46,125,50,0.2)]',
    blue: 'hover:shadow-[0_4px_20px_rgba(128,0,0,0.2)]',
    green: 'hover:shadow-[0_4px_20px_rgba(46,125,50,0.2)]',
    red: 'hover:shadow-[0_4px_20px_rgba(128,0,0,0.2)]',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        bg-white rounded-xl p-6 transition-all duration-300 border border-green-100 shadow-sm
        ${borderColors[accentColor]} 
        ${glowColors[accentColor]}
        ${onClick ? 'cursor-pointer active:scale-95' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default NeonCard;