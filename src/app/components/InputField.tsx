import React from 'react';

interface InputFieldProps {
 label: string;
 value: string;
 onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
 className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, className }) => {
 return (
    <div>
      <h2>{label}</h2>
      <input
        type="text"
        className={`text-black bg-pink-600 w-auto ${className}`}
        value={value}
        onChange={onChange}
      />
    </div>
 );
};

export default InputField;
