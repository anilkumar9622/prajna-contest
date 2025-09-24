import React from 'react';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';

interface HookFormInputFieldProps {
    name: string;
    control: any;
    placeholder?: string;
    type?: string;
    error?: string;
    className?: string;
    label?: React.ReactNode;
    required?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    callback?: (value: any) => void;
}

function HookFormInputField({ name, control, placeholder, type = 'text', error, className = '', label, required, disabled = false, icon, callback, ...rest }: HookFormInputFieldProps) {
    return (
        <div className={`${type == 'checkbox' || name == 'captcha' ? '' : 'flex flex-col gap-1 w-full'}`}>
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-0">
               
                    {typeof label === 'string' ? (
                        <span className="label-text">
                            {label}
                            {required && <span className="text-red-500 ml-1">*</span>}
                        </span>
                    ) : (
                        <span className="label-text">{label}</span>
                    )}
                </label>
            )}

            <div className="relative text-white-dark">
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <input
                            {...field}
                            value={field.value ?? ''}
                            checked={type === 'checkbox' ? field.value : undefined}
                            type={type}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`${
                                type == 'checkbox'
                                    ? className
                                    : `form-input placeholder:text-white-dark 
                border rounded-md w-full
                ${icon ? 'ps-10' : ''}
                ${error ? 'border-red-500' : 'border-gray-300'}
                ${disabled ? 'cursor-not-allowed bg-gray-100' : ''}
                ${className}`
                            }`}
                            onChange={(e) => {
                                if (type === 'checkbox') {
                                    field.onChange(e.target.checked);
                                    if (callback) callback(e.target.checked);
                                } else {
                                    field.onChange(e.target.value);
                                    if (callback) callback(e.target.value);
                                }
                            }}
                            {...rest}
                        />
                    )}
                />

                {/* Icon on the left */}
                {icon && <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <style global>
                {`
            input[type="date"]::placeholder {
            color: #9ca3af; /* gray-400 */
            }

            `}
            </style>
        </div>
    );
}

export default HookFormInputField;
