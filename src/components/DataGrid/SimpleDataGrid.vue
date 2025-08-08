<template>
  <div class="simple-data-grid">
    <!-- Header -->
    <div class="simple-grid-header">
      <div 
        v-for="column in columnDefs" 
        :key="column.field"
        class="simple-header-cell"
      >
        {{ column.headerName || column.field }}
      </div>
    </div>
    
    <!-- Body -->
    <div class="simple-grid-body">
      <div 
        v-for="(row, index) in rowData" 
        :key="index"
        class="simple-grid-row"
      >
        <div 
          v-for="column in columnDefs" 
          :key="column.field"
          class="simple-grid-cell"
        >
          {{ row[column.field] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Column {
  field: string
  headerName?: string
}

interface Props {
  columnDefs: Column[]
  rowData: Record<string, any>[]
}

defineProps<Props>()
</script>

<style scoped>
.simple-data-grid {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 500px;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.simple-grid-header {
  display: flex;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.simple-header-cell {
  flex: 1;
  padding: 8px 12px;
  border-right: 1px solid #e0e0e0;
  font-weight: 600;
  min-width: 100px;
}

.simple-header-cell:last-child {
  border-right: none;
}

.simple-grid-body {
  flex: 1;
  overflow: auto;
}

.simple-grid-row {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.simple-grid-row:hover {
  background: #f0f0f0;
}

.simple-grid-cell {
  flex: 1;
  padding: 8px 12px;
  border-right: 1px solid #e0e0e0;
  min-width: 100px;
}

.simple-grid-cell:last-child {
  border-right: none;
}
</style>