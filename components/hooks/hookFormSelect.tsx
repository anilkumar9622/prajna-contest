import React from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface Option {
  label: string;
  value: string | number;
}

interface HookFormSelectFieldProps<T extends FieldValues> {
  name: string;
  control: any;
  error?: string;
  className?: string;
  label?: string;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  callback?: (value: string | number) => void;
  icon?: React.ReactNode;
}

function HookFormSelectField<T extends FieldValues>({
  name,
  control,
  error,
  className = "",
  label,
  options = [],
  placeholder,
  required,
  disabled = false,
  callback,
  icon,
  ...rest
}: HookFormSelectFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-0"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={"" as any}
        render={({ field }) => {
          const isEmpty =
            field.value === undefined ||
            field.value === null ||
            field.value === "";

          return (
            <div className="relative w-full">
              <select
                {...field}
                id={name}
                aria-invalid={!!error}
                disabled={disabled}
                className={`
                  form-select w-full border rounded-md
                   ${icon ? "ps-10" : ""}
                  ${isEmpty ? "text-gray-400" : "text-gray-900"}
                  ${!error ? "border-gray-300" : "border-red-500"}
                  focus:outline-none focus:ring-1 
                  bg-white dark:bg-gray-800
                  ${className}
                `}
                onChange={(e) => {
                  field.onChange(e);
                  if (callback) callback(e.target.value);
                }}
                {...rest}
              >
                {placeholder && (
                  <option value="" disabled>
                    {placeholder}
                  </option>
                )}
                {options.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Left-side icon */}
              {icon && (
                <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {icon}
                </span>
              )}
            </div>
          );
        }}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default HookFormSelectField;
