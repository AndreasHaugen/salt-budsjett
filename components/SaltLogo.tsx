import React from 'react';

interface Props {
  className?: string;
}

export const SaltLogo: React.FC<Props> = ({ className = "w-auto h-10" }) => {
  return (
    <img 
      src="/logo.png" 
      alt="Salt Logo" 
      className={`${className} object-contain`}
    />
  );
};