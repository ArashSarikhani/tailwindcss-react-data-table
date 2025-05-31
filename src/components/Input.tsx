import { InputProps } from "../types";

const Input = ({
  value,
  onChange,
  placeholder,
  className = "",
}: InputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Spinner = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
  />
);

export default Input;
