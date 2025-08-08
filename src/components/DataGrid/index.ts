import type { App } from 'vue'
import DataGrid from './DataGrid.vue'
import './styles.css'

// Export the component
export { default as DataGrid } from './DataGrid.vue'

// Export all types
export * from './types'

// Vue plugin for global registration
export const VueDataGridPlugin = {
  install(app: App) {
    app.component('DataGrid', DataGrid)
  }
}

// Export default for convenient imports
export default DataGrid

// Named export for explicit imports
export { DataGrid as VueDataGrid }