import React from 'react';

interface ErrorDisplayProps {
 error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
 return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
 );
};

export default ErrorDisplay;
