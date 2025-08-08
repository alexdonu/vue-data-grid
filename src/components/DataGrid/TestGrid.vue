<template>
  <div class="test-grid">
    <div class="test-header">
      <div class="test-header-cell">Name</div>
      <div class="test-header-cell">Age</div>
      <div class="test-header-cell">Email</div>
    </div>
    <div class="test-body">
      <div class="test-row">
        <div class="test-cell">John Doe</div>
        <div class="test-cell">30</div>
        <div class="test-cell">john@example.com</div>
      </div>
      <div class="test-row">
        <div class="test-cell">Jane Smith</div>
        <div class="test-cell">25</div>
        <div class="test-cell">jane@example.com</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-grid {
  border: 1px solid #ccc;
  height: 200px;
}

.test-header,
.test-row {
  display: flex;
  border-bottom: 1px solid #ccc;
}

.test-header-cell,
.test-cell {
  flex: 1;
  padding: 8px;
  border-right: 1px solid #ccc;
  min-width: 100px;
}

.test-header-cell:last-child,
.test-cell:last-child {
  border-right: none;
}

.test-header {
  background: #f5f5f5;
  font-weight: bold;
}

.test-body {
  flex: 1;
  overflow: auto;
}
</style>