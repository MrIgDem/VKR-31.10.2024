import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../types/auth';

// Определяем доступные маршруты для каждой роли
const roleRoutes: Record<Role, string[]> = {
  director: [
    '/dashboard',
    '/projects',
    '/tasks',
    '/employees',
    '/settings',
    '/settings/organization',
    '/settings/equipment',
    '/settings/materials',
    '/documents',
    '/map'
  ],
  manager: [
    '/dashboard',
    '/projects',
    '/tasks',
    '/employees',
    '/documents',
    '/map'
  ],
  engineer: [
    '/dashboard',
    '/tasks',
    '/documents',
    '/map'
  ],
  installer: [
    '/dashboard',
    '/tasks',
    '/map'
  ],
  contractor: [
    '/dashboard',
    '/tasks'
  ]
};

export function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Проверяем, имеет ли пользователь доступ к текущему маршруту
  const hasAccess = user && roleRoutes[user.role].some(route => 
    location.pathname.startsWith(route)
  );

  // Если нет доступа, перенаправляем на дашборд
  if (!hasAccess) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
}