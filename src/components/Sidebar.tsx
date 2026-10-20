import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenId } from '../types';

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, dailyTotals, userProfile, isBleSyncing, triggerBleSync, lastBleSync } = useApp();

  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'daily-dashboard', label: 'Daily Dashboard', icon: 'donut_large' },
    { id: 'log-meals-and-ai-scanner', label: 'Log Meals & AI Scanner', icon: 'document_scanner' },
    { id: 'ai-diet-coach', label: 'AI Diet Coach', icon: 'smart_toy' },
    { id: 'profile-and-fitness-metrics', label: 'Profile & Metrics', icon: 'vital_signs' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col justify-between py-space-lg px-space-md shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-space-lg">
        {/* Logo Section */}
        <div
          onClick={() => setCurrentScreen('daily-dashboard')}
          className="flex items-center gap-space-sm px-space-sm cursor-pointer group"
        >
          <img
            alt="NutriPulse AI Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VXgpjXI-CHym4m5FWEvDxBKON_UQTi2zWW1sNsDzZRIyurJAgs3_P1z4L8h083TVB0N-t5hDQNDTHmePP80eGwLLnu9DtWWFFL3YLwveWRPRCwTaaDhSxw3jIJkLwawBTx0UHxOCx_DtLozyXtQaDDRaLWb3idedWVKxzlfzLgT6B-_5xLdJKKLYl0PgUg-RZBm9zYIg1h_aae8_VnXTXvnhg_jgcvEL0d4REY-RPC7HjggJJhkqMrfOU"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">NutriPulse</span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase font-semibold">
              AI Precision Health
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCurrentScreen(item.id)}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-all text-left ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-headline-sm font-semibold shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-title-md text-title-md">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Daily Fuel Gauge in Sidebar */}
      <div className="flex flex-col gap-space-md px-space-sm">
        <div className="bg-surface-container rounded-xl p-space-md shadow-[0_12px_32px_-4px_rgba(16,185,129,0.08)]">
          <div className="flex items-center justify-between mb-space-xs">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Daily Fuel</span>
            <span className="font-label-md text-label-md text-primary font-semibold">
              {dailyTotals.calories.toLocaleString()} / {userProfile.targetCalories.toLocaleString()} kcal
            </span>
          </div>

          <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden mb-space-sm">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, dailyTotals.caloriePercentage)}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-space-xs text-center">
            <div className="bg-surface-container-low rounded-lg py-space-xs px-1">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">P</span>
              <span className="font-title-md text-title-md text-primary font-bold">{dailyTotals.protein}g</span>
            </div>
            <div className="bg-surface-container-low rounded-lg py-space-xs px-1">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">C</span>
              <span className="font-title-md text-title-md text-secondary font-bold">{dailyTotals.carbs}g</span>
            </div>
            <div className="bg-surface-container-low rounded-lg py-space-xs px-1">
              <span className="block font-label-sm text-label-sm text-on-surface-variant">F</span>
              <span className="font-title-md text-title-md text-tertiary font-bold">{dailyTotals.fats}g</span>
            </div>
          </div>
        </div>

        {/* Sync Status Button */}
        <button
          type="button"
          onClick={triggerBleSync}
          className="flex items-center justify-between pt-space-xs px-space-xs text-outline hover:text-on-surface transition-colors cursor-pointer group"
          title="Click to trigger BLE sync with connected devices"
        >
          <span className="font-label-sm text-label-sm">
            {isBleSyncing ? 'Syncing sensors...' : `Sync: ${lastBleSync}`}
          </span>
          <span
            className={`material-symbols-outlined text-primary text-[18px] ${
              isBleSyncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'
            }`}
          >
            sync
          </span>
        </button>
      </div>
    </aside>
  );
};
