<template>
  <div 
    class="row-node"
    :class="{ 'row-selected': selected }"
    @click="$emit('row-click', rowData.id)"
  >
    <CellNode
      v-for="column in columns"
      :key="column.field"
      :value="rowData[column.field]"
      :row-id="rowData.id"
      :field="column.field"
      :selected="selectedCells.has(getCellId(rowData.id, column.field))"
      :row-selected="selected"
      :style="{ width: column.width + 'px', minWidth: column.width + 'px' }"
      @cell-click="$emit('cell-click', $event)"
      @cell-double-click="$emit('cell-double-click', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import CellNode from './CellNode.vue'
import type { Column, RowData } from './types'

interface Props {
  rowData: RowData
  columns: Column[]
  selected?: boolean
  selectedCells: Set<string>
}

defineProps<Props>()

defineEmits<{
  'row-click': [rowId: string | number]
  'cell-click': [payload: { rowId: string | number; field: string }]
  'cell-double-click': [payload: { rowId: string | number; field: string }]
}>()

const getCellId = (rowId: string | number, field: string) => `${rowId}-${field}`
</script>

<style scoped>
.row-node {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  transition: background-color 0.2s;
}

.row-node:hover {
  background-color: #f9f9f9;
}

.row-selected {
  background-color: #f0f8ff;
}

.row-node:last-child {
  border-bottom: none;
}
</style>