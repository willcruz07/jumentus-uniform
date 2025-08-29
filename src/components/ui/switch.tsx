import * as React from 'react';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onCheckedChange, 
  label,
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#D4B301] focus:ring-offset-2
          ${checked 
            ? 'bg-[#D4B301]' 
            : 'bg-gray-300'
          }
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      {label && (
        <span className="text-base font-medium text-gray-700">
          {label}
        </span>
      )}
    </div>
  );
};
