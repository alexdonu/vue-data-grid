<template>
  <div class="basic-grid-example">
    <h2>Basic Data Grid Example</h2>
    
    <div class="controls">
      <button @click="selectAll">Select All</button>
      <button @click="clearSelection">Clear Selection</button>
      <button @click="clearCellSelection">Clear Cell Selection</button>
      <p>Selected Rows: {{ selectedRowCount }}</p>
      <p>Selected Cells: {{ selectedCellCount }}</p>
    </div>

    <DataGrid
      ref="gridRef"
      :columns="columns"
      :data="sampleData"
      selection-mode="multiple"
      @row-selection-change="handleRowSelectionChange"
      @cell-selection-change="handleCellSelectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataGrid } from '../components/DataGrid'
import type { Column, RowData, SelectionChangeEvent, CellSelectionChangeEvent } from '../components/DataGrid'

const gridRef = ref()
const selectedRowCount = ref(0)
const selectedCellCount = ref(0)

const columns: Column[] = [
  { field: 'name', header: 'Name', width: 150 },
  { field: 'age', header: 'Age', width: 80 },
  { field: 'email', header: 'Email', width: 200 },
  { field: 'department', header: 'Department', width: 120 },
  { field: 'salary', header: 'Salary', width: 100 }
]

const sampleData: RowData[] = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', department: 'Engineering', salary: 75000 },
  { id: 2, name: 'Jane Smith', age: 28, email: 'jane@example.com', department: 'Marketing', salary: 65000 },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', department: 'Sales', salary: 70000 },
  { id: 4, name: 'Alice Williams', age: 32, email: 'alice@example.com', department: 'Engineering', salary: 80000 },
  { id: 5, name: 'Charlie Brown', age: 29, email: 'charlie@example.com', department: 'Design', salary: 60000 }
]

const handleRowSelectionChange = (event: SelectionChangeEvent) => {
  selectedRowCount.value = event.selectedRows.size
  console.log('Row selection changed:', event)
}

const handleCellSelectionChange = (event: CellSelectionChangeEvent) => {
  selectedCellCount.value = event.selectedCells.size
  console.log('Cell selection changed:', event)
}

const selectAll = () => {
  if (gridRef.value) {
    gridRef.value.selectAll()
  }
}

const clearSelection = () => {
  if (gridRef.value) {
    gridRef.value.clearSelection()
  }
}

const clearCellSelection = () => {
  if (gridRef.value) {
    gridRef.value.clearCellSelection()
  }
}
</script>

<style scoped>
.basic-grid-example {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.controls button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.controls button:hover {
  background: #1565c0;
}

.controls p {
  margin: 0;
  font-weight: 600;
}
</style>