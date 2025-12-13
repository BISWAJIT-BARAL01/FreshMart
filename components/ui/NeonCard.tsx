import React from 'react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: 'purple' | 'blue' | 'green' | 'red';
}

const NeonCard: React.FC<NeonCardProps> = ({ children, className = '', onClick, accentColor = 'purple' }) => {
  const borderColors = {
    purple: 'hover:border-neonViolet/50',
    blue: 'hover:border-electricBlue/50',
    green: 'hover:border-mintCyan/50',
    red: 'hover:border-red-500/50',
  };

  const glowColors = {
    purple: 'hover:shadow-[0_0_20px_rgba(154,77,255,0.3)]',
    blue: 'hover:shadow-[0_0_20px_rgba(0,163,255,0.3)]',
    green: 'hover:shadow-[0_0_20px_rgba(69,255,198,0.3)]',
    red: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        glass-panel rounded-xl p-6 transition-all duration-300 border border-white/5 
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