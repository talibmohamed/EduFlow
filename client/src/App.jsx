import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden from './pages/Forbidden';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ChildDashboard from './pages/dashboards/ChildDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import CreateHomework from './pages/teacher/CreateHomework'; 

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/403" element={<Forbidden />} />
        
        <Route
          path="/child/dashboard"
          element={
            <ProtectedRoute allowedRoles={['child']}>
              <ChildDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/parent/dashboard"
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        
        <Route
          path="/teacher/homework/create"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <CreateHomework />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}