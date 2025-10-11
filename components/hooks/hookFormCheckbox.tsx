"use client";

import React from "react";
import { Controller } from "react-hook-form";

interface HookFormCheckboxFieldProps {
  name: string;
  control: any;
  id?: string;
  label?: React.ReactNode; // label can include JSX (like a link)
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const HookFormCheckboxField = ({
  name,
  control,
  id,
  label,
  error,
  required,
  disabled = false,
  className = "",
}: HookFormCheckboxFieldProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-2">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              id={id || name}
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
              className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
                ${disabled ? "cursor-not-allowed opacity-60" : ""} ${className}`}
            />
          )}
        />

        {label && (
          <label
            htmlFor={id || name}
            className="text-sm text-black cursor-pointer select-none mb-0"
          >
            {label}
            {required && <span className="text-red-500 ml-1" style={{color:"red"}}>*</span>}
          </label>
        )}
      </div>

      {error && <p className="text-red-500 text-xs mt-1" style={{color:"red"}}>{error}</p>}
    </div>
  );
};

export default HookFormCheckboxField;
