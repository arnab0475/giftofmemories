const Loader = ({ size = "md", color = "#C9A24D" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} border-t-2 border-b-2`}
        style={{ borderColor: color }}
      ></div>
    </div>
  );
};

export default Loader;
