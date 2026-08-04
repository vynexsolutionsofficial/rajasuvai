import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '../../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-brand-50 text-brand-500">
        <Compass size={36} />
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-brand-950">Page not found</h1>
      <p className="mt-2 text-sm text-black/55">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
