const Icon = ({
  iconName,
  className = "",
}: {
  iconName: string;
  className?: string;
}) => (
  <span className={`inline-block ${className}`} title={iconName}>
    {iconName === "plus" && "+"}
    {iconName === "minus" && "−"}
    {iconName === "close" && "×"}
    {iconName === "dotsHorizontalRounded" && "⋯"}
    {!["plus", "minus", "close", "dotsHorizontalRounded"].includes(iconName) &&
      "?"}
  </span>
);

export default Icon;
