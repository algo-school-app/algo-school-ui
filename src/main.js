import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../css/input.css'
import { loadCustomTheme } from './utils/themeLoader.js'
import { configService } from './services/configService.js'
import { initializeSupabase } from './services/supabase.js'

// Bootstrap function to initialize app with dynamic configuration
async function bootstrap() {
  try {
    // Fetch dynamic configuration first
    await configService.fetchConfig()
    
    // Initialize Supabase with dynamic config
    initializeSupabase()
    
    // Load custom theme on startup
    loadCustomTheme()

    // Create and mount the app
    const app = createApp(App)
    app.use(router)
    
    // Make config service available globally
    app.config.globalProperties.$config = configService
    
    app.mount('#app')
    
    console.log('Application started successfully with dynamic configuration')
    
  } catch (error) {
    console.error('Failed to start application:', error)
    
    // Show error message to user
    document.body.innerHTML = `
      <div style="
        display: flex; 
        flex-direction: column; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        font-family: system-ui, sans-serif;
        background: #f9fafb;
        color: #374151;
        text-align: center;
        padding: 2rem;
      ">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">Configuration Error</h1>
        <p style="margin-bottom: 1rem; max-width: 600px;">
          Failed to load application configuration. Please check your deployment settings.
        </p>
        <pre style="
          background: #f3f4f6; 
          padding: 1rem; 
          border-radius: 0.5rem; 
          color: #ef4444;
          font-size: 0.875rem;
          max-width: 800px;
          overflow: auto;
        ">${error.message}</pre>
        <button onclick="window.location.reload()" style="
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
        ">Retry</button>
      </div>
    `
    
    // Re-throw to stop execution
    throw error
  }
}

// Start the application
bootstrap()
