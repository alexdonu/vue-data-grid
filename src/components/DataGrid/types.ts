export interface Column {
  field: string
  header: string
  width: number
}

export interface RowData extends Record<string, unknown> {
  id: string | number
}

export interface CellPosition {
  rowId: string | number
  field: string
}

export type SelectionMode = 'single' | 'multiple'

export interface SelectionChangeEvent {
  selectedRows: Set<string | number>
  selectedRowData: RowData[]
}

export interface CellSelectionChangeEvent {
  selectedCells: Set<string>
  positions: CellPosition[]
}