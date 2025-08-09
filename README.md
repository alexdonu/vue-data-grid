# Vue Data Grid

A modern, performant Vue 3 data grid component with TypeScript support.

## Features

✅ **Core Features:**
- Adjustable column widths (drag to resize)
- Row selection (single/multiple modes)  
- Cell selection
- TypeScript support
- Modular component architecture

✅ **Events:**
- Row selection change events
- Cell selection change events
- Column resize events

## Installation

```bash
npm install vue3-data-grid
```

## Usage

### Basic Example

```vue
<template>
  <DataGrid
    :columns="columns"
    :data="data"
    selection-mode="multiple"
    @row-selection-change="handleRowSelection"
    @cell-selection-change="handleCellSelection"
  />
</template>

<script setup lang="ts">
import { DataGrid } from 'vue3-data-grid'
import type { Column, RowData } from 'vue3-data-grid'

const columns: Column[] = [
  { field: 'name', header: 'Name', width: 150 },
  { field: 'age', header: 'Age', width: 80 },
  { field: 'email', header: 'Email', width: 200 }
]

const data: RowData[] = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 28, email: 'jane@example.com' }
]

const handleRowSelection = (event) => {
  console.log('Selected rows:', event.selectedRowData)
}

const handleCellSelection = (event) => {
  console.log('Selected cells:', event.positions)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `Column[]` | required | Column definitions |
| `data` | `RowData[]` | required | Row data |
| `selection-mode` | `'single' \| 'multiple'` | `'single'` | Row selection mode |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `row-selection-change` | `SelectionChangeEvent` | Fired when row selection changes |
| `cell-selection-change` | `CellSelectionChangeEvent` | Fired when cell selection changes |

## Types

```typescript
interface Column {
  field: string
  header: string
  width: number
}

interface RowData extends Record<string, unknown> {
  id: string | number
}
```

## License

MIT © Alexandru Donu