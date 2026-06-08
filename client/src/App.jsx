import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Forbidden from './pages/Forbidden';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ChildDashboard from './pages/dashboards/ChildDashboard';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import TeacherDashboard from './pages/dashboards/TeacherDashboard';
import CreateHomework from './pages/teacher/CreateHomework';
import UiKit from './pages/UiKit';
import ChildDetail from './pages/parent/ChildDetail';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />

        {/* Backwards-compatible aliases for the previous routes */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth?mode=register" replace />} />
        <Route path="/child-login" element={<Navigate to="/auth?role=child" replace />} />

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
            path="/parent/child/:id"
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ChildDetail />
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

        <Route path="/ui-kit" element={<UiKit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
