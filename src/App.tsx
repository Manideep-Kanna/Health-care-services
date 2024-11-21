import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSetAtom, useAtom } from 'jotai';
import { Toaster } from 'sonner';
import { Sidebar } from './components/layout/Sidebar';
import { AuthGuard } from './components/AuthGuard';
import { initializeAuth, userAtom } from './lib/auth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { BookAppointment } from './pages/BookAppointment';
import { MyAppointments } from './pages/MyAppointments';
import { MedicalRecords } from './pages/MedicalRecords';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { RegisterDoctor } from './pages/RegisterDoctor';

function App() {
  const setUser = useSetAtom(userAtom);
  const [user] = useAtom(userAtom);

  useEffect(() => {
    initializeAuth().then(setUser);
  }, [setUser]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route
          path="/*"
          element={
            <AuthGuard>
              <div className="min-h-screen bg-background">
                <Sidebar />
                <main className="lg:pl-64">
                  <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <Routes>
                      <Route 
                        path="/" 
                        element={
                          user?.user_metadata?.role === 'doctor' 
                            ? <DoctorDashboard /> 
                            : <Home />
                        } 
                      />
                      <Route 
                        path="/book" 
                        element={
                          user?.user_metadata?.role === 'doctor' 
                            ? <Navigate to="/" replace /> 
                            : <BookAppointment />
                        } 
                      />
                      <Route 
                        path="/appointments" 
                        element={
                          user?.user_metadata?.role === 'doctor' 
                            ? <Navigate to="/" replace /> 
                            : <MyAppointments />
                        } 
                      />
                      <Route path="/records" element={<MedicalRecords />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                    </Routes>
                  </div>
                </main>
              </div>
            </AuthGuard>
          }
        />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;