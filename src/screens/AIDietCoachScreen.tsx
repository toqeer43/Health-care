import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AIDietCoachScreen: React.FC = () => {
  const { userProfile, chatMessages, sendUserMessage, addMeal, logWater, showToast } = useApp();
  const [chatInput, setChatInput] = useState('');
  const [selectedDietFilter, setSelectedDietFilter] = useState('High Protein');
  const [dismissElectrolyteAlert, setDismissElectrolyteAlert] = useState(false);
  const [checkedMeals, setCheckedMeals] = useState<Record<string, boolean>>({
    breakfast: true,
    lunch: true,
    snack: false,
    dinner: false,
  });

  const dietFilters = ['High Protein', 'Low Carb', 'Mediterranean', 'Keto', 'Vegetarian'];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendUserMessage(chatInput);
    setChatInput('');
  };

  const handleAddRecipeToDinner = () => {
    addMeal({
      name: 'Lemon Garlic Pan-Seared Chicken Breast with Steamed Broccoli',
      time: '7:30 PM',
      category: 'dinner',
      calories: 255,
      protein: 35,
      carbs: 8,
      fats: 5.5,
      description: '150g skinless chicken breast, 150g steamed broccoli, 1 tsp extra virgin olive oil',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCrYxICDkvd3QS_JXOH2tdFMlGM_ueRH3Pj6pRJCAJWvg7pt2B9jsbr2RNy9SWwEaSYaK3eFh3MNmA2hGLCJcjBztli--zK8FIYk-kZjkRK4Zwg2bBbJH4s_zTLjp13oAMhH84ZOpwSF920p-nGPNU8FFQMC3tqChykmJwcmRBKnNwU3lSgKYQcAXKYqcqggzqtxtnePsdNbc885ee3NCC3WWTCwIoBc1tXv2_-VwDFh2z7okNmGAyv',
    });
  };

  const toggleMealCheck = (mealKey: string) => {
    setCheckedMeals((prev) => {
      const next = !prev[mealKey];
      showToast(next ? 'Marked meal completed in meal plan' : 'Unmarked meal');
      return { ...prev, [mealKey]: next };
    });
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Status & Biometric Banner */}
      <section className="w-full relative overflow-hidden bg-surface-container-low rounded-xl p-space-lg mb-space-lg shadow-md mt-space-sm">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute right-64 -bottom-12 w-64 h-64 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shadow-[0_0_20px_rgba(78,222,163,0.25)]">
                <span className="material-symbols-outlined text-[32px]">smart_toy</span>
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary" />
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm flex-wrap">
                <h1 className="font-headline-md text-headline-md text-on-surface font-bold">NutriPulse AI Nutritionist</h1>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Clinical Sports Nutrition v4.2
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                Real-time glycemic modulation, metabolic recovery &amp; precision macro synthesis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm bg-surface-container px-space-md py-space-sm rounded-lg shadow-sm">
            <span className="material-symbols-outlined text-secondary text-[20px]">tune</span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                Active Biometric Profile
              </span>
              <span className="font-title-md text-title-md text-on-surface font-semibold">
                {userProfile.weightKg} kg • {userProfile.heightCm} cm • Age {userProfile.age} •{' '}
                <span className="text-primary">Lean Muscle Gain (-200 kcal / High Protein)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Health Alert Strip */}
      {!dismissElectrolyteAlert && (
        <div className="w-full bg-surface-container rounded-xl p-space-md mb-space-lg flex items-start sm:items-center justify-between gap-space-md shadow-sm transition-all">
          <div className="flex items-start sm:items-center gap-space-sm min-w-0">
            <div className="p-space-xs rounded-lg bg-tertiary/10 text-tertiary flex-shrink-0 mt-0.5 sm:mt-0">
              <span className="material-symbols-outlined text-[22px]">water_drop</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-space-sm min-w-0">
              <span className="font-label-md text-label-md uppercase tracking-wider text-tertiary px-space-xs py-0.5 bg-surface-container-low rounded inline-block w-fit font-bold">
                Electrolyte Alert
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant truncate">
                You consumed 2.5L water after intense interval training. Consider 250mg Himalayan sea salt or an electrolyte blend to preserve cellular osmolarity.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-xs flex-shrink-0">
            <button
              type="button"
              onClick={() => setDismissElectrolyteAlert(true)}
              className="px-space-sm py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md transition-all cursor-pointer"
            >
              Dismiss
            </button>
            <button
              type="button"
              onClick={() => {
                logWater(0.25);
                showToast('Logged electrolyte hydration (+250ml)');
              }}
              className="px-space-sm py-1 rounded bg-tertiary text-on-tertiary font-label-md text-label-md transition-all font-semibold cursor-pointer"
            >
              Log Hydration
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Left Column: Conversational AI & Dynamic Solver (7 cols) */}
        <section className="xl:col-span-7 flex flex-col gap-space-md">
          {/* Conversation Stream Card */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">chat_bubble_outline</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Target Macro Solver</h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Session active: 19:42 EST</span>
            </div>

            <div className="flex flex-col gap-space-md">
              {chatMessages.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <div key={msg.id} className="flex items-start justify-end gap-space-sm pl-8">
                      <div className="flex flex-col items-end gap-1">
                        <div className="bg-surface-container-high text-on-surface rounded-xl rounded-tr-none p-space-md shadow-sm max-w-xl">
                          <p className="font-body-md text-body-md">{msg.text}</p>
                        </div>
                        <span className="font-label-sm text-label-sm text-outline mr-1">You • {msg.timestamp}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-on-surface font-label-md text-label-md font-bold">
                        ME
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex items-start gap-space-sm pr-4">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(78,222,163,0.3)]">
                      <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </div>
                    <div className="flex flex-col gap-space-sm max-w-2xl">
                      <div className="bg-surface-container rounded-xl rounded-tl-none p-space-md flex flex-col gap-space-md shadow-sm">
                        <p className="font-body-md text-body-md text-on-surface">{msg.text}</p>

                        {/* Primary Recommended Recipe Box */}
                        {msg.recipeRecommendation && (
                          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-md">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
                              <div>
                                <div className="flex items-center gap-space-xs">
                                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                                    Top Recommendation
                                  </span>
                                  <span className="font-label-sm text-label-sm text-outline">• {msg.recipeRecommendation.prepTime}</span>
                                </div>
                                <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 font-bold">
                                  {msg.recipeRecommendation.title}
                                </h3>
                              </div>
                              <div className="text-right">
                                <span className="font-headline-md text-headline-md text-primary font-bold">
                                  {msg.recipeRecommendation.calories} kcal
                                </span>
                                <span className="block font-label-sm text-label-sm text-on-surface-variant">
                                  Target Safe (-95 under limit)
                                </span>
                              </div>
                            </div>

                            {/* Macro Ratio Badges */}
                            <div className="grid grid-cols-3 gap-space-xs">
                              <div className="bg-surface-container rounded-lg p-space-xs text-center">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block">Protein</span>
                                <span className="font-title-md text-title-md text-primary font-bold">
                                  {msg.recipeRecommendation.protein}g (+9g surplus)
                                </span>
                              </div>
                              <div className="bg-surface-container rounded-lg p-space-xs text-center">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block">Carbs</span>
                                <span className="font-title-md text-title-md text-secondary font-bold">
                                  {msg.recipeRecommendation.carbs}g net
                                </span>
                              </div>
                              <div className="bg-surface-container rounded-lg p-space-xs text-center">
                                <span className="font-label-sm text-label-sm text-on-surface-variant block">Fats</span>
                                <span className="font-title-md text-title-md text-tertiary font-bold">
                                  {msg.recipeRecommendation.fats}g
                                </span>
                              </div>
                            </div>

                            {/* Ingredients Breakdown */}
                            <div className="flex flex-col gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
                              {msg.recipeRecommendation.ingredients.map((ing, i) => (
                                <div key={i} className="flex items-center justify-between bg-surface-container/50 px-space-sm py-1 rounded">
                                  <span className="text-on-surface">{ing.name}</span>
                                  <span className="font-label-md text-label-md text-primary font-semibold">{ing.info}</span>
                                </div>
                              ))}
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
                              <button
                                type="button"
                                onClick={handleAddRecipeToDinner}
                                className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-headline-sm font-semibold text-body-md hover:bg-primary-fixed transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">restaurant</span>
                                <span>Add Recipe to Dinner Log</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => showToast('Recipe saved to your personal Recipe Box')}
                                className="flex items-center gap-1.5 px-space-md py-space-xs rounded-lg bg-surface-container-high text-on-surface font-headline-sm font-semibold text-body-md hover:bg-surface-bright transition-all cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
                                <span>Save to Saved Meals</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Fast Alternative Option */}
                        {msg.speedOption && (
                          <div className="bg-surface-container-high/60 rounded-xl p-space-md flex flex-col gap-space-xs">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-space-xs">
                                <span className="material-symbols-outlined text-secondary text-[18px]">bolt</span>
                                <span className="font-title-md text-title-md text-on-surface font-semibold">
                                  {msg.speedOption.title}
                                </span>
                              </div>
                              <span className="font-headline-sm text-headline-sm text-secondary font-bold">
                                {msg.speedOption.calories} kcal
                              </span>
                            </div>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {msg.speedOption.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <span className="font-label-sm text-label-sm text-outline ml-1">
                        AI Coach • Continuous Biometric Inference
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input Field & Suggestions */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              {/* Fast Prompts Chips */}
              <div className="flex items-center gap-space-xs overflow-x-auto pb-1 no-scrollbar">
                <span className="font-label-sm text-label-sm text-outline whitespace-nowrap font-semibold">Suggested:</span>
                <button
                  type="button"
                  onClick={() => sendUserMessage('Post-workout recovery snacks?')}
                  className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-body-sm text-body-sm whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">fitness_center</span> Post-workout recovery snacks?
                </button>
                <button
                  type="button"
                  onClick={() => sendUserMessage('Curb late-night sugar cravings')}
                  className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-body-sm text-body-sm whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">nightlight</span> Curb late-night sugar cravings
                </button>
                <button
                  type="button"
                  onClick={() => sendUserMessage('Adjust macros for rest day')}
                  className="px-space-sm py-1 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-container-high font-body-sm text-body-sm whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">sync_alt</span> Adjust macros for rest day
                </button>
              </div>

              {/* Input bar */}
              <form onSubmit={handleSendMessage} className="flex items-center gap-space-xs bg-surface-container rounded-xl p-space-xs shadow-inner">
                <div className="flex items-center justify-center p-space-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px]">mic</span>
                </div>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your AI nutritionist anything (e.g. swap ingredients, dining out guidance)..."
                  className="flex-1 bg-transparent text-on-surface font-body-md text-body-md placeholder-outline focus:outline-none px-space-xs"
                />
                <button
                  type="submit"
                  className="px-space-md py-space-xs rounded-lg bg-primary text-on-primary font-headline-sm font-semibold text-body-md hover:bg-primary-fixed transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>Send</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </div>
          </div>

          {/* Macro Deficit Progress & Glycemic Stability Visual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {/* SVG Ring Progress Card */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex items-center gap-space-md shadow-sm">
              <div className="relative w-24 h-24 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container-highest"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  {/* Carbs Ring 78% */}
                  <circle
                    className="text-secondary transition-all duration-700"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="55"
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                  {/* Protein Ring 84% */}
                  <circle
                    className="text-primary transition-all duration-700"
                    cx="50"
                    cy="50"
                    fill="none"
                    r="30"
                    stroke="currentColor"
                    strokeDasharray="188.4"
                    strokeDashoffset="30"
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-label-sm text-label-sm text-outline">Target</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface leading-none font-bold">88%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">
                  Macro Allocation
                </span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">Target Met Post-Dinner</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Executing the recommended dinner brings your daily protein synthesis stimulus to 160g total (100.8% of daily target).
                </p>
              </div>
            </div>

            {/* Metabolic Velocity Card */}
            <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">
                  Metabolic Velocity
                </span>
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-label-sm text-label-sm font-semibold">
                  High Sensitivity
                </span>
              </div>
              <div className="flex items-baseline gap-space-xs my-space-xs">
                <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">94</span>
                <span className="font-body-sm text-body-sm text-outline">/ 100 Stability Score</span>
              </div>
              {/* Sparkline SVG */}
              <div className="w-full h-8">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 32">
                  <path
                    className="text-primary"
                    d="M0 24 Q 25 10, 50 16 T 100 8 T 150 14 T 200 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  />
                  <path
                    className="text-primary/10"
                    d="M0 24 Q 25 10, 50 16 T 100 8 T 150 14 T 200 6 L 200 32 L 0 32 Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Glucose curve dampened: No evening energy crashes forecasted.
              </span>
            </div>
          </div>
        </section>

        {/* Right Column: Smart Meal Plans & Dietary Telemetry (5 cols) */}
        <section className="xl:col-span-5 flex flex-col gap-space-md">
          {/* Weekly Smart Meal Plan Section */}
          <div className="bg-surface-container-low rounded-xl p-space-lg flex flex-col gap-space-md shadow-md">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px]">calendar_view_week</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Weekly AI Meal Plan</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold">
                  Day 4 of 7
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Engineered around 2,200 kcal baseline with timed nutrient partitions for morning hypertrophy workouts.
              </p>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {dietFilters.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedDietFilter(tab)}
                  className={`px-space-sm py-1 rounded-full font-label-md text-label-md whitespace-nowrap transition-colors cursor-pointer ${
                    selectedDietFilter === tab
                      ? 'bg-primary text-on-primary font-semibold'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Meal Schedule Cards Stack */}
            <div className="flex flex-col gap-space-sm">
              {/* Breakfast */}
              <div className="bg-surface-container rounded-xl p-space-sm flex gap-space-sm items-center hover:bg-surface-container-high transition-colors group">
                <img
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRXwS6b7vS2EjdCOZ-FmNBkMOao0KZtY4TrtxRRiJDb-82rHWfLyE9oszn1xukjVzlFGaXcx6g_aRKYdyHAjQ92Q-aPQM_2cGyuJ46I3oKpIhBuSajkit31ihxz8asZh-nv5aJlkC3SgFRbjfR4M_36AA4ObrGSMMcbEjLYyNuRTlojb_phn-UpSvmbBqe2HPcNLV_koo7Tyw1DjKwNzR4pZynzMXgpRiHfgLFs6bO7Gq0VBNxifV1"
                  alt="Overnight Oats"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                      Breakfast • 07:30
                    </span>
                    <span className="font-label-md text-label-md text-primary font-semibold">510 kcal</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                    Overnight Whey Oats &amp; Wild Blueberries
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    42g Protein • 58g Carbs • 11g Fats
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMealCheck('breakfast')}
                  className={`p-space-xs rounded-full cursor-pointer transition-colors ${
                    checkedMeals.breakfast ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </button>
              </div>

              {/* Lunch */}
              <div className="bg-surface-container rounded-xl p-space-sm flex gap-space-sm items-center hover:bg-surface-container-high transition-colors group">
                <img
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx_bBrKbOlC7w9NYO2cjeRdYHCtJsJQIuM-T5Kc159cu71xtdvVqoMrDts9GJNCjur2IK4RCxha3Tag47zcf0L9BIOriSYdqxJ4kjFN8how5gDJKicZZP6Mz7BAPLTBVVRLLqKSOai7YA108Zk3FcICrVv_GX9JozBLnixjhYXMaA0dZS84bmJym4M9TqQGtCIAh2hpcBxKvk4jykl7freb-oX02MOb0Oz_gw3FiH7BUKqzKL26_7b"
                  alt="Seared Salmon Quinoa Bowl"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                      Lunch • 12:45
                    </span>
                    <span className="font-label-md text-label-md text-secondary font-semibold">620 kcal</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                    Seared Salmon Quinoa Power Bowl
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    48g Protein • 52g Carbs • 22g Fats
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMealCheck('lunch')}
                  className={`p-space-xs rounded-full cursor-pointer transition-colors ${
                    checkedMeals.lunch ? 'text-secondary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </button>
              </div>

              {/* Snack */}
              <div className="bg-surface-container rounded-xl p-space-sm flex gap-space-sm items-center hover:bg-surface-container-high transition-colors group">
                <div className="w-16 h-16 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-secondary">
                  <span className="material-symbols-outlined text-[28px]">cookie</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
                      Mid-Day Fuel • 16:00
                    </span>
                    <span className="font-label-md text-label-md text-tertiary font-semibold">220 kcal</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface truncate group-hover:text-primary transition-colors font-semibold">
                    Matcha Isolate Protein Shake &amp; Walnuts
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    25g Protein • 6g Carbs • 10g Fats
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMealCheck('snack')}
                  className={`p-space-xs rounded-full cursor-pointer transition-colors ${
                    checkedMeals.snack ? 'text-tertiary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </button>
              </div>

              {/* Dinner (Highlighted as Current Recommendation) */}
              <div className="bg-surface-container-high rounded-xl p-space-sm flex gap-space-sm items-center shadow-sm">
                <img
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrYxICDkvd3QS_JXOH2tdFMlGM_ueRH3Pj6pRJCAJWvg7pt2B9jsbr2RNy9SWwEaSYaK3eFh3MNmA2hGLCJcjBztli--zK8FIYk-kZjkRK4Zwg2bBbJH4s_zTLjp13oAMhH84ZOpwSF920p-nGPNU8FFQMC3tqChykmJwcmRBKnNwU3lSgKYQcAXKYqcqggzqtxtnePsdNbc885ee3NCC3WWTCwIoBc1tXv2_-VwDFh2z7okNmGAyv"
                  alt="Lemon Garlic Chicken & Broccoli"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-semibold">
                      Dinner • Up Next
                    </span>
                    <span className="font-label-md text-label-md text-primary font-semibold">255 kcal</span>
                  </div>
                  <h4 className="font-title-md text-title-md text-on-surface truncate font-semibold">
                    Lemon Garlic Chicken &amp; Broccoli
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    35g Protein • 8g Carbs • 5.5g Fats
                  </p>
                </div>
                <span className="material-symbols-outlined text-primary text-[20px] p-space-xs">schedule</span>
              </div>
            </div>

            <div className="pt-space-xs flex items-center justify-between">
              <button
                type="button"
                onClick={() => showToast('Tomorrow’s meal plan regenerated based on projected recovery velocity')}
                className="text-primary hover:text-primary-fixed font-headline-sm font-semibold text-body-md flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Regenerate Tomorrow&apos;s Plan</span>
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Exported 14 grocery items to Notes / Reminders')}
                className="text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors cursor-pointer"
              >
                Export Grocery List (14 items)
              </button>
            </div>
          </div>

          {/* Micro-Nutrient Bio-Tracker Quick Card */}
          <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md uppercase tracking-wider text-outline font-semibold">
                Micronutrient Compliance
              </span>
              <span className="font-label-sm text-label-sm text-primary font-semibold">Optimal Profile</span>
            </div>
            <div className="space-y-space-xs">
              {/* Zinc */}
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface">Zinc &amp; Magnesium (ZMA)</span>
                <span className="text-on-surface-variant font-label-md text-label-md font-semibold">100% of DRI</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-1.5 rounded-full w-full" />
              </div>

              {/* Omega-3 */}
              <div className="flex items-center justify-between font-body-sm text-body-sm pt-1">
                <span className="text-on-surface">Omega-3 EPA/DHA Ratio</span>
                <span className="text-on-surface-variant font-label-md text-label-md font-semibold">88% of DRI</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-secondary h-1.5 rounded-full w-[88%]" />
              </div>

              {/* Sodium/Potassium Balance */}
              <div className="flex items-center justify-between font-body-sm text-body-sm pt-1">
                <span className="text-on-surface">Sodium / Potassium Balance</span>
                <span className="text-tertiary font-label-md text-label-md font-semibold">Replenish Recommended</span>
              </div>
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-tertiary h-1.5 rounded-full w-[62%]" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
