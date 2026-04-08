import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Shed2MachineForm from './Shed2MachineForm.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shed2" element={<Shed2MachineForm />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
