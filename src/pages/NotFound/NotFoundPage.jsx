import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-8xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-indigo to-brand-violet animate-pulse">
          404
        </h1>
        <div className="bg-brand-indigo/10 text-brand-purple px-3 py-1 text-xs rounded-full font-semibold inline-block">
          Requested URL Not Found
        </div>
        <p className="text-dark-muted text-sm max-w-xs mx-auto">
          The page you are looking for might have been removed, renamed, or is temporarily unavailable.
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary">Return to Safety</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
