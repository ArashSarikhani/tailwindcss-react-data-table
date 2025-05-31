const Spinner = ({ className = "w-4 h-4" }: { className?: string }) => (
  <div
    className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}
  />
);

export default Spinner;
