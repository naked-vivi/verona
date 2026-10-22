import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './routes.tsx'
import "./index.css"
import { Provider } from 'react-redux'
import store from './store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <Router />
    </Provider>
  </StrictMode>,
)
