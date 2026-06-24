import React from 'react';
import clsx from 'clsx';

const Loader = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-t-brand-indigo border-r-transparent border-b-brand-violet border-l-transparent',
          sizes[size]
        )}
      />
      <span className="text-xs text-dark-muted font-medium tracking-wider uppercase animate-pulse">
        Loading...
      </span>
    </div>
  );
};

export default Loader;
