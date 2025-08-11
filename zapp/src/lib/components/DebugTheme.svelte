<!-- src/lib/components/DebugTheme.svelte -->
<script>
  import { theme, themeManager, appliedTheme, THEMES } from '$lib/stores/theme.js';
  
  // Simple reactive statements
  $: currentTheme = $theme;
  $: currentAppliedTheme = $appliedTheme;
  
  // Simple test functions
  const testToggle = () => {
    console.log('=== DEBUG: Test toggle clicked ===');
    themeManager.toggleTheme();
  };
  
  const testSetLight = () => {
    console.log('=== DEBUG: Set light clicked ===');
    themeManager.setTheme(THEMES.LIGHT);
  };
  
  const testSetDark = () => {
    console.log('=== DEBUG: Set dark clicked ===');
    themeManager.setTheme(THEMES.DARK);
  };
  
  const testSetAuto = () => {
    console.log('=== DEBUG: Set auto clicked ===');
    themeManager.setTheme(THEMES.AUTO);
  };
  
  // Log theme changes
  $: console.log('DEBUG: Current theme changed to:', currentTheme);
  $: console.log('DEBUG: Applied theme changed to:', currentAppliedTheme);
</script>

<div class="debug-container">
  <h3>🐛 Theme Debug Panel</h3>
  
  <div class="debug-info">
    <p><strong>Current Theme:</strong> {currentTheme}</p>
    <p><strong>Applied Theme:</strong> {currentAppliedTheme}</p>
    <p><strong>Document data-theme:</strong> {document?.documentElement?.getAttribute('data-theme') || 'not set'}</p>
    <p><strong>Document classes:</strong> {document?.documentElement?.className || 'none'}</p>
  </div>
  
  <div class="debug-buttons">
    <button 
      on:click={testToggle}
      style="background: #9146ff; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Toggle Theme
    </button>
    
    <button 
      on:click={testSetLight}
      style="background: #fbbf24; color: black; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Set Light
    </button>
    
    <button 
      on:click={testSetDark}
      style="background: #374151; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Set Dark
    </button>
    
    <button 
      on:click={testSetAuto}
      style="background: #6b7280; color: white; padding: 8px 16px; border: none; border-radius: 4px; margin: 4px; cursor: pointer;"
    >
      Set Auto
    </button>
  </div>
  
  <div class="css-test">
    <h4>CSS Variables Test:</h4>
    <div class="test-box" style="background: var(--bg-primary, red); color: var(--text-primary, blue); padding: 1rem; border: 1px solid var(--border-light, green);">
      This box should use CSS variables. If you see red/blue/green, the variables aren't working.
    </div>
  </div>
</div>

<style>
  .debug-container {
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: white;
    border: 2px solid #9146ff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 9999;
    font-family: monospace;
    font-size: 12px;
    max-width: 300px;
  }
  
  .debug-info {
    margin: 0.5rem 0;
  }
  
  .debug-info p {
    margin: 0.25rem 0;
  }
  
  .debug-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .css-test {
    margin-top: 1rem;
  }
  
  .test-box {
    margin-top: 0.5rem;
    font-size: 10px;
  }
</style>