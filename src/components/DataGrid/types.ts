/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface ColumnDef<T = any> {
  field: string
  headerName?: string
  width?: number
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  sortable?: boolean
  filterable?: boolean
  pinned?: 'left' | 'right' | null
  hide?: boolean
  cellRenderer?: (params: CellRendererParams<T>) => string | HTMLElement
  headerRenderer?: (params: HeaderRendererParams) => string | HTMLElement
  valueGetter?: (params: ValueGetterParams<T>) => any
  valueSetter?: (params: ValueSetterParams<T>) => boolean
  cellEditor?: 'text' | 'number' | 'select' | 'date' | string
  cellEditorParams?: any
  comparator?: (a: any, b: any) => number
  filter?: 'text' | 'number' | 'date' | 'set' | string
  filterParams?: any
  cellClass?: string | string[] | ((params: CellClassParams<T>) => string | string[])
  headerClass?: string | string[]
  cellStyle?: Record<string, any> | ((params: CellStyleParams<T>) => Record<string, any>)
  headerStyle?: Record<string, any>
}

export interface GridOptions<T = any> {
  columnDefs: ColumnDef<T>[]
  rowData?: T[]
  rowHeight?: number
  headerHeight?: number
  defaultColDef?: Partial<ColumnDef<T>>
  suppressRowClickSelection?: boolean
  rowSelection?: 'single' | 'multiple'
  suppressCellSelection?: boolean
  enableRangeSelection?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColResize?: boolean
  enableCellEdit?: boolean
  suppressHorizontalScroll?: boolean
  suppressVerticalScroll?: boolean
  pagination?: boolean
  paginationPageSize?: number
  virtualScrolling?: boolean
  getRowId?: (params: GetRowIdParams<T>) => string
  onCellClicked?: (event: CellClickedEvent<T>) => void
  onCellDoubleClicked?: (event: CellDoubleClickedEvent<T>) => void
  onRowClicked?: (event: RowClickedEvent<T>) => void
  onRowDoubleClicked?: (event: RowDoubleClickedEvent<T>) => void
  onSelectionChanged?: (event: SelectionChangedEvent<T>) => void
  onSortChanged?: (event: SortChangedEvent<T>) => void
  onFilterChanged?: (event: FilterChangedEvent<T>) => void
  onColumnResized?: (event: ColumnResizedEvent<T>) => void
  onColumnMoved?: (event: ColumnMovedEvent<T>) => void
  onGridReady?: (event: GridReadyEvent<T>) => void
}

export interface RowNode<T = any> {
  id: string
  data: T
  selected: boolean
  rowIndex: number
  level: number
  expanded: boolean
  group: boolean
  parent: RowNode<T> | null
  childrenAfterGroup: RowNode<T>[] | null
  allChildrenCount: number | null
}

export interface GridApi<T = any> {
  setRowData(rowData: T[]): void
  getRowData(): T[]
  setColumnDefs(colDefs: ColumnDef<T>[]): void
  getColumnDefs(): ColumnDef<T>[]
  getSelectedRows(): T[]
  getSelectedNodes(): RowNode<T>[]
  selectAll(): void
  deselectAll(): void
  selectRowsByIndex(indexes: number[]): void
  getFilterModel(): any
  setFilterModel(model: any): void
  getSortModel(): SortModel[]
  setSortModel(model: SortModel[]): void
  exportDataAsCsv(params?: CsvExportParams): void
  exportDataAsExcel(params?: ExcelExportParams): void
  sizeColumnsToFit(): void
  autoSizeAllColumns(): void
  refreshCells(params?: RefreshCellsParams<T>): void
  redrawRows(params?: RedrawRowsParams<T>): void
  getDisplayedRowCount(): number
  getFirstDisplayedRow(): number
  getLastDisplayedRow(): number
  ensureIndexVisible(index: number): void
  ensureNodeVisible(node: RowNode<T>): void
}

export interface CellRendererParams<T = any> {
  value: any
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  rowIndex: number
  api: GridApi<T>
}

export interface HeaderRendererParams {
  column: ColumnDef
  displayName: string
  enableSorting: boolean
  enableMenu: boolean
  showColumnMenu: (source: string) => void
  progressSort: (multiSort?: boolean) => void
  setSort: (sort: 'asc' | 'desc' | null, multiSort?: boolean) => void
  api: GridApi
}

export interface ValueGetterParams<T = any> {
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  api: GridApi<T>
}

export interface ValueSetterParams<T = any> {
  oldValue: any
  newValue: any
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  api: GridApi<T>
}

export interface CellClassParams<T = any> {
  value: any
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  rowIndex: number
  api: GridApi<T>
}

export interface CellStyleParams<T = any> {
  value: any
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  rowIndex: number
  api: GridApi<T>
}

export interface GetRowIdParams<T = any> {
  data: T
  level: number
}

export interface SortModel {
  colId: string
  sort: 'asc' | 'desc'
}

export interface CsvExportParams {
  fileName?: string
  columnSeparator?: string
  suppressQuotes?: boolean
  customHeader?: string
  customFooter?: string
}

export interface ExcelExportParams {
  fileName?: string
  sheetName?: string
  customHeader?: string
  customFooter?: string
}

export interface RefreshCellsParams<T = any> {
  rowNodes?: RowNode<T>[]
  columns?: ColumnDef<T>[]
  force?: boolean
}

export interface RedrawRowsParams<T = any> {
  rowNodes?: RowNode<T>[]
}

// Event interfaces
export interface GridEvent<T = any> {
  api: GridApi<T>
  type: string
}

export interface CellClickedEvent<T = any> extends GridEvent<T> {
  data: T
  node: RowNode<T>
  column: ColumnDef<T>
  value: any
  rowIndex: number
  event: MouseEvent
}

export interface CellDoubleClickedEvent<T = any> extends CellClickedEvent<T> {}

export interface RowClickedEvent<T = any> extends GridEvent<T> {
  data: T
  node: RowNode<T>
  rowIndex: number
  event: MouseEvent
}

export interface RowDoubleClickedEvent<T = any> extends RowClickedEvent<T> {}

export interface SelectionChangedEvent<T = any> extends GridEvent<T> {
  selectedNodes: RowNode<T>[]
  selectedRows: T[]
}

export interface SortChangedEvent<T = any> extends GridEvent<T> {
  sortModel: SortModel[]
}

export interface FilterChangedEvent<T = any> extends GridEvent<T> {
  filterModel: any
}

export interface ColumnResizedEvent<T = any> extends GridEvent<T> {
  column: ColumnDef<T>
  columns: ColumnDef<T>[]
  finished: boolean
  source: string
}

export interface ColumnMovedEvent<T = any> extends GridEvent<T> {
  column: ColumnDef<T>
  toIndex: number
}

export interface GridReadyEvent<T = any> extends GridEvent<T> {
  api: GridApi<T>
}

// Filter types
export interface FilterModel {
  [key: string]: any
}

export interface TextFilterModel {
  type: 'equals' | 'notEqual' | 'contains' | 'notContains' | 'startsWith' | 'endsWith'
  filter: string
}

export interface NumberFilterModel {
  type: 'equals' | 'notEqual' | 'lessThan' | 'lessThanOrEqual' | 'greaterThan' | 'greaterThanOrEqual' | 'inRange'
  filter: number
  filterTo?: number
}

export interface DateFilterModel {
  type: 'equals' | 'notEqual' | 'lessThan' | 'greaterThan' | 'inRange'
  dateFrom: string
  dateTo?: string
}

export interface SetFilterModel {
  values: string[]
}

// Utility types
export type SortDirection = 'asc' | 'desc' | null
export type PinnedPosition = 'left' | 'right' | null
export type SelectionMode = 'single' | 'multiple'