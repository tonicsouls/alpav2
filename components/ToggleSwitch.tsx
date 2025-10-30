import React from 'react';

interface ToggleSwitchProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange, disabled }) => {
    const a11yId = label.replace(/\s+/g, '-').toLowerCase();

    return (
        <div className="flex items-center">
            <label htmlFor={a11yId} className="text-sm font-medium text-gray-700 mr-3 sr-only">
                {label}
            </label>
            <button
                type="button"
                id={a11yId}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    checked ? 'bg-red-600' : 'bg-gray-200'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <span
                    aria-hidden="true"
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </div>
    );
};
