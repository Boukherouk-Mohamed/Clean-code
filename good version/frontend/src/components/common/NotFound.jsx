import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
    <p className="mb-4">The page you're looking for doesn't exist.</p>
    <Link to="/" className="text-blue-500 hover:underline">
      Return to Home
    </Link>
  </div>
);
