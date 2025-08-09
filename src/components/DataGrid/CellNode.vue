<template>
  <div 
    class="cell-node"
    :class="{
      'cell-selected': selected,
      'cell-row-selected': rowSelected
    }"
    @click="$emit('cell-click', { rowId, field })"
    @dblclick="$emit('cell-double-click', { rowId, field })"
  >
    {{ value }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: unknown
  rowId: string | number
  field: string
  selected?: boolean
  rowSelected?: boolean
}

defineProps<Props>()

defineEmits<{
  'cell-click': [payload: { rowId: string | number; field: string }]
  'cell-double-click': [payload: { rowId: string | number; field: string }]
}>()
</script>

<style scoped>
.cell-node {
  padding: 8px 12px;
  border-right: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  min-height: 40px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
}

.cell-node:last-child {
  border-right: none;
}

.cell-node:hover {
  background-color: #f5f5f5;
}

.cell-selected {
  background-color: #e3f2fd;
  outline: 2px solid #1976d2;
}

.cell-row-selected {
  background-color: #f0f8ff;
}

.cell-selected.cell-row-selected {
  background-color: #e3f2fd;
}
</style>