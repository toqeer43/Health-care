/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DailyDashboardScreen } from './screens/DailyDashboardScreen';
import { LogMealsScreen } from './screens/LogMealsScreen';
import { AIDietCoachScreen } from './screens/AIDietCoachScreen';
import { ProfileMetricsScreen } from './screens/ProfileMetricsScreen';

const MainLayout: React.FC = () => {
  const { currentScreen, toastMessage } = useApp();

  return (
    <div className="bg-background font-body-md text-on-surface antialiased min-h-screen relative selection:bg-primary/20 selection:text-primary">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-surface-container-highest border border-primary/40 text-on-surface px-4 py-3 rounded-xl shadow-2xl animate-bounce">
          <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          <span className="font-label-md text-label-md font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Global Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area (offset left by sidebar width: 72 = 18rem = 288px) */}
      <div className="pl-72">
        <Header />
        <main className="w-full pt-16 bg-background px-space-lg min-h-screen">
          {currentScreen === 'daily-dashboard' && <DailyDashboardScreen />}
          {currentScreen === 'log-meals-and-ai-scanner' && <LogMealsScreen />}
          {currentScreen === 'ai-diet-coach' && <AIDietCoachScreen />}
          {currentScreen === 'profile-and-fitness-metrics' && <ProfileMetricsScreen />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
