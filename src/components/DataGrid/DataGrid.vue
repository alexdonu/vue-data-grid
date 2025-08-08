<template>
  <div
    ref="gridContainer"
    class="vue-data-grid"
    :style="{ '--grid-height': containerHeight }"
    :data-virtual-scrolling="virtualScrolling"
  >
    <!-- Header -->
    <div
      ref="headerContainer"
      class="vue-data-grid-header"
      :style="{ height: `${headerHeight}px` }"
    >
      <div
        class="vue-data-grid-header-row"
        :style="{ transform: `translateX(-${scrollLeft}px)` }"
      >
        <div
          v-for="column in visibleColumns"
          :key="column.field"
          class="vue-data-grid-header-cell"
          :class="getHeaderClass(column)"
          :style="getHeaderStyle(column)"
          @click="handleHeaderClick(column)"
          @mousedown="handleColumnResizeStart($event, column)"
        >
          <div class="vue-data-grid-header-cell-content">
            <span class="vue-data-grid-header-text">
              {{ column.headerName || column.field }}
            </span>
            <span
              v-if="enableSorting && column.sortable !== false"
              class="vue-data-grid-sort-icon"
              :class="getSortIconClass(column)"
            >
              {{ getSortIcon(column) }}
            </span>
          </div>
          <div
            v-if="enableColResize && column.resizable !== false"
            class="vue-data-grid-resize-handle"
          ></div>
        </div>
      </div>
    </div>

    <!-- Body -->
    <div
      ref="bodyContainer"
      class="vue-data-grid-body"
      @scroll="handleScroll"
    >
      <div
        v-for="(rowNode, index) in visibleRowNodes"
        :key="rowNode.id"
        class="vue-data-grid-row"
        :class="getRowClass(rowNode, index)"
        :style="getRowStyle(rowNode, index)"
        @click="handleRowClick($event, rowNode)"
        @dblclick="handleRowDoubleClick($event, rowNode)"
      >
        <div
          v-for="column in visibleColumns"
          :key="`${rowNode.id}-${column.field}`"
          :class="getCellClass(column, rowNode)"
          :style="getCellStyle(column, rowNode)"
          @click="handleCellClick($event, column, rowNode)"
          @dblclick="handleCellDoubleClick($event, column, rowNode)"
        >
          <div class="vue-data-grid-cell-content">
            {{ getCellValue(column, rowNode) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination"
      class="vue-data-grid-pagination"
    >
      <button
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type {
  ColumnDef,
  RowNode,
  GridApi,
  SortModel,
  CellClickedEvent,
  CellDoubleClickedEvent,
  RowClickedEvent,
  RowDoubleClickedEvent,
  SelectionChangedEvent
} from './types'

interface Props {
  columnDefs: ColumnDef[]
  rowData?: Record<string, unknown>[]
  rowHeight?: number
  headerHeight?: number
  defaultColDef?: Partial<ColumnDef>
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
  containerHeight?: string
  getRowId?: (params: { data: Record<string, unknown> }) => string
}

const props = withDefaults(defineProps<Props>(), {
  rowData: () => [],
  rowHeight: 40,
  headerHeight: 40,
  defaultColDef: () => ({}),
  suppressRowClickSelection: false,
  rowSelection: 'single',
  suppressCellSelection: false,
  enableRangeSelection: false,
  enableSorting: true,
  enableFiltering: true,
  enableColResize: true,
  enableCellEdit: false,
  suppressHorizontalScroll: false,
  suppressVerticalScroll: false,
  pagination: false,
  paginationPageSize: 100,
  virtualScrolling: true,
  containerHeight: '400px'
})

// Events
const emit = defineEmits<{
  cellClicked: [event: CellClickedEvent]
  cellDoubleClicked: [event: CellDoubleClickedEvent]
  rowClicked: [event: RowClickedEvent]
  rowDoubleClicked: [event: RowDoubleClickedEvent]
  selectionChanged: [event: SelectionChangedEvent]
  sortChanged: [event: { sortModel: SortModel[] }]
  filterChanged: [event: { filterModel: Record<string, unknown> }]
  gridReady: [event: { api: GridApi }]
}>()

// Refs
const gridContainer = ref<HTMLElement>()
const headerContainer = ref<HTMLElement>()
const bodyContainer = ref<HTMLElement>()

// Reactive state
const scrollLeft = ref(0)
const scrollTop = ref(0)
const containerWidth = ref(0)
const containerHeight = ref(0)
const sortModel = ref<SortModel[]>([])
const filterModel = ref<Record<string, unknown>>({})
const selectedRowIds = ref<Set<string>>(new Set())
const currentPage = ref(1)

// Column management
const visibleColumns = computed(() => {
  return props.columnDefs
    .filter(col => !col.hide)
    .map(col => ({ ...props.defaultColDef, ...col }))
})

// Row data processing
const processedRowData = computed(() => {
  let data = [...(props.rowData || [])]
  
  // Apply filtering
  if (Object.keys(filterModel.value).length > 0) {
    data = data.filter(() => applyFilters())
  }
  
  // Apply sorting
  if (sortModel.value.length > 0) {
    data = data.sort((a, b) => applySorting(a, b, sortModel.value))
  }
  
  return data
})

const rowNodes = computed(() => {
  return processedRowData.value.map((data, index) => ({
    id: props.getRowId ? props.getRowId({ data }) : `row-${index}`,
    data,
    selected: selectedRowIds.value.has(props.getRowId ? props.getRowId({ data }) : `row-${index}`),
    rowIndex: index,
    level: 0,
    expanded: false,
    group: false,
    parent: null,
    childrenAfterGroup: null,
    allChildrenCount: null
  }))
})

// Pagination
const totalPages = computed(() => {
  if (!props.pagination) return 1
  return Math.ceil(processedRowData.value.length / props.paginationPageSize)
})

const paginatedRowNodes = computed(() => {
  if (!props.pagination) return rowNodes.value
  
  const startIndex = (currentPage.value - 1) * props.paginationPageSize
  const endIndex = startIndex + props.paginationPageSize
  return rowNodes.value.slice(startIndex, endIndex)
})

// Virtual scrolling
const displayRowNodes = computed(() => {
  if (!props.virtualScrolling) return paginatedRowNodes.value
  
  const containerHeight = bodyContainer.value?.clientHeight || 400
  const visibleRowCount = Math.ceil(containerHeight / props.rowHeight) + 5
  const startIndex = Math.floor(scrollTop.value / props.rowHeight)
  const endIndex = Math.min(startIndex + visibleRowCount, paginatedRowNodes.value.length)
  
  return paginatedRowNodes.value.slice(startIndex, endIndex)
})

const visibleRowNodes = computed(() => displayRowNodes.value)

const totalRowHeight = computed(() => {
  return paginatedRowNodes.value.length * props.rowHeight
})

const offsetY = computed(() => {
  if (!props.virtualScrolling) return 0
  const startIndex = Math.floor(scrollTop.value / props.rowHeight)
  return startIndex * props.rowHeight
})

// Grid API
const gridApi: GridApi = {
  setRowData: () => {
    // This would need to emit an event to parent to update rowData prop
    emit('gridReady', { api: gridApi })
  },
  getRowData: () => props.rowData || [],
  setColumnDefs: () => {
    // This would need to emit an event to parent to update columnDefs prop
  },
  getColumnDefs: () => props.columnDefs,
  getSelectedRows: () => {
    return rowNodes.value
      .filter(node => selectedRowIds.value.has(node.id))
      .map(node => node.data)
  },
  getSelectedNodes: () => {
    return rowNodes.value.filter(node => selectedRowIds.value.has(node.id))
  },
  selectAll: () => {
    selectedRowIds.value = new Set(rowNodes.value.map(node => node.id))
    emitSelectionChanged()
  },
  deselectAll: () => {
    selectedRowIds.value.clear()
    emitSelectionChanged()
  },
  selectRowsByIndex: (indexes: number[]) => {
    selectedRowIds.value.clear()
    indexes.forEach(index => {
      const node = rowNodes.value[index]
      if (node) {
        selectedRowIds.value.add(node.id)
      }
    })
    emitSelectionChanged()
  },
  getFilterModel: () => filterModel.value,
  setFilterModel: (model: Record<string, unknown>) => {
    filterModel.value = model
    emit('filterChanged', { filterModel: model })
  },
  getSortModel: () => sortModel.value,
  setSortModel: (model: SortModel[]) => {
    sortModel.value = model
    emit('sortChanged', { sortModel: model })
  },
  exportDataAsCsv: () => {
    // TODO: Implement CSV export
  },
  exportDataAsExcel: () => {
    // TODO: Implement Excel export
  },
  sizeColumnsToFit: () => {
    // TODO: Implement auto-sizing
  },
  autoSizeAllColumns: () => {
    // TODO: Implement auto-sizing
  },
  refreshCells: () => {
    // TODO: Implement cell refresh
  },
  redrawRows: () => {
    // TODO: Implement row redraw
  },
  getDisplayedRowCount: () => visibleRowNodes.value.length,
  getFirstDisplayedRow: () => {
    return Math.floor(scrollTop.value / props.rowHeight)
  },
  getLastDisplayedRow: () => {
    const firstRow = Math.floor(scrollTop.value / props.rowHeight)
    const visibleRows = Math.ceil((bodyContainer.value?.clientHeight || 400) / props.rowHeight)
    return Math.min(firstRow + visibleRows - 1, paginatedRowNodes.value.length - 1)
  },
  ensureIndexVisible: (index: number) => {
    const targetScrollTop = index * props.rowHeight
    if (bodyContainer.value) {
      bodyContainer.value.scrollTop = targetScrollTop
    }
  },
  ensureNodeVisible: (node: RowNode) => {
    const index = rowNodes.value.findIndex(n => n.id === node.id)
    if (index >= 0) {
      gridApi.ensureIndexVisible(index)
    }
  }
}

// Event handlers
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement
  scrollLeft.value = target.scrollLeft
  scrollTop.value = target.scrollTop
}

const handleHeaderClick = (column: ColumnDef) => {
  if (!props.enableSorting || column.sortable === false) return
  
  const existingSort = sortModel.value.find(s => s.colId === column.field)
  let newSortModel = [...sortModel.value]
  
  if (existingSort) {
    if (existingSort.sort === 'asc') {
      existingSort.sort = 'desc'
    } else if (existingSort.sort === 'desc') {
      newSortModel = newSortModel.filter(s => s.colId !== column.field)
    }
  } else {
    newSortModel.push({ colId: column.field, sort: 'asc' })
  }
  
  sortModel.value = newSortModel
  emit('sortChanged', { sortModel: newSortModel })
}

const handleRowClick = (event: MouseEvent, rowNode: RowNode) => {
  if (!props.suppressRowClickSelection) {
    if (props.rowSelection === 'single') {
      selectedRowIds.value.clear()
      selectedRowIds.value.add(rowNode.id)
    } else {
      if (selectedRowIds.value.has(rowNode.id)) {
        selectedRowIds.value.delete(rowNode.id)
      } else {
        selectedRowIds.value.add(rowNode.id)
      }
    }
    emitSelectionChanged()
  }
  
  emit('rowClicked', {
    api: gridApi,
    type: 'rowClicked',
    data: rowNode.data,
    node: rowNode,
    rowIndex: rowNode.rowIndex,
    event
  })
}

const handleRowDoubleClick = (event: MouseEvent, rowNode: RowNode) => {
  emit('rowDoubleClicked', {
    api: gridApi,
    type: 'rowDoubleClicked',
    data: rowNode.data,
    node: rowNode,
    rowIndex: rowNode.rowIndex,
    event
  })
}

const handleCellClick = (event: MouseEvent, column: ColumnDef, rowNode: RowNode) => {
  const value = getCellValue(column, rowNode)
  
  emit('cellClicked', {
    api: gridApi,
    type: 'cellClicked',
    data: rowNode.data,
    node: rowNode,
    column,
    value,
    rowIndex: rowNode.rowIndex,
    event
  })
}

const handleCellDoubleClick = (event: MouseEvent, column: ColumnDef, rowNode: RowNode) => {
  const value = getCellValue(column, rowNode)
  
  emit('cellDoubleClicked', {
    api: gridApi,
    type: 'cellDoubleClicked',
    data: rowNode.data,
    node: rowNode,
    column,
    value,
    rowIndex: rowNode.rowIndex,
    event
  })
}

const handleColumnResizeStart = (event: MouseEvent, _column: ColumnDef) => {
  // TODO: Implement column resizing
  event.preventDefault()
}

// Utility functions
const getCellValue = (column: ColumnDef, rowNode: RowNode) => {
  if (column.valueGetter) {
    return column.valueGetter({
      data: rowNode.data,
      node: rowNode,
      column,
      api: gridApi
    })
  }
  return rowNode.data[column.field]
}

const applyFilters = (): boolean => {
  // TODO: Implement filtering logic
  return true
}

const applySorting = (a: Record<string, unknown>, b: Record<string, unknown>, sortModel: SortModel[]): number => {
  for (const sort of sortModel) {
    const column = visibleColumns.value.find(col => col.field === sort.colId)
    if (!column) continue
    
    const aValue = a[sort.colId] as string | number
    const bValue = b[sort.colId] as string | number
    
    let result = 0
    if (column.comparator) {
      result = column.comparator(aValue, bValue)
    } else {
      if (aValue < bValue) result = -1
      else if (aValue > bValue) result = 1
    }
    
    if (result !== 0) {
      return sort.sort === 'asc' ? result : -result
    }
  }
  return 0
}

const emitSelectionChanged = () => {
  const selectedNodes = rowNodes.value.filter(node => selectedRowIds.value.has(node.id))
  const selectedRows = selectedNodes.map(node => node.data)
  
  emit('selectionChanged', {
    api: gridApi,
    type: 'selectionChanged',
    selectedNodes,
    selectedRows
  })
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// Style functions
const getHeaderClass = (column: ColumnDef) => {
  const classes = ['vue-data-grid-header-cell']
  if (column.headerClass) {
    if (Array.isArray(column.headerClass)) {
      classes.push(...column.headerClass)
    } else {
      classes.push(column.headerClass)
    }
  }
  return classes
}

const getHeaderStyle = (column: ColumnDef) => {
  const style: Record<string, string> = {}
  
  if (column.width) {
    style.width = `${column.width}px`
    style.minWidth = `${column.width}px`
    style.maxWidth = `${column.width}px`
  } else {
    if (column.minWidth) style.minWidth = `${column.minWidth}px`
    if (column.maxWidth) style.maxWidth = `${column.maxWidth}px`
  }
  
  if (column.headerStyle) {
    Object.assign(style, column.headerStyle)
  }
  
  return style
}

const getRowClass = (rowNode: RowNode, index: number) => {
  const classes = ['vue-data-grid-row']
  if (rowNode.selected) classes.push('vue-data-grid-row-selected')
  if (index % 2 === 0) classes.push('vue-data-grid-row-even')
  else classes.push('vue-data-grid-row-odd')
  return classes
}

const getRowStyle = (rowNode: RowNode, index: number) => {
  const style: Record<string, string> = {
    height: `${props.rowHeight}px`
  }
  
  if (props.virtualScrolling) {
    style.top = `${index * props.rowHeight}px`
  }
  
  return style
}

const getCellClass = (column: ColumnDef, rowNode: RowNode) => {
  const classes = ['vue-data-grid-cell']
  
  if (column.cellClass) {
    if (typeof column.cellClass === 'function') {
      const result = column.cellClass({
        value: getCellValue(column, rowNode),
        data: rowNode.data,
        node: rowNode,
        column,
        rowIndex: rowNode.rowIndex,
        api: gridApi
      })
      if (Array.isArray(result)) {
        classes.push(...result)
      } else {
        classes.push(result)
      }
    } else if (Array.isArray(column.cellClass)) {
      classes.push(...column.cellClass)
    } else {
      classes.push(column.cellClass)
    }
  }
  
  return classes
}

const getCellStyle = (column: ColumnDef, rowNode: RowNode) => {
  const style: Record<string, string> = {}
  
  if (column.width) {
    style.width = `${column.width}px`
    style.minWidth = `${column.width}px`
    style.maxWidth = `${column.width}px`
  }
  
  if (column.cellStyle) {
    if (typeof column.cellStyle === 'function') {
      const result = column.cellStyle({
        value: getCellValue(column, rowNode),
        data: rowNode.data,
        node: rowNode,
        column,
        rowIndex: rowNode.rowIndex,
        api: gridApi
      })
      Object.assign(style, result)
    } else {
      Object.assign(style, column.cellStyle)
    }
  }
  
  return style
}

const getSortIcon = (column: ColumnDef) => {
  const sort = sortModel.value.find(s => s.colId === column.field)
  if (!sort) return ''
  return sort.sort === 'asc' ? '↑' : '↓'
}

const getSortIconClass = (column: ColumnDef) => {
  const sort = sortModel.value.find(s => s.colId === column.field)
  return sort ? 'active' : ''
}

// Lifecycle
onMounted(() => {
  if (gridContainer.value) {
    containerWidth.value = gridContainer.value.clientWidth
    containerHeight.value = gridContainer.value.clientHeight
  }
  
  // Debug logging
  console.log('Grid mounted:', {
    visibleColumns: visibleColumns.value.length,
    rowNodes: rowNodes.value.length,
    virtualScrolling: props.virtualScrolling
  })
  
  // Emit grid ready event
  nextTick(() => {
    emit('gridReady', { api: gridApi })
  })
})

// Expose API
defineExpose({
  api: gridApi
})
</script>