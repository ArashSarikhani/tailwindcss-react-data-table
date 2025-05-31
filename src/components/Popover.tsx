import React from "react";
import { PopoverProps } from "../types";

const Popover = ({
  open,
  onOpenChange,
  trigger,
  content,
  placement = "bottom",
}: PopoverProps) => {
  const popoverRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        onOpenChange();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      <div onClick={onOpenChange}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg ${
            placement === "bottom"
              ? "top-full"
              : placement === "top"
              ? "bottom-full"
              : placement === "left"
              ? "right-full"
              : "left-full"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;
