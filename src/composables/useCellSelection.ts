import { ref } from 'vue'
import type { CellPosition, CellSelectionChangeEvent } from '../components/DataGrid/types'

export function useCellSelection() {
  const selectedCells = ref<Set<string>>(new Set())

  const getCellId = (rowId: string | number, field: string) => `${rowId}-${field}`

  const isCellSelected = (rowId: string | number, field: string) => {
    return selectedCells.value.has(getCellId(rowId, field))
  }

  const toggleCell = (rowId: string | number, field: string) => {
    const cellId = getCellId(rowId, field)
    const newSelected = new Set(selectedCells.value)
    
    if (newSelected.has(cellId)) {
      newSelected.delete(cellId)
    } else {
      newSelected.add(cellId)
    }
    
    selectedCells.value = newSelected
    return createCellSelectionEvent()
  }

  const selectCell = (rowId: string | number, field: string) => {
    const cellId = getCellId(rowId, field)
    selectedCells.value = new Set([cellId])
    return createCellSelectionEvent()
  }

  const clearCellSelection = () => {
    selectedCells.value.clear()
    return createCellSelectionEvent()
  }

  const createCellSelectionEvent = (): CellSelectionChangeEvent => {
    const positions: CellPosition[] = Array.from(selectedCells.value).map(cellId => {
      const [rowId, field] = cellId.split('-')
      return { rowId, field }
    })
    
    return {
      selectedCells: new Set(selectedCells.value),
      positions
    }
  }

  return {
    selectedCells,
    isCellSelected,
    toggleCell,
    selectCell,
    clearCellSelection
  }
}