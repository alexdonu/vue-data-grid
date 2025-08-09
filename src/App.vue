<script setup lang="ts">
import BasicGridExample from './examples/BasicGridExample.vue'
</script>

<template>
  <div id="app">
    <header>
      <h1>Vue Data Grid Development</h1>
      <p>A modern, performant data grid component for Vue.js</p>
    </header>

    <main>
      <div class="controls">
        <button>Add More Data (50 rows)</button>
        <p>Current rows: (currently does not workm)</p>
      </div>

      <div class="grid-container">
        <BasicGridExample />
      </div>

      <section class="features">
        <h2>Features Implemented</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>✅ Core Features</h3>
            <ul>
              <li>Column definitions</li>
              <li>Row data rendering</li>
              <li>Virtual scrolling</li>
              <li>Row selection (single/multiple)</li>
              <li>Sorting (single/multi-column)</li>
              <li>Pagination</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>🚧 In Progress</h3>
            <ul>
              <li>Column resizing</li>
              <li>Filtering</li>
              <li>Cell editing</li>
              <li>Custom cell renderers</li>
              <li>Export functionality</li>
              <li>Column pinning</li>
            </ul>
          </div>
          <div class="feature-card">
            <h3>📋 Planned</h3>
            <ul>
              <li>Row grouping</li>
              <li>Drag and drop</li>
              <li>Context menus</li>
              <li>Keyboard navigation</li>
              <li>Infinite scrolling</li>
              <li>Theme customization</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
#app {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
}

header {
  text-align: center;
  margin-bottom: 30px;
}

header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

header p {
  color: #7f8c8d;
  font-size: 18px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.controls button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.controls button:hover {
  background: #2980b9;
}

.controls p {
  margin: 0;
  font-weight: 600;
  color: #2c3e50;
}

.grid-container {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.features {
  margin-top: 40px;
}

.features h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3498db;
}

.feature-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
}

.feature-card ul {
  margin: 0;
  padding-left: 20px;
}

.feature-card li {
  margin-bottom: 8px;
  color: #555;
}

/* Responsive design */
@media (max-width: 768px) {
  #app {
    padding: 15px;
  }

  .controls {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>
