import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const DailyDashboardScreen: React.FC = () => {
  const {
    userProfile,
    loggedMeals,
    dailyTotals,
    waterLitres,
    targetWater,
    logWater,
    quickLogDinner,
    dinnerLogged,
    setCurrentScreen,
    removeMeal,
    searchQuery,
    showToast,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'breakfast' | 'lunch' | 'dinner' | 'snack'>('all');
  const [mealMenuOpen, setMealMenuOpen] = useState<string | null>(null);

  // Filtered meals based on category filter & search query
  const filteredMeals = loggedMeals.filter((m) => {
    const matchesFilter = activeCategoryFilter === 'all' || m.category === activeCategoryFilter;
    const matchesSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const waterPercentage = Math.min(100, Math.round((waterLitres / targetWater) * 100));

  // Ring calculations for SVG circle
  // Outer circle radius 82 -> circumference = 2 * Math.PI * 82 ≈ 515.22
  const outerCircumference = 515.2;
  const outerOffset = outerCircumference * (1 - Math.min(1, dailyTotals.calories / (userProfile.targetCalories || 2150)));

  // Burn circle radius 66 -> circumference = 2 * Math.PI * 66 ≈ 414.69
  const burnCircumference = 414.7;
  const burnOffset = burnCircumference * (1 - 450 / 600);

  // Hydration circle radius 52 -> circumference = 2 * Math.PI * 52 ≈ 326.72
  const waterCircumference = 326.7;
  const waterOffset = waterCircumference * (1 - waterLitres / targetWater);

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Subtle Ambient Glow Orbs */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-48 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top Hero & Health Telemetry Banner */}
      <section className="w-full pt-space-lg pb-space-md">
        <div className="bg-surface-container rounded-xl p-space-lg shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/10 via-surface-container to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-lg">
            {/* User Greeting & Core Status */}
            <div className="flex flex-col gap-space-xs max-w-2xl">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-primary font-label-sm text-label-sm font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  METABOLIC SYNC ACTIVE
                </span>
                <span className="inline-flex items-center gap-1 bg-surface-container-high px-2.5 py-1 rounded-full text-tertiary font-label-sm text-label-sm font-semibold">
                  <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                  14-DAY STREAK
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-1 font-bold">
                Welcome back, {userProfile.name.split(' ')[0]}!
                <span className="text-primary font-headline-md block xl:inline text-headline-md font-semibold">
                  {' '}
                  You&apos;re {dailyTotals.remainingCalories} kcal away from target.
                </span>
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Hydration and macro pacing are 9.2% ahead of yesterday. Active recovery metabolic rate adjusted for your
                scheduled leg session.
              </p>
            </div>

            {/* Integrated Water Intake & Hydration Widget */}
            <div className="w-full xl:w-auto bg-surface-container-low p-space-md rounded-xl flex flex-col gap-space-xs min-w-[280px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">water_drop</span>
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Hydration</span>
                </div>
                <span className="font-label-md text-label-md text-secondary font-semibold">
                  {waterLitres.toFixed(2)}L / {targetWater.toFixed(2)}L
                </span>
              </div>

              {/* Quick interactive hydration increments */}
              <div className="flex items-center justify-between gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => logWater(0.25)}
                  className="flex-1 py-1.5 px-2 bg-surface-container-high hover:bg-surface-bright rounded-lg text-center transition-all group cursor-pointer"
                  title="Add 250ml water"
                >
                  <span className="material-symbols-outlined text-secondary text-[16px] group-hover:scale-110 transition-transform block mx-auto">
                    local_drink
                  </span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant group-hover:text-secondary mt-0.5">
                    +250ml
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => logWater(0.5)}
                  className="flex-1 py-1.5 px-2 bg-surface-container-high hover:bg-surface-bright rounded-lg text-center transition-all group cursor-pointer"
                  title="Add 500ml water"
                >
                  <span className="material-symbols-outlined text-secondary text-[16px] group-hover:scale-110 transition-transform block mx-auto">
                    water_full
                  </span>
                  <span className="block font-label-sm text-label-sm text-on-surface-variant group-hover:text-secondary mt-0.5">
                    +500ml
                  </span>
                </button>
                <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-highest/60 rounded-lg py-1 px-2">
                  <span className="font-metric-value-md text-metric-value-md text-secondary font-bold">
                    {waterPercentage}%
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Optimal</span>
                </div>
              </div>

              {/* Hydration progress indicator */}
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden mt-1">
                <div
                  className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${waterPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Daily Insight Floating Alert */}
      <section className="w-full pb-space-lg">
        <div className="bg-gradient-to-r from-primary-container/20 via-surface-container to-surface-container rounded-xl p-space-md shadow-md flex items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.35)]">
              <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  NutriPulse Neural Engine
                </span>
                <span className="text-on-surface-variant font-label-sm text-label-sm">• Real-time recommendation</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface truncate">
                Your protein synthesis trajectory is optimal today! Adding{' '}
                <span className="font-semibold text-primary">15g protein</span> at dinner will lock in your 100% hypertrophy
                stimulus goal.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={quickLogDinner}
            className="shrink-0 hidden md:inline-flex items-center gap-1 px-3 py-1.5 bg-surface-container-high hover:bg-surface-bright text-primary font-label-md text-label-md rounded-lg transition-colors cursor-pointer"
          >
            <span>{dinnerLogged ? 'Dinner Logged ✓' : 'Apply to Dinner'}</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Main Caloric & Macro Telemetry Bento Grid */}
      <section className="w-full pb-space-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
          {/* Caloric Ring Visualizer Card (lg: 5 cols) */}
          <div className="lg:col-span-5 bg-surface-container rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-md">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant block">
                  Energy Balance
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">Daily Fuel Gauge</h2>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1 rounded-md text-primary font-label-sm text-label-sm font-semibold">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>Target {userProfile.targetCalories.toLocaleString()}</span>
              </div>
            </div>

            {/* Concentric SVG Dial Gauge */}
            <div className="flex flex-col items-center justify-center py-space-sm relative">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                  {/* Outer Track: Calories Consumed vs Goal */}
                  <circle
                    className="text-surface-container-highest"
                    cx="100"
                    cy="100"
                    fill="none"
                    opacity="0.3"
                    r="82"
                    stroke="currentColor"
                    strokeWidth="12"
                  />
                  <circle
                    className="text-primary transition-all duration-700"
                    cx="100"
                    cy="100"
                    fill="none"
                    r="82"
                    stroke="currentColor"
                    strokeDasharray="515.2"
                    strokeDashoffset={Math.max(0, outerOffset)}
                    strokeLinecap="round"
                    strokeWidth="12"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(78, 222, 163, 0.45))' }}
                  />
                  {/* Middle Track: Workout Burned (450 kcal) */}
                  <circle
                    className="text-surface-container-highest"
                    cx="100"
                    cy="100"
                    fill="none"
                    opacity="0.3"
                    r="66"
                    stroke="currentColor"
                    strokeWidth="10"
                  />
                  <circle
                    className="text-secondary transition-all duration-700"
                    cx="100"
                    cy="100"
                    fill="none"
                    r="66"
                    stroke="currentColor"
                    strokeDasharray="414.7"
                    strokeDashoffset={burnOffset}
                    strokeLinecap="round"
                    strokeWidth="10"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(79, 219, 200, 0.35))' }}
                  />
                  {/* Inner Track: Hydration / Basal Target */}
                  <circle
                    className="text-surface-container-highest"
                    cx="100"
                    cy="100"
                    fill="none"
                    opacity="0.3"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-tertiary transition-all duration-700"
                    cx="100"
                    cy="100"
                    fill="none"
                    r="52"
                    stroke="currentColor"
                    strokeDasharray="326.7"
                    strokeDashoffset={waterOffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>

                {/* Center Gauge Numbers */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest font-semibold">
                    Remaining
                  </span>
                  <span className="font-display-hero text-headline-xl text-primary font-extrabold tracking-tight">
                    {dailyTotals.remainingCalories}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface-variant">kcal left</span>
                </div>
              </div>
            </div>

            {/* Telemetry Breakdown Pills */}
            <div className="grid grid-cols-3 gap-space-xs mt-space-md pt-space-md">
              <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Consumed</span>
                <span className="font-metric-value-md text-metric-value-md text-on-surface font-bold">
                  {dailyTotals.calories.toLocaleString()}
                </span>
                <span className="font-label-sm text-label-sm text-primary block">kcal</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Burned</span>
                <span className="font-metric-value-md text-metric-value-md text-secondary font-bold">450</span>
                <span className="font-label-sm text-label-sm text-secondary block">kcal</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg text-center">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Net Intake</span>
                <span className="font-metric-value-md text-metric-value-md text-tertiary font-bold">
                  {(dailyTotals.calories - 450).toLocaleString()}
                </span>
                <span className="font-label-sm text-label-sm text-tertiary block">kcal</span>
              </div>
            </div>
          </div>

          {/* Macro Details & Distribution Grid (lg: 7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-space-md">
            {/* Top Macro Tiles (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md flex-1">
              {/* Protein Card */}
              <div className="bg-surface-container rounded-xl p-space-md shadow-lg flex flex-col justify-between hover:bg-surface-container-high transition-all">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Protein</span>
                    </div>
                    <span className="bg-primary/10 text-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      {Math.round((dailyTotals.protein / 165) * 100)}% Goal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                      {dailyTotals.protein}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ 165g</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    High priority for muscle recovery &amp; retention
                  </p>
                </div>
                <div className="mt-space-md">
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (dailyTotals.protein / 165) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mt-1.5">
                    <span>{Math.max(0, 165 - dailyTotals.protein)}g remaining</span>
                    <span className="text-primary font-medium">{dailyTotals.protein * 4} kcal</span>
                  </div>
                </div>
              </div>

              {/* Carbs Card */}
              <div className="bg-surface-container rounded-xl p-space-md shadow-lg flex flex-col justify-between hover:bg-surface-container-high transition-all">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(79,219,200,0.6)]" />
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Carbohydrates</span>
                    </div>
                    <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      {Math.round((dailyTotals.carbs / 220) * 100)}% Goal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                      {dailyTotals.carbs}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ 220g</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Glycogen replenished for evening athletic output
                  </p>
                </div>
                <div className="mt-space-md">
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-secondary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (dailyTotals.carbs / 220) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mt-1.5">
                    <span>{Math.max(0, 220 - dailyTotals.carbs)}g remaining</span>
                    <span className="text-secondary font-medium">{dailyTotals.carbs * 4} kcal</span>
                  </div>
                </div>
              </div>

              {/* Fats Card */}
              <div className="bg-surface-container rounded-xl p-space-md shadow-lg flex flex-col justify-between hover:bg-surface-container-high transition-all">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_rgba(145,219,42,0.6)]" />
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Healthy Fats</span>
                    </div>
                    <span className="bg-tertiary/10 text-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      {Math.round((dailyTotals.fats / 65) * 100)}% Goal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                      {dailyTotals.fats}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ 65g</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Optimal hormone regulation &amp; brain function
                  </p>
                </div>
                <div className="mt-space-md">
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-tertiary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (dailyTotals.fats / 65) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mt-1.5">
                    <span>{Math.max(0, 65 - dailyTotals.fats)}g remaining</span>
                    <span className="text-tertiary font-medium">{dailyTotals.fats * 9} kcal</span>
                  </div>
                </div>
              </div>

              {/* Dietary Fiber Card */}
              <div className="bg-surface-container rounded-xl p-space-md shadow-lg flex flex-col justify-between hover:bg-surface-container-high transition-all">
                <div>
                  <div className="flex items-center justify-between mb-space-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary-fixed shadow-[0_0_8px_rgba(111,251,190,0.6)]" />
                      <span className="font-title-md text-title-md text-on-surface font-semibold">Dietary Fiber</span>
                    </div>
                    <span className="bg-primary-fixed/10 text-primary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                      87% Goal
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">28</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">/ 32g</span>
                  </div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                    Gut biome health &amp; sustained glucose stability
                  </p>
                </div>
                <div className="mt-space-md">
                  <div className="w-full bg-surface-container-highest rounded-full h-2 overflow-hidden">
                    <div className="bg-primary-fixed h-2 rounded-full" style={{ width: '87.5%' }} />
                  </div>
                  <div className="flex justify-between items-center font-label-sm text-label-sm text-on-surface-variant mt-1.5">
                    <span>4g remaining</span>
                    <span className="text-primary-fixed font-medium">GI Score: 94</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated Fitness Tracker Telemetry Bar */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">watch</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-on-surface font-semibold">Apple Health &amp; Garmin</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-bold">
                      LIVE SYNC
                    </span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Updated 4 mins ago • Heart Rate Zone 2 dominant
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-lg w-full sm:w-auto justify-around sm:justify-end">
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-semibold">Steps</span>
                  <span className="font-metric-value-md text-metric-value-md text-on-surface font-bold">8,420</span>
                  <span className="font-label-sm text-label-sm text-primary block font-medium">/ 10,000</span>
                </div>
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase font-semibold">
                    Active Burn
                  </span>
                  <span className="font-metric-value-md text-metric-value-md text-secondary font-bold">450</span>
                  <span className="font-label-sm text-label-sm text-secondary block font-medium">active kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Meals Timeline & Breakdown Section */}
      <section className="w-full pb-space-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-space-md gap-space-sm">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary block font-bold">
              Nutrition Log
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Today&apos;s Meal Progression</h2>
          </div>
          <div className="flex items-center gap-space-sm flex-wrap">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1">
              {(['all', 'breakfast', 'lunch', 'snack', 'dinner'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded text-label-sm font-semibold capitalize transition-all cursor-pointer ${
                    activeCategoryFilter === cat
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentScreen('log-meals-and-ai-scanner')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-fixed transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              <span>Snap Meal</span>
            </button>
          </div>
        </div>

        {/* Meals Timeline Cards */}
        <div className="flex flex-col gap-space-md">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="bg-surface-container rounded-xl p-space-md shadow-md hover:bg-surface-container-high transition-all group relative"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                <div className="flex items-start sm:items-center gap-space-md">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-lowest">
                    {meal.image ? (
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={meal.image}
                        alt={meal.name}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[28px]">restaurant</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-sm">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded text-primary font-label-sm text-label-sm font-semibold">
                        {meal.time}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider capitalize">
                        {meal.category}
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-0.5">{meal.name}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{meal.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-space-lg w-full lg:w-auto justify-between lg:justify-end">
                  {/* Macro Pill Counters */}
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm font-semibold">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full">{meal.protein}g P</span>
                    <span className="bg-secondary/10 text-secondary px-2.5 py-1 rounded-full">{meal.carbs}g C</span>
                    <span className="bg-tertiary/10 text-tertiary px-2.5 py-1 rounded-full">{meal.fats}g F</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-metric-value-md text-metric-value-md text-on-surface font-bold">
                      {meal.calories}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">kcal</span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMealMenuOpen(mealMenuOpen === meal.id ? null : meal.id)}
                      className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                      title="Meal options"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_vert</span>
                    </button>

                    {mealMenuOpen === meal.id && (
                      <div className="absolute right-0 top-8 bg-surface-container-highest border border-white/10 rounded-lg shadow-xl py-1 z-30 w-36">
                        <button
                          type="button"
                          onClick={() => {
                            showToast(`Nutrient details: ${meal.protein}g Protein, ${meal.carbs}g Carbs, ${meal.fats}g Fats`);
                            setMealMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-body-sm hover:bg-surface-container-high transition-colors text-on-surface"
                        >
                          View Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeMeal(meal.id);
                            setMealMenuOpen(null);
                          }}
                          className="w-full text-left px-3 py-1.5 text-body-sm hover:bg-error-container text-error transition-colors"
                        >
                          Delete Entry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Meal 4: Dinner (Suggested / Upcoming) if not already logged */}
          {!dinnerLogged && (
            <div className="bg-surface-container-low rounded-xl p-space-md shadow-md border-dashed border-2 border-primary/20 relative overflow-hidden group">
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
                <div className="flex items-start sm:items-center gap-space-md">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-surface-container-highest flex items-center justify-center text-primary border border-primary/30">
                    <span className="material-symbols-outlined text-[28px]">restaurant_menu</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-sm">
                      <span className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded font-label-sm text-label-sm font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">magic_button</span> AI RECOMMENDATION
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
                        Upcoming Dinner (~7:30 PM)
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold mt-0.5">
                      Pan-Seared Atlantic Salmon, Roasted Asparagus &amp; Sweet Potato
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Calibrated automatically to fulfill your remaining 23g Protein and micro-potassium balance.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-space-md w-full lg:w-auto justify-between lg:justify-end">
                  {/* Target Remaining */}
                  <div className="flex items-center gap-space-xs font-label-sm text-label-sm">
                    <span className="bg-primary/20 text-primary px-2.5 py-1 rounded-full font-semibold">26g P</span>
                    <span className="bg-secondary/20 text-secondary px-2.5 py-1 rounded-full font-semibold">40g C</span>
                    <span className="bg-tertiary/20 text-tertiary px-2.5 py-1 rounded-full font-semibold">16g F</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-metric-value-md text-metric-value-md text-primary font-bold">~460</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">kcal target</span>
                  </div>
                  <button
                    type="button"
                    onClick={quickLogDinner}
                    className="bg-primary hover:bg-primary-fixed text-on-primary font-label-md text-label-md px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 shrink-0 font-bold cursor-pointer shadow-md"
                  >
                    <span className="material-symbols-outlined text-[16px]">check</span>
                    <span>Quick Log</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
