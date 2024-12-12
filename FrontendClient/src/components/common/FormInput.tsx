import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  rightIcon,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full h-[45px] ${icon ? 'pl-10' : 'pl-3'} ${rightIcon ? 'pr-10' : 'pr-3'} py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          value={value}
          onChange={onChange}
          required={required}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center h-full">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};