# React Table Kit

A flexible and feature-rich React table component with drag-and-drop column reordering, resizable columns, dynamic column management, and built-in loading states.

## Features

- 🎯 **Drag & Drop**: Reorder columns with intuitive drag-and-drop
- 📏 **Resizable Columns**: Click and drag to resize column widths
- 👁️ **Dynamic Columns**: Show/hide columns dynamically
- 🔍 **Column Search**: Built-in search functionality for column management
- ⚡ **Loading States**: Skeleton loading with customizable length
- 🎨 **Customizable**: Full control over styling and behavior
- 📱 **Responsive**: Horizontal scrolling with sticky first column
- 🧩 **TypeScript**: Full TypeScript support

## Installation

```bash
npm install @your-username/react-table-kit
# or
yarn add @your-username/react-table-kit
```

## Basic Usage

```tsx
import React, { useState } from "react";
import { Table, TableColumn } from "@your-username/react-table-kit";

const MyTable = () => {
  const [columnConfig, setColumnConfig] = useState<TableColumn[]>([
    { widths: 200, title: "Name", visibility: true, index: 0 },
    { widths: 150, title: "Email", visibility: true, index: 1 },
    { widths: 100, title: "Age", visibility: true, index: 2 },
  ]);

  const [columnWidths, setColumnWidths] = useState([200, 150, 100]);

  const data = [
    { name: "John Doe", email: "john@example.com", age: 30 },
    { name: "Jane Smith", email: "jane@example.com", age: 25 },
  ];

  return (
    <Table.Root
      columnConfig={columnConfig}
      updateConfig={setColumnConfig}
      columnWidths={columnWidths}
      updateWidths={setColumnWidths}
      defaultColumnConfig={columnConfig}
      columnControl={true}
    >
      <Table.Header>
        <Table.RowHeader>
          <Table.ColumnHeader index={0} name="Name">
            Name
          </Table.ColumnHeader>
          <Table.ColumnHeader index={1} name="Email">
            Email
          </Table.ColumnHeader>
          <Table.ColumnHeader index={2} name="Age">
            Age
          </Table.ColumnHeader>
        </Table.RowHeader>
      </Table.Header>

      <Table.Body>
        {data.map((row, index) => (
          <Table.RowBody key={index}>
            <Table.Cell index={0} name="Name">
              {row.name}
            </Table.Cell>
            <Table.Cell index={1} name="Email">
              {row.email}
            </Table.Cell>
            <Table.Cell index={2} name="Age">
              {row.age}
            </Table.Cell>
          </Table.RowBody>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
```

## API Reference

### Table.Root Props

| Prop                  | Type                              | Required | Description                            |
| --------------------- | --------------------------------- | -------- | -------------------------------------- |
| `columnConfig`        | `TableColumn[]`                   | Yes      | Current column configuration           |
| `updateConfig`        | `(config: TableColumn[]) => void` | No       | Callback for column config updates     |
| `columnWidths`        | `(number \| string)[]`            | Yes      | Array of column widths                 |
| `updateWidths`        | `(widths: number[]) => void`      | No       | Callback for width updates             |
| `defaultColumnConfig` | `TableColumn[]`                   | Yes      | Default column configuration for reset |
| `columnControl`       | `boolean`                         | No       | Enable column management controls      |

### TableColumn Interface

```typescript
interface TableColumn {
  widths: number | string;
  title: string;
  visibility: boolean;
  index: number;
  orderBy?: string;
}
```

### Table.ColumnHeader Props

| Prop               | Type      | Default | Description                                |
| ------------------ | --------- | ------- | ------------------------------------------ |
| `index`            | `number`  | -       | Column index                               |
| `name`             | `string`  | -       | Column name (must match TableColumn.title) |
| `className`        | `string`  | `""`    | Additional CSS classes                     |
| `hasAction`        | `boolean` | `false` | Enable hover actions                       |
| `moveable`         | `boolean` | `true`  | Allow column resizing                      |
| `hasColumnControl` | `boolean` | `true`  | Show column control popover                |

### Table.Cell Props

| Prop        | Type                           | Default   | Description            |
| ----------- | ------------------------------ | --------- | ---------------------- |
| `index`     | `number`                       | -         | Column index           |
| `name`      | `string`                       | -         | Column name            |
| `justify`   | `"start" \| "center" \| "end"` | `"start"` | Content alignment      |
| `className` | `string`                       | `""`      | Additional CSS classes |

### Table.Body Props

| Prop             | Type      | Default | Description             |
| ---------------- | --------- | ------- | ----------------------- |
| `isLoading`      | `boolean` | `false` | Show skeleton loading   |
| `skeletonLength` | `number`  | `25`    | Number of skeleton rows |

## Advanced Features

### Drag and Drop Column Reordering

Wrap column headers with `Table.Draggable` for drag-and-drop functionality:

```tsx
<Table.Draggable
  index={0}
  moveColumn={(from, to) => {
    /* handle reorder */
  }}
  canDrag={true}
>
  <Table.ColumnHeader index={0} name="Name">
    Name
  </Table.ColumnHeader>
</Table.Draggable>
```

### Column Actions

Add custom actions to column headers:

```tsx
<Table.ColumnHeaderAction
  index={0}
  removeable={true}
  lists={[
    {
      id: "sort",
      title: "Sort Ascending",
      icon: "sort",
      onClick: (id) => console.log("Sort clicked"),
    },
  ]}
/>
```

### Loading States

Enable loading with skeleton rows:

```tsx
<Table.Body isLoading={true} skeletonLength={10}>
  {/* Your table rows */}
</Table.Body>
```

## Styling

The component uses Tailwind CSS classes. Make sure Tailwind is configured in your project, or override the styles with your own CSS framework.

### Required CSS

You'll need to include the table styles. The component expects certain CSS modules to be available for shadows and animations.

## Dependencies

- React >= 16.8.0
- react-dnd ^16.0.1
- react-dnd-html5-backend ^16.0.1
- classnames ^2.3.2

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
