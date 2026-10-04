import React from 'react';

// Original LastGood artwork, tinted mint to match the site theme.
const Logo = ({ size = 'md', className = '', showText = false, textClassName = '' }) => {
  const px = typeof size === 'number' ? size : { xs: 16, sm: 24, md: 28, lg: 36, xl: 48 }[size] || 28;
  const mask = "url(/logo.png) center / contain no-repeat";

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        role="img"
        aria-label="LastGood logo"
        className="block shrink-0 bg-[#b6edce]"
        style={{ width: px, height: px, WebkitMask: mask, mask }}
      />
      {showText && (
        <span className={`font-semibold tracking-[-0.06em] text-[#f1f2ef] ${textClassName || 'text-base'}`}>
          LastGood
        </span>
      )}
    </div>
  );
};

export default Logo;
