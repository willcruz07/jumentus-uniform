import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import UniformForm from './components/UniformForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
       <UniformForm />
  </StrictMode>,
)
