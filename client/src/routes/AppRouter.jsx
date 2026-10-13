import { Routes, Route, Navigate } from 'react-router-dom'; import { useAuth } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx'; import MainLayout from '../layouts/MainLayout.jsx';
import LoginPage from '../pages/LoginPage.jsx'; import CalendarPage from '../pages/CalendarPage.jsx'; import MaterialsPage from '../pages/MaterialsPage.jsx';
import StaffPage from '../pages/StaffPage.jsx'; import TeamsPage from '../pages/TeamsPage.jsx'; import MyProgramPage from '../pages/MyProgramPage.jsx'; import AvailabilityPage from '../pages/AvailabilityPage.jsx';
export default function AppRouter() {
  const { user, isManager } = useAuth();
  return <Routes>
    <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
    <Route element={<ProtectedRoute />}><Route element={<MainLayout />}>
      <Route index element={<Navigate to={isManager ? '/calendario' : '/programma'} replace />} />
      <Route path="programma" element={<MyProgramPage />} /><Route path="disponibilita" element={<AvailabilityPage />} />
      <Route element={<ProtectedRoute managerOnly />}>
        <Route path="calendario" element={<CalendarPage />} /><Route path="materiale" element={<MaterialsPage />} /><Route path="animatori" element={<StaffPage />} /><Route path="squadre" element={<TeamsPage />} />
      </Route>
    </Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
