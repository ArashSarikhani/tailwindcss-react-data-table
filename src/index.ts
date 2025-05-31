// Main export file for the table kit package
export { Table } from "./components/Table";
export type {
  TableColumn,
  ButtonProps,
  InputProps,
  PopoverProps,
} from "./types";

// Re-export the context hook for external use
export { useTableContext } from "./components/Table";
