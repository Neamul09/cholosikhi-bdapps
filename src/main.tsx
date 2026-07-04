import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useSettingsStore } from './store/settingsStore'
import { setSoundEnabled } from './lib/audio'
import './index.css'

// Bridge the persisted settings store -> audio engine at boot so
// `play()` calls read the live user's preference immediately.
setSoundEnabled(useSettingsStore.getState().soundEnabled)
useSettingsStore.subscribe((s) => setSoundEnabled(s.soundEnabled))

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)
