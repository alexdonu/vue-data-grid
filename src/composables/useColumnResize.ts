import { ref } from 'vue'
import type { Column } from '../components/DataGrid/types'

export function useColumnResize(initialColumns: Column[]) {
  const columns = ref<Column[]>([...initialColumns])
  
  const resizeColumn = (index: number, newWidth: number) => {
    if (index >= 0 && index < columns.value.length && newWidth > 50) {
      columns.value[index] = {
        ...columns.value[index],
        width: newWidth
      }
    }
  }

  const startResize = (index: number, startX: number) => {
    const startWidth = columns.value[index].width
    
    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const newWidth = Math.max(50, startWidth + deltaX)
      resizeColumn(index, newWidth)
    }
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  return {
    columns,
    resizeColumn,
    startResize
  }
}