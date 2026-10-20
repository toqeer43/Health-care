import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FoodDatabaseItem } from '../types';

export const LogMealsScreen: React.FC = () => {
  const { addMeal, showToast, setCurrentScreen } = useApp();

  const [mealText, setMealText] = useState(
    'Grilled Chicken Caesar Salad with 1 boiled egg, shaved parmesan, garlic croutons, and 2 tbsp light dressing'
  );
  const [parsedTitle, setParsedTitle] = useState(
    'Grilled Chicken Caesar Salad with 1 boiled egg & light dressing'
  );
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [portionMultiplier, setPortionMultiplier] = useState(1.0);
  const [mealCategory, setMealCategory] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [selectedDbCategory, setSelectedDbCategory] = useState<'Frequent' | 'Supplements' | 'Whole Foods' | 'Beverages'>('Frequent');
  const [foodSearchQuery, setFoodSearchQuery] = useState('');
  const [activeBoundingBox, setActiveBoundingBox] = useState<string | null>(null);

  // Base values for 1.0x portion
  const baseMacros = {
    calories: 520,
    protein: 46,
    carbs: 18,
    fats: 28,
    fiber: 4.0,
    sodium: 640,
  };

  const currentMacros = {
    calories: Math.round(baseMacros.calories * portionMultiplier),
    protein: Math.round(baseMacros.protein * portionMultiplier),
    carbs: Math.round(baseMacros.carbs * portionMultiplier),
    fats: Math.round(baseMacros.fats * portionMultiplier),
    fiber: +(baseMacros.fiber * portionMultiplier).toFixed(1),
    sodium: Math.round(baseMacros.sodium * portionMultiplier),
  };

  const sampleFoods: FoodDatabaseItem[] = [
    {
      id: 'f-1',
      name: 'Whey Protein Isolate',
      serving: '1 scoop (30g) • 120 kcal • P:25 C:1 F:0.5',
      calories: 120,
      protein: 25,
      carbs: 1,
      fats: 0.5,
      category: 'Supplements',
      icon: 'fitness_center',
      colorClass: 'text-primary',
    },
    {
      id: 'f-2',
      name: 'Greek Yogurt 0% Plain',
      serving: '1 cup (200g) • 130 kcal • P:22 C:7 F:0',
      calories: 130,
      protein: 22,
      carbs: 7,
      fats: 0,
      category: 'Frequent',
      icon: 'egg_alt',
      colorClass: 'text-secondary',
    },
    {
      id: 'f-3',
      name: 'Boiled Large Eggs',
      serving: '2 eggs (100g) • 143 kcal • P:13 C:1 F:10',
      calories: 143,
      protein: 13,
      carbs: 1,
      fats: 10,
      category: 'Frequent',
      icon: 'egg',
      colorClass: 'text-tertiary',
    },
    {
      id: 'f-4',
      name: 'Rolled Oats (Dry)',
      serving: '0.5 cup (40g) • 150 kcal • P:5 C:27 F:3',
      calories: 150,
      protein: 5,
      carbs: 27,
      fats: 3,
      category: 'Whole Foods',
      icon: 'grain',
      colorClass: 'text-secondary-fixed',
    },
    {
      id: 'f-5',
      name: 'Fresh Hass Avocado',
      serving: '0.5 medium (100g) • 160 kcal • P:2 C:9 F:15',
      calories: 160,
      protein: 2,
      carbs: 9,
      fats: 15,
      category: 'Whole Foods',
      icon: 'nutrition',
      colorClass: 'text-tertiary-fixed',
    },
    {
      id: 'f-6',
      name: 'Cold Brew Coffee (Black)',
      serving: '12 oz (350ml) • 5 kcal • P:0 C:0 F:0',
      calories: 5,
      protein: 0,
      carbs: 0,
      fats: 0,
      category: 'Beverages',
      icon: 'local_cafe',
      colorClass: 'text-outline',
    },
    {
      id: 'f-7',
      name: 'Electrolyte Mineral Mix',
      serving: '1 packet in 500ml water • 10 kcal • Mg: 120mg Na: 500mg',
      calories: 10,
      protein: 0,
      carbs: 2,
      fats: 0,
      category: 'Supplements',
      icon: 'water_drop',
      colorClass: 'text-secondary',
    },
  ];

  const filteredFoods = sampleFoods.filter((item) => {
    const matchesCategory = selectedDbCategory === 'Frequent' ? true : item.category === selectedDbCategory;
    const matchesSearch =
      !foodSearchQuery ||
      item.name.toLowerCase().includes(foodSearchQuery.toLowerCase()) ||
      item.serving.toLowerCase().includes(foodSearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAnalyzeAI = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setParsedTitle(mealText || 'Grilled Chicken Caesar Salad with 1 boiled egg & light dressing');
      showToast('NutriVision-XL analyzed and decomposed meal macros in 0.18s');
    }, 600);
  };

  const handleConfirmLog = () => {
    setIsConfirmed(true);
    addMeal({
      name: parsedTitle,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: mealCategory,
      calories: currentMacros.calories,
      protein: currentMacros.protein,
      carbs: currentMacros.carbs,
      fats: currentMacros.fats,
      fiber: currentMacros.fiber,
      sodium: currentMacros.sodium,
      description: `${portionMultiplier}x portion: ${mealText}`,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB7_aTCNz2siszNXhyLSZky6M5g59EdYDQVTwlpmgwS-dQbO0osask6eKPYpyLlvHRPg0Gz68jsVcbxSaaQUS1WWKqcqHr9dPbUf3pfi4vV4e_tr2voBai0HpsmqxQdkCBhjhVJJqG6qxzO4WnPR85QwFmbFbeNxMF-G4GU19EpwR0Lu3gTy-xYGvUT5P8IiqcA2Jbk3YhW5u39doGWPlvzMbLtJhMq91saOFAMQtoZMPHIzyRUWUSI',
    });

    setTimeout(() => {
      setIsConfirmed(false);
      setCurrentScreen('daily-dashboard');
    }, 1200);
  };

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      showToast('Listening... Speak your meal ingredients');
      setTimeout(() => {
        setIsRecordingVoice(false);
        setMealText('Grilled Grass-Fed Ribeye Steak (200g) with Roasted Sweet Potato and Asparagus');
        showToast('Voice transcribed successfully!');
      }, 2500);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleQuickAddFood = (item: FoodDatabaseItem) => {
    addMeal({
      name: item.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: 'snack',
      calories: item.calories,
      protein: item.protein,
      carbs: item.carbs,
      fats: item.fats,
      description: item.serving,
    });
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Subtle Ambient Glow Orbs */}
      <div className="relative w-full">
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-48 right-12 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      </div>

      {/* Page Header & AI Telemetry Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pt-space-lg pb-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md uppercase tracking-wider mb-space-xs font-semibold">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Computer Vision &amp; LLM Nutrition Core v4.2</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
            Log Meals &amp; AI Scanner
          </h1>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Model: <strong className="text-on-surface font-semibold">NutriVision-XL</strong> (Lat: 180ms)
          </span>
        </div>
      </div>

      {/* Section 1: Meal Input Console */}
      <section className="bg-surface-container rounded-xl p-space-lg shadow-md mb-space-lg relative overflow-hidden">
        <div className="flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <label
              className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-space-xs font-semibold"
              htmlFor="ai-meal-input"
            >
              <span className="material-symbols-outlined text-primary text-[22px]">chat_spark</span>
              <span>Multimodal Intake Console</span>
            </label>
            <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline-block">
              Supports natural voice, ingredients list, barcodes &amp; plate imagery
            </span>
          </div>

          {/* Text Input & Voice Prompt Area */}
          <div className="relative">
            <textarea
              id="ai-meal-input"
              rows={3}
              value={mealText}
              onChange={(e) => setMealText(e.target.value)}
              placeholder="Describe what you ate or drank (e.g., '2 scrambled eggs with cheddar cheese, whole wheat toast with 1 tbsp butter, and a black coffee')..."
              className="w-full bg-surface-container-lowest text-on-surface font-body-lg text-body-lg p-space-md rounded-xl placeholder-outline focus:outline-none focus:ring-2 focus:ring-primary shadow-inner resize-none transition-all"
            />
            <div className="absolute bottom-space-sm right-space-sm flex items-center gap-space-xs">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className={`flex items-center gap-1 px-space-sm py-1.5 rounded-lg text-on-surface text-label-md font-label-md transition-all shadow-sm cursor-pointer ${
                  isRecordingVoice ? 'bg-error text-on-error animate-pulse' : 'bg-surface-container-high hover:bg-surface-bright'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${isRecordingVoice ? 'text-white' : 'text-error'}`}>
                  mic
                </span>
                <span>{isRecordingVoice ? 'Listening...' : 'Voice'}</span>
              </button>
              <button
                type="button"
                onClick={() => setMealText('')}
                title="Clear input"
                className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>

          {/* Action Bar: Fast Input Badges + Primary CTA */}
          <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
            <div className="flex flex-wrap items-center gap-space-xs">
              <button
                type="button"
                onClick={handleVoiceToggle}
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-sm py-2 rounded-full shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">mic</span>
                <span>Voice dictation</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Camera activated: Align plate inside viewfinder')}
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-sm py-2 rounded-full shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">photo_camera</span>
                <span>Scan photo / barcode</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Food image uploaded: Running object segmentation')}
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-sm py-2 rounded-full shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-tertiary">cloud_upload</span>
                <span>Upload food image</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Barcode Scanner initialized: Optical reader ready')}
                className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container-highest text-on-surface font-label-md text-label-md px-space-sm py-2 rounded-full shadow-sm transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">qr_code_scanner</span>
                <span>Barcode Scanner</span>
              </button>
            </div>
            <button
              type="button"
              onClick={handleAnalyzeAI}
              disabled={isAnalyzing}
              className="flex items-center gap-space-xs bg-primary text-on-primary font-headline-sm font-bold text-body-md px-space-lg py-2.5 rounded-lg shadow-lg hover:bg-primary-fixed hover:text-on-primary-fixed hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[20px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                {isAnalyzing ? 'refresh' : 'psychology'}
              </span>
              <span>{isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Real-time AI Analysis Result Card */}
      <section className="bg-surface-container-high rounded-xl p-space-lg shadow-xl mb-space-xl relative overflow-hidden">
        {/* Glow accent top strip */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary" />

        <div className="flex flex-col gap-space-lg">
          {/* Top row: Meal title & Confidence tag */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs mb-1">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
                  Parsed Inference
                </span>
                <span className="text-outline-variant">•</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Calculated in 0.18s</span>
              </div>
              <div className="flex items-center gap-space-sm">
                {isEditingTitle ? (
                  <input
                    type="text"
                    value={parsedTitle}
                    onChange={(e) => setParsedTitle(e.target.value)}
                    onBlur={() => setIsEditingTitle(false)}
                    autoFocus
                    className="font-headline-md text-headline-md text-on-surface bg-surface-container-low px-2 py-1 rounded border border-primary/40 focus:outline-none"
                  />
                ) : (
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">{parsedTitle}</h2>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(!isEditingTitle)}
                  title="Edit Parsed Description"
                  className="text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isEditingTitle ? 'check' : 'edit'}
                  </span>
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-space-xs flex-wrap">
              <div className="flex items-center gap-1.5 bg-primary/15 text-primary px-space-sm py-1 rounded-full shadow-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="font-label-md text-label-md">98% Confidence</span>
              </div>
              <div className="flex items-center gap-1 bg-secondary/15 text-secondary px-space-sm py-1 rounded-full shadow-sm font-semibold">
                <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                <span className="font-label-md text-label-md">Verified Bio-Profile</span>
              </div>
            </div>
          </div>

          {/* Middle row: Macro Telemetry Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
            {/* Calories */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Energy</span>
                <span className="material-symbols-outlined text-primary text-[18px]">local_fire_department</span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                  {currentMacros.calories}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">kcal</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentMacros.calories / 1800) * 100))}%` }}
                />
              </div>
            </div>

            {/* Protein */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold">Protein</span>
                <span className="font-label-sm text-label-sm bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-semibold">
                  High
                </span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-primary font-bold">
                  {currentMacros.protein}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">g</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentMacros.protein / 60) * 100))}%` }}
                />
              </div>
            </div>

            {/* Carbs */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary uppercase font-bold">Carbs</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Net 14g</span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-secondary font-bold">
                  {currentMacros.carbs}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">g</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div
                  className="bg-secondary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentMacros.carbs / 80) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fats */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-tertiary uppercase font-bold">Fats</span>
                <span className="font-label-sm text-label-sm bg-tertiary/20 text-tertiary px-1.5 py-0.5 rounded-full font-semibold">
                  Healthy
                </span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-tertiary font-bold">
                  {currentMacros.fats}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">g</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div
                  className="bg-tertiary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round((currentMacros.fats / 50) * 100))}%` }}
                />
              </div>
            </div>

            {/* Fiber */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Fiber</span>
                <span className="material-symbols-outlined text-outline text-[18px]">eco</span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                  {currentMacros.fiber}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">g</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div className="bg-outline h-1.5 rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            {/* Sodium */}
            <div className="bg-surface-container rounded-xl p-space-md flex flex-col justify-between shadow-sm hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Sodium</span>
                <span className="material-symbols-outlined text-outline text-[18px]">grain</span>
              </div>
              <div className="mt-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                  {currentMacros.sodium}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant ml-1">mg</span>
              </div>
              <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-xs">
                <div className="bg-outline h-1.5 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>

          {/* Bottom row: Controls & Submission CTA */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md pt-space-xs bg-surface-container/60 p-space-md rounded-xl">
            <div className="flex flex-wrap items-center gap-space-md">
              {/* Serving Size Dropdown */}
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">scale</span>
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="portion-multiplier">
                  Portion:
                </label>
                <select
                  id="portion-multiplier"
                  value={portionMultiplier}
                  onChange={(e) => setPortionMultiplier(parseFloat(e.target.value))}
                  className="bg-surface-container-low text-on-surface font-title-md text-body-sm px-space-sm py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value={0.5}>0.5x Half Bowl (~175g)</option>
                  <option value={1.0}>1.0x Regular Bowl (350g)</option>
                  <option value={1.5}>1.5x Large Bowl (~525g)</option>
                  <option value={2.0}>2.0x Double (~700g)</option>
                </select>
              </div>

              {/* Meal Type Selector */}
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">restaurant_menu</span>
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="meal-category">
                  Meal:
                </label>
                <select
                  id="meal-category"
                  value={mealCategory}
                  onChange={(e) => setMealCategory(e.target.value as any)}
                  className="bg-surface-container-low text-on-surface font-title-md text-body-sm px-space-sm py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary shadow-sm cursor-pointer"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack / Pre-Workout</option>
                </select>
              </div>
            </div>

            {/* Final Confirm Action */}
            <div className="flex items-center gap-space-sm justify-end">
              <button
                type="button"
                onClick={() => showToast('Draft saved to local intake storage')}
                className="px-space-md py-2.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest text-body-md font-semibold transition-all cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handleConfirmLog}
                disabled={isConfirmed}
                className="flex items-center gap-space-xs bg-primary text-on-primary font-headline-sm font-bold text-body-md px-space-lg py-2.5 rounded-lg shadow-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isConfirmed ? 'task_alt' : 'check_circle'}
                </span>
                <span>{isConfirmed ? 'Logged!' : 'Confirm & Log Meal'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Left / Right Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left Side (5 cols): Food Database & Quick Add Favorites */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">database</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Fast Food Database</h3>
              </div>
              <span className="font-label-md text-label-md text-primary font-semibold">12.8M Items</span>
            </div>

            {/* Search food bar */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={foodSearchQuery}
                onChange={(e) => setFoodSearchQuery(e.target.value)}
                placeholder="Quick find ingredient, brand or barcode..."
                className="w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm pl-10 pr-space-md py-2 rounded-lg placeholder-outline focus:outline-none focus:ring-1 focus:ring-secondary shadow-sm"
              />
            </div>

            {/* Category Chips */}
            <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
              {(['Frequent', 'Supplements', 'Whole Foods', 'Beverages'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedDbCategory(cat)}
                  className={`font-label-md text-label-md px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDbCategory === cat
                      ? 'bg-secondary-container text-on-secondary-container font-semibold shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Quick Favorites Table/List */}
            <div className="flex flex-col gap-space-xs divide-y divide-white/5">
              {filteredFoods.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 px-space-xs hover:bg-surface-container-high rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-[20px] ${item.colorClass}`}>{item.icon}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-md text-title-md text-on-surface truncate font-semibold">
                        {item.name}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{item.serving}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleQuickAddFood(item)}
                    className="shrink-0 flex items-center gap-1 bg-surface-container-low hover:bg-primary hover:text-on-primary text-primary font-label-md text-label-md px-3 py-1.5 rounded-lg shadow-sm transition-all ml-2 cursor-pointer font-bold"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    <span>Add</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Food Creation Banner */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">edit_note</span>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">Can&apos;t find a barcode?</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Create a custom macro profile or import recipe URL
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Opening custom recipe and barcode creator')}
                className="px-space-sm py-1.5 rounded-lg bg-surface-container-highest hover:bg-surface-bright text-on-surface text-label-md font-semibold transition-colors shrink-0 cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        {/* Right Side (7 cols): AI Photo Nutrition Scanner Interactive Preview */}
        <div className="lg:col-span-7 flex flex-col gap-space-md">
          <div className="bg-surface-container rounded-xl p-space-lg shadow-md flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[22px]">view_in_ar</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  AI Photo Nutrition Scanner
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md text-on-surface-variant">Live Spatial Mesh</span>
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              </div>
            </div>

            {/* Image Container with Simulated Bounding Box HUD Overlays */}
            <div className="relative w-full h-80 rounded-xl overflow-hidden shadow-inner bg-surface-container-lowest">
              <img
                className="w-full h-full object-cover opacity-85 transition-transform duration-700 hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7_aTCNz2siszNXhyLSZky6M5g59EdYDQVTwlpmgwS-dQbO0osask6eKPYpyLlvHRPg0Gz68jsVcbxSaaQUS1WWKqcqHr9dPbUf3pfi4vV4e_tr2voBai0HpsmqxQdkCBhjhVJJqG6qxzO4WnPR85QwFmbFbeNxMF-G4GU19EpwR0Lu3gTy-xYGvUT5P8IiqcA2Jbk3YhW5u39doGWPlvzMbLtJhMq91saOFAMQtoZMPHIzyRUWUSI"
                alt="Caesar Salad with Chicken and Egg Plate"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none" />

              {/* Bounding Box 1: Chicken Breast */}
              <div
                onClick={() => setActiveBoundingBox('chicken')}
                className={`absolute top-[28%] left-[22%] w-[38%] h-[34%] rounded-lg border-2 border-primary/80 bg-primary/10 backdrop-blur-[2px] p-2 flex flex-col justify-between group cursor-pointer transition-all hover:bg-primary/20 ${
                  activeBoundingBox === 'chicken' ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-primary text-on-primary font-label-sm text-label-sm px-1.5 py-0.5 rounded shadow font-bold">
                    Chicken: 180g
                  </span>
                  <span className="font-label-sm text-label-sm text-primary bg-surface-container-lowest/80 px-1 rounded font-semibold">
                    302 kcal
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm font-semibold">
                  <span>P: 42g</span>
                  <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                </div>
              </div>

              {/* Bounding Box 2: Boiled Egg */}
              <div
                onClick={() => setActiveBoundingBox('egg')}
                className={`absolute top-[32%] right-[15%] w-[22%] h-[26%] rounded-lg border-2 border-tertiary/80 bg-tertiary/10 backdrop-blur-[2px] p-2 flex flex-col justify-between group cursor-pointer transition-all hover:bg-tertiary/20 ${
                  activeBoundingBox === 'egg' ? 'ring-2 ring-tertiary ring-offset-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-tertiary text-on-tertiary font-label-sm text-label-sm px-1.5 py-0.5 rounded shadow font-bold">
                    1 Egg: 50g
                  </span>
                  <span className="font-label-sm text-label-sm text-tertiary bg-surface-container-lowest/80 px-1 rounded font-semibold">
                    72 kcal
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm font-semibold">
                  <span>P: 6g • F: 5g</span>
                  <span className="material-symbols-outlined text-[14px] text-tertiary">check_circle</span>
                </div>
              </div>

              {/* Bounding Box 3: Shaved Parmesan & Croutons */}
              <div
                onClick={() => setActiveBoundingBox('parmesan')}
                className={`absolute bottom-[24%] left-[30%] w-[32%] h-[22%] rounded-lg border-2 border-secondary/80 bg-secondary/10 backdrop-blur-[2px] p-1.5 flex flex-col justify-between group cursor-pointer transition-all hover:bg-secondary/20 ${
                  activeBoundingBox === 'parmesan' ? 'ring-2 ring-secondary ring-offset-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="bg-secondary text-on-secondary font-label-sm text-label-sm px-1.5 py-0.5 rounded shadow font-bold">
                    Parmesan: 15g
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary bg-surface-container-lowest/80 px-1 rounded font-semibold">
                    65 kcal
                  </span>
                </div>
                <div className="flex items-center justify-between text-on-surface font-label-sm text-label-sm font-semibold">
                  <span>F: 4.5g</span>
                  <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span>
                </div>
              </div>

              {/* Floating Scan HUD Controls */}
              <div className="absolute top-space-sm left-space-sm flex items-center gap-space-xs bg-surface-container-lowest/90 backdrop-blur-md px-space-sm py-1 rounded-lg">
                <span className="material-symbols-outlined text-primary text-[16px]">aspect_ratio</span>
                <span className="font-label-md text-label-md text-on-surface font-semibold">Auto-Segment: 4 Objects</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Opening live camera shutter...')}
                className="absolute bottom-space-sm right-space-sm bg-surface-container-lowest/90 hover:bg-surface-container text-on-surface font-label-md text-label-md px-space-sm py-1.5 rounded-lg backdrop-blur-md shadow-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">flip_camera_ios</span>
                <span>Retake Image</span>
              </button>
            </div>

            {/* Detected Ingredients Breakdown Chips & Weights */}
            <div className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider font-semibold">
                Detected Segmentations
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                    <span className="font-title-md text-body-md text-on-surface font-semibold">Grilled Chicken Breast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">
                      180g
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">302 kcal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                    <span className="font-title-md text-body-md text-on-surface font-semibold">Romaine Hearts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary bg-secondary/10 px-2 py-0.5 rounded font-bold">
                      80g
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">14 kcal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                    <span className="font-title-md text-body-md text-on-surface font-semibold">Hard Boiled Egg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-tertiary bg-tertiary/10 px-2 py-0.5 rounded font-bold">
                      50g
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">72 kcal</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-space-sm bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed" />
                    <span className="font-title-md text-body-md text-on-surface font-semibold">Parmesan &amp; Light Dressing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-md text-label-md text-secondary-fixed bg-secondary-fixed/10 px-2 py-0.5 rounded font-bold">
                      45g
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">132 kcal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scanner Macro Summary Pill */}
            <div className="bg-surface-container-highest/60 rounded-xl p-space-md flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <span className="material-symbols-outlined text-primary text-[24px]">donut_small</span>
                <div>
                  <span className="font-title-md text-title-md text-on-surface block font-semibold">
                    Vision Estimated Output
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Sum of 4 detected ingredients matches target
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="text-right">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block font-semibold">
                    Calculated Total
                  </span>
                  <span className="font-title-md text-headline-sm text-primary font-bold">520 kcal</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPortionMultiplier(1.0);
                    showToast('Vision detection result synced to Intake Console');
                  }}
                  className="bg-primary-container text-on-primary-container hover:bg-primary font-headline-sm font-semibold text-body-sm px-space-md py-2 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                  <span>Apply to Result</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
