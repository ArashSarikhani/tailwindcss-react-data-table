export interface TableColumn {
  widths: number | string;
  title: string;
  visibility: boolean;
  index: number;
  orderBy?: string;
}

export type TableContextType = {
  columnWidths: number[] | string[];
  updateWidths?: (widths: number[]) => void;
  columnConfig: TableColumn[];
  updateConfig?: (columnConfig: TableColumn[]) => void;
  moveIndex: number;
  setMoveIndex: (index: number) => void;
  hoverIndex: number;
  setHoverIndex: (index: number) => void;
  visibleIndex: number;
  setVisibleIndex: (index: number) => void;
  showColumnControl: number;
  setShowColumnControl: (index: number) => void;
  enterColumnControl: boolean;
  setEnterColumnControl: React.Dispatch<React.SetStateAction<boolean>>;
  showShadow: boolean;
  defaultColumnConfig: TableColumn[];
  openPopover: boolean;
  setOpenPopover: React.Dispatch<React.SetStateAction<boolean>>;
  columnControl?: boolean;
};

export interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface InputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

export interface PopoverProps {
  open: boolean;
  onOpenChange: () => void;
  trigger: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}
