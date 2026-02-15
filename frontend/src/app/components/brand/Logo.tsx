import React from 'react';
import logoImg from 'figma:asset/c91888e43a317f5e7d7ac60586abb1bea0670ad2.png';

export const Logo = ({ className = "w-12 h-12" }: { className?: string, color?: string }) => {
  return (
    <img 
      src={logoImg} 
      alt="NextMed Logo" 
      className={`object-contain drop-shadow-md hover:scale-110 transition-transform duration-300 ease-out ${className} rounded-[12px]`}
    />
  );
};
