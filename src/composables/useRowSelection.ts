import { ref, computed } from 'vue'
import type { SelectionMode, RowData, SelectionChangeEvent } from '../components/DataGrid/types'

export function useRowSelection(mode: SelectionMode = 'single') {
  const selectedRows = ref<Set<string | number>>(new Set())

  const isRowSelected = (rowId: string | number) => {
    return selectedRows.value.has(rowId)
  }

  const toggleRow = (rowId: string | number, allRows?: RowData[]) => {
    const newSelected = new Set(selectedRows.value)
    
    if (mode === 'single') {
      newSelected.clear()
      if (!selectedRows.value.has(rowId)) {
        newSelected.add(rowId)
      }
    } else {
      // multiple mode
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId)
      } else {
        newSelected.add(rowId)
      }
    }
    
    selectedRows.value = newSelected
    return createSelectionEvent(allRows)
  }

  const selectAll = (allRows: RowData[]) => {
    if (mode === 'single') return createSelectionEvent(allRows)
    
    const allRowIds = new Set(allRows.map(row => row.id))
    selectedRows.value = allRowIds
    return createSelectionEvent(allRows)
  }

  const clearSelection = (allRows?: RowData[]) => {
    selectedRows.value.clear()
    return createSelectionEvent(allRows)
  }

  const isAllSelected = computed(() => (allRows: RowData[]) => {
    if (mode === 'single' || allRows.length === 0) return false
    return allRows.every(row => selectedRows.value.has(row.id))
  })

  const createSelectionEvent = (allRows?: RowData[]): SelectionChangeEvent => {
    const selectedRowData = allRows?.filter(row => selectedRows.value.has(row.id)) || []
    return {
      selectedRows: new Set(selectedRows.value),
      selectedRowData
    }
  }

  return {
    selectedRows,
    isRowSelected,
    toggleRow,
    selectAll,
    clearSelection,
    isAllSelected
  }
}