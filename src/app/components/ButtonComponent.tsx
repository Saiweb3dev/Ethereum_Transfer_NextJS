import React from 'react';

interface ButtonComponentProps {
 text: string;
 onClick: () => void;
 disabled?: boolean;
 className?: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ text, onClick, disabled = false, className }) => {
 return (
    <button
      onClick={onClick}
      className={`bg-gradient-to-r from-pink-600 to-red-500 hover:bg-gradient-to-r text-white font-bold py-2 px-4 rounded ${className}`}
      disabled={disabled}
    >
      {text}
    </button>
 );
};

export default ButtonComponent;
