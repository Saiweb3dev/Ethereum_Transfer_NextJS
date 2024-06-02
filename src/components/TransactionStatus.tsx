// src/components/TransactionStatus.tsx

import React from 'react';

interface TransactionStatusProps {
  status: 'pending' | 'success' | 'error' | undefined;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status }) => {
  if (!status) return null;

  let message = '';
  let icon = '';

  switch (status) {
    case 'pending':
      message = 'Transaction in progress...';
      icon = 'animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-violet-700';
      break;
    case 'success':
      message = 'Transaction successful!';
      icon = 'h-8 w-8 text-green-500';
      break;
    case 'error':
      message = 'Transaction failed.';
      icon = 'h-8 w-8 text-red-500';
      break;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-black p-6 rounded-lg shadow-md">
          <div className="flex justify-center items-center">
            {status === 'pending' ? (
              <div className={icon}></div>
            ) : (
              <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {status === 'success' ? (
                  <>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </>
                ) : (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </>
                )}
              </svg>
            )}
            <p className="ml-4">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatus;
