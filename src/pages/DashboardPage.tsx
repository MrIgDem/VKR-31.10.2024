import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardCards } from '../components/analytics/DashboardCards';
import { AnalyticsDashboard } from '../components/analytics/AnalyticsDashboard';
import { useAuthStore } from '../store/authStore';

export function DashboardPage() {
  const { user, logout } = useAuthStore();

  if (!user) return null;

  return (
    <DashboardLayout user={user} onLogout={logout}>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Панель управления</h1>
        
        <DashboardCards />
        <AnalyticsDashboard />
      </div>
    </DashboardLayout>
  );
}