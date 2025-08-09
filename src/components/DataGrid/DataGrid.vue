<template>
  <div class="data-grid">
    <GridHeader 
      :columns="columns" 
      @start-resize="handleStartResize"
    />
    
    <div class="grid-body">
      <RowNode
        v-for="row in data"
        :key="row.id"
        :row-data="row"
        :columns="columns"
        :selected="rowSelection.isRowSelected(row.id)"
        :selected-cells="cellSelection.selectedCells.value"
        @row-click="handleRowClick"
        @cell-click="handleCellClick"
        @cell-double-click="handleCellDoubleClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GridHeader from './GridHeader.vue'
import RowNode from './RowNode.vue'
import { useRowSelection } from '../../composables/useRowSelection'
import { useCellSelection } from '../../composables/useCellSelection'
import { useColumnResize } from '../../composables/useColumnResize'
import type { Column, RowData, SelectionMode } from './types'

interface Props {
  columns: Column[]
  data: RowData[]
  selectionMode?: SelectionMode
}

const props = withDefaults(defineProps<Props>(), {
  selectionMode: 'single'
})

const emit = defineEmits<{
  'row-selection-change': [event: ReturnType<typeof rowSelection.toggleRow>]
  'cell-selection-change': [event: ReturnType<typeof cellSelection.toggleCell>]
}>()

// Composables
const rowSelection = useRowSelection(props.selectionMode)
const cellSelection = useCellSelection()
const columnResize = useColumnResize(props.columns)

// Use reactive columns from composable
const { columns } = columnResize

// Event handlers
const handleRowClick = (rowId: string | number) => {
  const event = rowSelection.toggleRow(rowId, props.data)
  emit('row-selection-change', event)
}

const handleCellClick = ({ rowId, field }: { rowId: string | number; field: string }) => {
  const event = cellSelection.toggleCell(rowId, field)
  emit('cell-selection-change', event)
}

const handleCellDoubleClick = ({ rowId, field }: { rowId: string | number; field: string }) => {
  console.log('Cell double-clicked:', rowId, field)
}

const handleStartResize = ({ index, startX }: { index: number; startX: number }) => {
  columnResize.startResize(index, startX)
}

// Expose useful methods
defineExpose({
  selectAll: () => {
    const event = rowSelection.selectAll(props.data)
    emit('row-selection-change', event)
  },
  clearSelection: () => {
    const event = rowSelection.clearSelection(props.data)
    emit('row-selection-change', event)
  },
  clearCellSelection: () => {
    const event = cellSelection.clearCellSelection()
    emit('cell-selection-change', event)
  }
})
</script>

<style scoped>
.data-grid {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  height: 500px;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  overflow: hidden;
}

.grid-body {
  flex: 1;
  overflow: auto;
}
</style>