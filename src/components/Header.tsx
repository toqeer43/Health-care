import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { setCurrentScreen, searchQuery, setSearchQuery, showToast } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Today, Oct 24');
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const dates = ['Today, Oct 24', 'Yesterday, Oct 23', 'Tue, Oct 22', 'Mon, Oct 21'];

  const notifications = [
    { id: 1, title: 'Electrolyte Alert', desc: 'Active recovery balance recommended after intense interval workout.', unread: true },
    { id: 2, title: 'Protein Trajectory', desc: 'You are on track to achieve 100% hypertrophy stimulus today.', unread: true },
    { id: 3, title: 'Garmin Telemetry', desc: 'Heart Rate Zone 2 recorded (450 active kcal).', unread: false },
  ];

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.15)] z-40 flex items-center justify-between px-space-lg">
      <div className="flex items-center gap-space-md flex-1 max-w-lg">
        {/* Search Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search meals, barcode, macros, ingredients..."
            className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-10 pr-space-md py-space-xs rounded-lg placeholder-outline focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-space-sm top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-[14px]"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        {/* Date Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDateDropdown(!showDateDropdown)}
            className="hidden sm:flex items-center gap-space-xs bg-surface-container-low px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors whitespace-nowrap cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            <span className="font-label-md text-label-md text-on-surface">{selectedDate}</span>
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>

          {showDateDropdown && (
            <div className="absolute top-12 left-0 bg-surface-container-highest border border-white/10 rounded-xl shadow-2xl py-1 w-44 z-50">
              {dates.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDate(d);
                    setShowDateDropdown(false);
                    showToast(`Switched telemetry to ${d}`);
                  }}
                  className={`w-full text-left px-3 py-2 text-body-sm hover:bg-surface-container-high transition-colors ${
                    selectedDate === d ? 'text-primary font-semibold' : 'text-on-surface'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-space-md">
        {/* Quick Log Meal Action */}
        <button
          type="button"
          onClick={() => setCurrentScreen('log-meals-and-ai-scanner')}
          className="flex items-center gap-space-xs bg-primary text-on-primary font-headline-sm font-semibold text-body-md px-space-md py-space-xs rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Log Meal</span>
        </button>

        <div className="flex items-center gap-space-sm relative">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="text-on-surface-variant hover:text-on-surface p-space-xs rounded-full hover:bg-surface-container-high transition-colors relative"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute top-12 right-0 w-80 bg-surface-container rounded-xl shadow-2xl border border-white/10 p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="font-title-md text-title-md text-on-surface">Notifications</span>
                  <span className="font-label-sm text-primary">3 New</span>
                </div>
                <div className="flex flex-col gap-2 pt-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-md text-label-md text-primary">{n.title}</span>
                        {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="cursor-pointer rounded-full ring-2 ring-transparent hover:ring-primary transition-all"
            >
              <img
                alt="Alexander Vance Profile"
                className="w-8 h-8 rounded-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIFMCPqNCfiWcUYzKhVnT0-IgvfGbRWbBfkj-fA-rC0Zkq7LkAslq7D6ksWtvpF6Es0D0SoKPQNzS1zDsrcQp0LB-0s2aO6m-VB3bj2HkXDkOipcyuqGh6rY_yOYygPpTmfTervLcM3Jf-8LBHFkI5HV2ZivOUhE0G1-6RxvGBk6g3T-wXIVBzSZKYaU-J5CmRhEEx8ffx3lhRhZqT741Hvh_TVeU6ObINsc_zlzbNSo0z2dRR_Cjo"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute top-12 right-0 w-64 bg-surface-container rounded-xl shadow-2xl border border-white/10 p-3 z-50">
                <div className="flex items-center gap-2 pb-3 border-b border-white/10">
                  <img
                    alt="Alexander Vance Profile"
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIFMCPqNCfiWcUYzKhVnT0-IgvfGbRWbBfkj-fA-rC0Zkq7LkAslq7D6ksWtvpF6Es0D0SoKPQNzS1zDsrcQp0LB-0s2aO6m-VB3bj2HkXDkOipcyuqGh6rY_yOYygPpTmfTervLcM3Jf-8LBHFkI5HV2ZivOUhE0G1-6RxvGBk6g3T-wXIVBzSZKYaU-J5CmRhEEx8ffx3lhRhZqT741Hvh_TVeU6ObINsc_zlzbNSo0z2dRR_Cjo"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-title-md text-title-md text-on-surface truncate">Alexander Vance</span>
                    <span className="font-label-sm text-label-sm text-primary">Pro Plan • Level 4.2</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('profile-and-fitness-metrics');
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">vital_signs</span>
                    <span>Biometric Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentScreen('ai-diet-coach');
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">smart_toy</span>
                    <span>AI Diet Coach</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Connected to Apple Health, Garmin, and Withings Smart Scale');
                      setShowProfileMenu(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-[18px] text-tertiary">devices_wearables</span>
                    <span>Device Telemetry</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
