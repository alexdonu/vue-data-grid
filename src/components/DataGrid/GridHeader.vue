<template>
  <div class="grid-header">
    <div
      v-for="(column, index) in columns"
      :key="column.field"
      class="header-cell"
      :style="{ width: column.width + 'px', minWidth: column.width + 'px' }"
    >
      <span class="header-text">{{ column.header }}</span>
      <div
        class="resize-handle"
        @mousedown="handleResizeStart($event, index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Column } from './types'

interface Props {
  columns: Column[]
}

defineProps<Props>()

const emit = defineEmits<{
  'start-resize': [payload: { index: number; startX: number }]
}>()

const handleResizeStart = (e: MouseEvent, index: number) => {
  e.preventDefault()
  emit('start-resize', { index, startX: e.clientX })
}
</script>

<style scoped>
.grid-header {
  display: flex;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-right: 1px solid #e0e0e0;
  min-height: 40px;
  box-sizing: border-box;
  position: relative;
  user-select: none;
}

.header-cell:last-child {
  border-right: none;
}

.header-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resize-handle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
  background: transparent;
  border-right: 2px solid transparent;
  transition: border-color 0.2s;
}

.resize-handle:hover {
  border-right-color: #1976d2;
}

.resize-handle:active {
  border-right-color: #1565c0;
}
</style>