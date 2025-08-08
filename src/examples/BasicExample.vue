<template>
  <div class="basic-example">
    <h2>Basic Data Grid Example</h2>
    
    <div class="example-controls">
      <button @click="addRow">Add Row</button>
      <button @click="removeSelectedRows">Remove Selected</button>
      <button @click="clearSelection">Clear Selection</button>
      <button @click="selectAll">Select All</button>
    </div>
    
    <DataGrid
      ref="gridRef"
      :column-defs="columnDefs"
      :row-data="rowData"
      :row-height="35"
      :header-height="35"
      :enable-sorting="true"
      :enable-filtering="false"
      :enable-col-resize="true"
      :row-selection="'multiple'"
      :virtual-scrolling="false"
      :pagination="false"
      container-height="400px"
      :get-row-id="(params) => (params.data as { id: number }).id.toString()"
      @cell-clicked="onCellClicked"
      @row-clicked="onRowClicked"
      @selection-changed="onSelectionChanged"
      @sort-changed="onSortChanged"
      @grid-ready="onGridReady"
    />
    
    <div class="example-info">
      <p><strong>Selected Rows:</strong> {{ selectedCount }}</p>
      <p><strong>Total Rows:</strong> {{ rowData.length }}</p>
      <p><strong>Last Action:</strong> {{ lastAction }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DataGrid from '../components/DataGrid/DataGrid.vue'
import type { ColumnDef, GridApi, CellClickedEvent, RowClickedEvent, SelectionChangedEvent } from '../components/DataGrid/types'

// Grid reference
const gridRef = ref<InstanceType<typeof DataGrid>>()

// State
const lastAction = ref('Grid initialized')
const selectedCount = ref(0)
let gridApi: GridApi | null = null

// Column definitions
const columnDefs = ref<ColumnDef[]>([
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 80,
    sortable: true
  },
  { 
    field: 'firstName', 
    headerName: 'First Name', 
    width: 120,
    sortable: true
  },
  { 
    field: 'lastName', 
    headerName: 'Last Name', 
    width: 120,
    sortable: true
  },
  { 
    field: 'email', 
    headerName: 'Email', 
    width: 200,
    sortable: true
  },
  { 
    field: 'age', 
    headerName: 'Age', 
    width: 80,
    sortable: true
  },
  { 
    field: 'country', 
    headerName: 'Country', 
    width: 120,
    sortable: true
  }
])

// Sample data
const rowData = ref([
  { 
    id: 1, 
    firstName: 'John', 
    lastName: 'Doe', 
    email: 'john.doe@example.com', 
    age: 30, 
    country: 'USA' 
  },
  { 
    id: 2, 
    firstName: 'Jane', 
    lastName: 'Smith', 
    email: 'jane.smith@example.com', 
    age: 25, 
    country: 'Canada' 
  },
  { 
    id: 3, 
    firstName: 'Bob', 
    lastName: 'Johnson', 
    email: 'bob.johnson@example.com', 
    age: 35, 
    country: 'UK' 
  },
  { 
    id: 4, 
    firstName: 'Alice', 
    lastName: 'Williams', 
    email: 'alice.williams@example.com', 
    age: 28, 
    country: 'Australia' 
  },
  { 
    id: 5, 
    firstName: 'Charlie', 
    lastName: 'Brown', 
    email: 'charlie.brown@example.com', 
    age: 32, 
    country: 'Germany' 
  }
])

// Event handlers
const onCellClicked = (event: CellClickedEvent) => {
  lastAction.value = `Cell clicked: ${event.column.field} = ${event.value}`
  console.log('Cell clicked:', event)
}

const onRowClicked = (event: RowClickedEvent) => {
  lastAction.value = `Row clicked: ${event.data.firstName} ${event.data.lastName}`
  console.log('Row clicked:', event)
}

const onSelectionChanged = (event: SelectionChangedEvent) => {
  selectedCount.value = event.selectedRows.length
  lastAction.value = `Selection changed: ${event.selectedRows.length} rows selected`
  console.log('Selection changed:', event.selectedRows)
}

const onSortChanged = (event: { sortModel: { colId: string; sort: 'asc' | 'desc' }[] }) => {
  const sortInfo = event.sortModel.map((s) => `${s.colId} ${s.sort}`).join(', ')
  lastAction.value = `Sort changed: ${sortInfo || 'none'}`
  console.log('Sort changed:', event.sortModel)
}

const onGridReady = (event: { api: GridApi }) => {
  gridApi = event.api
  lastAction.value = 'Grid ready'
  console.log('Grid ready:', event.api)
}

// Actions
const addRow = () => {
  const newId = Math.max(...rowData.value.map(r => r.id)) + 1
  const firstNames = ['Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma']
  const lastNames = ['Wilson', 'Davis', 'Miller', 'Taylor', 'Anderson', 'Thomas']
  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France']
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const age = Math.floor(Math.random() * 40) + 20
  const country = countries[Math.floor(Math.random() * countries.length)]
  
  const newRow = {
    id: newId,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    age,
    country
  }
  
  rowData.value.push(newRow)
  lastAction.value = `Added new row: ${firstName} ${lastName}`
}

const removeSelectedRows = () => {
  if (!gridApi) return
  
  const selectedRows = gridApi.getSelectedRows()
  if (selectedRows.length === 0) {
    lastAction.value = 'No rows selected to remove'
    return
  }
  
  const selectedIds = selectedRows.map(row => row.id)
  rowData.value = rowData.value.filter(row => !selectedIds.includes(row.id))
  lastAction.value = `Removed ${selectedRows.length} selected rows`
}

const clearSelection = () => {
  if (!gridApi) return
  
  gridApi.deselectAll()
  lastAction.value = 'Selection cleared'
}

const selectAll = () => {
  if (!gridApi) return
  
  gridApi.selectAll()
  lastAction.value = 'All rows selected'
}
</script>

<style scoped>
.basic-example {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.basic-example h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.example-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.example-controls button {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.example-controls button:hover {
  background: #2980b9;
}

.example-info {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.example-info p {
  margin: 5px 0;
  font-size: 14px;
}

.example-info strong {
  color: #2c3e50;
}
</style>