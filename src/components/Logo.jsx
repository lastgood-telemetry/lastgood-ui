import React from 'react';

const Logo = ({ size = 'md', className = '', showText = false, textClassName = '' }) => {
  const sizeMap = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
    xl: 'h-12 w-12',
  };

  const imageSizeClass = typeof size === 'string' ? (sizeMap[size] || sizeMap.md) : '';
  const inlineStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : {};

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="LastGood Logo"
        className={`object-contain shrink-0 ${imageSizeClass}`}
        style={inlineStyle}
      />
      {showText && (
        <span className={`font-bold tracking-tight text-white ${textClassName || 'text-base'}`}>
          Last<span className="text-indigo-400">Good</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
