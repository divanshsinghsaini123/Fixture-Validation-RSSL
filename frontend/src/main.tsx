import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'
import Shed2MachineForm from './Shed2MachineForm.tsx'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Dashboard from './components/Dashboard.tsx'
import CreateAssignment from './components/CreateAssignment.tsx'
import DataDashboard from './components/DataDashboard.tsx'
import MachineReview from './components/MachineReview.tsx'

// Basic guard component protecting routes if JWT token doesn't exist
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to="/login" replace />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="/dashboard/shed2" element={
          <PrivateRoute>
            <Shed2MachineForm />
          </PrivateRoute>
        } />
        <Route path="/dashboard/data" element={
          <PrivateRoute>
            <DataDashboard />
          </PrivateRoute>
        } />
        <Route path="/create-assignment" element={
          <PrivateRoute>
            <CreateAssignment />
          </PrivateRoute>
        } />
        <Route path="/review" element={
          <PrivateRoute>
            <MachineReview />
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
