<script setup lang="ts">
import { ref } from 'vue'
import DataGrid from './components/DataGrid/DataGrid.vue'
import SimpleDataGrid from './components/DataGrid/SimpleDataGrid.vue'
import type { ColumnDef, CellClickedEvent, RowClickedEvent, SelectionChangedEvent, SortModel, GridApi } from './components/DataGrid/types'

// Sample data
const columnDefs = ref<ColumnDef[]>([
  { 
    field: 'name', 
    headerName: 'Full Name', 
    width: 200,
    sortable: true,
    filterable: true
  },
  { 
    field: 'age', 
    headerName: 'Age', 
    width: 100,
    sortable: true,
    filterable: true
  },
  { 
    field: 'email', 
    headerName: 'Email Address', 
    width: 250,
    sortable: true,
    filterable: true
  },
  { 
    field: 'department', 
    headerName: 'Department', 
    width: 180,
    sortable: true,
    filterable: true
  },
  { 
    field: 'salary', 
    headerName: 'Salary', 
    width: 150,
    sortable: true,
    filterable: true,
    cellRenderer: (params) => {
      return `$${params.value.toLocaleString()}`
    }
  }
])

const rowData = ref([
  { 
    id: 1, 
    name: 'John Doe', 
    age: 30, 
    email: 'john.doe@example.com', 
    department: 'Engineering',
    salary: 75000
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    age: 28, 
    email: 'jane.smith@example.com', 
    department: 'Marketing',
    salary: 65000
  },
  { 
    id: 3, 
    name: 'Bob Johnson', 
    age: 35, 
    email: 'bob.johnson@example.com', 
    department: 'Sales',
    salary: 70000
  },
  { 
    id: 4, 
    name: 'Alice Williams', 
    age: 32, 
    email: 'alice.williams@example.com', 
    department: 'Engineering',
    salary: 80000
  },
  { 
    id: 5, 
    name: 'Charlie Brown', 
    age: 29, 
    email: 'charlie.brown@example.com', 
    department: 'Design',
    salary: 60000
  },
  { 
    id: 6, 
    name: 'Diana Davis', 
    age: 31, 
    email: 'diana.davis@example.com', 
    department: 'HR',
    salary: 55000
  },
  { 
    id: 7, 
    name: 'Edward Miller', 
    age: 27, 
    email: 'edward.miller@example.com', 
    department: 'Engineering',
    salary: 72000
  },
  { 
    id: 8, 
    name: 'Fiona Wilson', 
    age: 33, 
    email: 'fiona.wilson@example.com', 
    department: 'Marketing',
    salary: 68000
  }
])

// Event handlers
const onCellClicked = (event: CellClickedEvent) => {
  console.log('Cell clicked:', event)
}

const onRowClicked = (event: RowClickedEvent) => {
  console.log('Row clicked:', event)
}

const onSelectionChanged = (event: SelectionChangedEvent) => {
  console.log('Selection changed:', event.selectedRows)
}

const onSortChanged = (event: { sortModel: SortModel[] }) => {
  console.log('Sort changed:', event.sortModel)
}

const onGridReady = (event: { api: GridApi }) => {
  console.log('Grid ready:', event.api)
}

// Generate more sample data
const generateMoreData = () => {
  const names = ['Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Emma', 'James', 'Olivia']
  const departments = ['Engineering', 'Marketing', 'Sales', 'Design', 'HR', 'Finance']
  const additionalData = []
  
  for (let i = 0; i < 50; i++) {
    const randomName = names[Math.floor(Math.random() * names.length)]
    const randomDept = departments[Math.floor(Math.random() * departments.length)]
    const randomAge = Math.floor(Math.random() * 20) + 25
    const randomSalary = Math.floor(Math.random() * 50000) + 50000
    
    additionalData.push({
      id: rowData.value.length + i + 1,
      name: `${randomName} ${Math.random().toString(36).substring(2, 7)}`,
      age: randomAge,
      email: `${randomName.toLowerCase()}.${Math.random().toString(36).substring(2, 7)}@example.com`,
      department: randomDept,
      salary: randomSalary
    })
  }
  
  rowData.value = [...rowData.value, ...additionalData]
}
</script>

<template>
  <div id="app">
    <header>
      <h1>Vue Data Grid Development</h1>
      <p>A modern, performant data grid component for Vue.js</p>
    </header>
    
    <main>
      <div class="controls">
        <button @click="generateMoreData">Add More Data (50 rows)</button>
        <p>Current rows: {{ rowData.length }}</p>
      </div>
      
      <div class="grid-container">
        <h3>Simple Working Grid</h3>
        <SimpleDataGrid
          :column-defs="columnDefs"
          :row-data="rowData"
        />
        
        <h3>Complex Grid (Not Working)</h3>
        <DataGrid
          :column-defs="columnDefs"
          :row-data="rowData"
          :row-height="40"
          :header-height="40"
          :enable-sorting="true"
          :enable-filtering="true"
          :enable-col-resize="true"
          :row-selection="'multiple'"
          :virtual-scrolling="false"
          :pagination="true"
          :pagination-page-size="20"
          container-height="500px"
          :get-row-id="(params) => (params.data as { id: number }).id.toString()"
          @cell-clicked="onCellClicked"
          @row-clicked="onRowClicked"
          @selection-changed="onSelectionChanged"
          @sort-changed="onSortChanged"
          @grid-ready="onGridReady"
        />
      </div>
      
      <section class="features">
        <h2>Features Implemented</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>✅ Core Features</h3>
            <ul>
              <li>Column definitions</li>
              <li>Row data rendering</li>
              <li>Virtual scrolling</li>
              <li>Row selection (single/multiple)</li>
              <li>Sorting (single/multi-column)</li>
              <li>Pagination</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>🚧 In Progress</h3>
            <ul>
              <li>Column resizing</li>
              <li>Filtering</li>
              <li>Cell editing</li>
              <li>Custom cell renderers</li>
              <li>Export functionality</li>
              <li>Column pinning</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>📋 Planned</h3>
            <ul>
              <li>Row grouping</li>
              <li>Drag and drop</li>
              <li>Context menus</li>
              <li>Keyboard navigation</li>
              <li>Infinite scrolling</li>
              <li>Theme customization</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
#app {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

header p {
  color: #7f8c8d;
  font-size: 18px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.controls button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.controls button:hover {
  background: #2980b9;
}

.controls p {
  margin: 0;
  font-weight: 600;
  color: #2c3e50;
}

.grid-container {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.features {
  margin-top: 40px;
}

.features h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3498db;
}

.feature-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.feature-card ul {
  margin: 0;
  padding-left: 20px;
}

.feature-card li {
  margin-bottom: 8px;
  color: #555;
}

/* Responsive design */
@media (max-width: 768px) {
  #app {
    padding: 15px;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
