import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ProfileMetricsScreen: React.FC = () => {
  const { userProfile, updateUserProfile, showToast, isBleSyncing, triggerBleSync } = useApp();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedSex, setSelectedSex] = useState<'male' | 'female'>(userProfile.gender);
  const [activeAllergies, setActiveAllergies] = useState<string[]>(userProfile.allergies);
  const [fastingEnabled, setFastingEnabled] = useState(userProfile.intermittentFasting);

  // Edit modals for vital stats
  const [editingStat, setEditingStat] = useState<'weight' | 'height' | 'age' | 'macros' | null>(null);
  const [inputWeight, setInputWeight] = useState(userProfile.weightKg.toString());
  const [inputHeight, setInputHeight] = useState(userProfile.heightCm.toString());
  const [inputAge, setInputAge] = useState(userProfile.age.toString());

  // Macros split percentages (default 30P / 45C / 25F)
  const [proteinPercent, setProteinPercent] = useState(30);
  const [carbsPercent, setCarbsPercent] = useState(45);
  const [fatsPercent, setFatsPercent] = useState(25);

  const calories = userProfile.targetCalories || 2150;
  const proteinGrams = Math.round((calories * (proteinPercent / 100)) / 4);
  const carbsGrams = Math.round((calories * (carbsPercent / 100)) / 4);
  const fatsGrams = Math.round((calories * (fatsPercent / 100)) / 9);

  // Caloric Strategy presets
  const presets = [
    { label: 'Cut (-500)', offset: -500, title: 'Aggressive Fat Loss (-500 kcal)' },
    { label: 'Safe Cut (-300)', offset: -300, title: 'Moderate Cut (-300 kcal)' },
    { label: 'Maintain', offset: 0, title: 'Maintain Equilibrium (0 kcal)' },
    { label: 'Bulk (+250)', offset: 250, title: 'Lean Mass Surplus (+250 kcal)' },
  ];

  const handleSelectPreset = (offset: number, title: string) => {
    const newTarget = userProfile.tdee + offset;
    updateUserProfile({
      targetCalories: newTarget,
      calorieOffset: offset,
      calorieStrategy: title,
    });
    showToast(`Strategy updated to: ${title} (${newTarget} kcal)`);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    const diff = val - userProfile.tdee;
    let label = 'Maintain Equilibrium (0 kcal)';
    if (diff < -400) label = `Aggressive Fat Loss (${diff} kcal)`;
    else if (diff < 0) label = `Moderate Cut (${diff} kcal)`;
    else if (diff > 0) label = `Lean Mass Surplus (+${diff} kcal)`;

    updateUserProfile({
      targetCalories: val,
      calorieOffset: diff,
      calorieStrategy: label,
    });
  };

  const toggleAllergy = (allergy: string) => {
    setActiveAllergies((prev) => {
      const exists = prev.includes(allergy);
      const updated = exists ? prev.filter((a) => a !== allergy) : [...prev, allergy];
      updateUserProfile({ allergies: updated });
      showToast(exists ? `Removed ${allergy} filter` : `Added ${allergy} filter to AI recommendations`);
      return updated;
    });
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Biometric Architecture saved successfully!');
    }, 700);
  };

  const saveStatModal = () => {
    if (editingStat === 'weight') {
      const w = parseFloat(inputWeight) || 74.5;
      updateUserProfile({ weightKg: w });
      showToast(`Weight updated to ${w} kg`);
    } else if (editingStat === 'height') {
      const h = parseFloat(inputHeight) || 178;
      updateUserProfile({ heightCm: h });
      showToast(`Height updated to ${h} cm`);
    } else if (editingStat === 'age') {
      const a = parseInt(inputAge) || 26;
      updateUserProfile({ age: a });
      showToast(`Age updated to ${a} yrs`);
    } else if (editingStat === 'macros') {
      showToast(`Macro distribution updated: ${proteinPercent}P / ${carbsPercent}C / ${fatsPercent}F`);
    }
    setEditingStat(null);
  };

  // BMI Calculation
  const bmi = (userProfile.weightKg / Math.pow(userProfile.heightCm / 100, 2)).toFixed(1);

  // SVG Concentric Macro Calculations
  // Radius 68 -> circ ~ 427.26
  const pCirc = 427.3;
  const pOffset = pCirc * (1 - proteinPercent / 100);

  // Radius 52 -> circ ~ 326.72
  const cCirc = 326.7;
  const cOffset = cCirc * (1 - carbsPercent / 100);

  // Radius 36 -> circ ~ 226.19
  const fCirc = 226.2;
  const fOffset = fCirc * (1 - fatsPercent / 100);

  const allergyList = ['Gluten-Free', 'Dairy-Free', 'Nut Allergy', 'Halal', 'Vegan', 'Low Sodium'];

  return (
    <div className="flex flex-col w-full pb-space-xl">
      {/* Subtle Ambient Glow Canvas Decorator */}
      <div className="relative w-full">
        <div className="absolute -top-12 right-1/4 w-96 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/2 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Command Strip: Status & Quick Sync Confirmation */}
        <div className="flex flex-wrap items-center justify-between gap-space-md py-space-md mb-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-primary font-label-sm uppercase tracking-widest mb-1 font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Biometric Engine v4.2 • Precision Tracking Active
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-bold">
              Profile &amp; Biometric Architecture
            </h1>
          </div>
          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-xl shadow-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
            <div className="flex flex-col text-left">
              <span className="font-label-sm text-on-surface-variant leading-none font-semibold">Algorithm Core</span>
              <span className="font-label-md text-on-surface font-semibold">Mifflin-St Jeor + VO₂ Hybrid</span>
            </div>
            <div className="h-6 w-px bg-surface-container-highest mx-space-xs" />
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={isSaving}
              className="flex items-center gap-space-xs bg-primary text-on-primary font-headline-sm text-label-md px-space-md py-1.5 rounded-lg hover:bg-primary-fixed hover:text-on-primary-fixed transition-all shadow-[0_0_12px_rgba(16,185,129,0.25)] font-bold cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[16px] ${isSaving ? 'animate-spin' : ''}`}>
                {isSaving ? 'refresh' : 'save'}
              </span>
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>

        {/* Section 1: User Identity & Editable Biometrics Bento Grid */}
        <div className="grid grid-cols-12 gap-space-md mb-space-lg">
          {/* Profile Hero Card (Col 4) */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-primary/10 rounded-full blur-2xl" />
            <div>
              <div className="flex items-center gap-space-md mb-space-md">
                <div className="relative">
                  <img
                    className="w-16 h-16 rounded-2xl object-cover shadow-md"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIPK3NY7uT9G4oLMUPwc3bUNs78NWUvMlL2rz_v38DA_Qf9RjLqNOFs3DeE_XzHt7tLIbF_elZymeUUZ0PB-_ZfLAwRNu3SehDaK8DUiECLN54hb-HK2Ky9ytfKN6wPVPvZ4srbhQ0k6AxZYa5hB0ktxLLRyp8H2STM3LNwu0_25WZb_uR_EGrY5mt8Y7-3hsXliZn2Oxy4UgHdK4I5pYItJX3H4wFT0VUgOherKcoX9S3gB-FgcOn"
                    alt="Alexander Vance Portrait"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-on-primary p-0.5 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{userProfile.name}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{userProfile.plan}</span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-sm mb-space-md">
                <div className="flex items-center justify-between text-on-surface-variant font-label-sm uppercase mb-1 font-semibold">
                  <span>Goal Vector</span>
                  <span className="text-secondary font-semibold">{userProfile.goalVector}</span>
                </div>
                <p className="font-title-md text-title-md text-on-surface font-semibold">{userProfile.goal}</p>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5 mt-space-sm">
                  <div
                    className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
                    style={{ width: `${userProfile.goalProgress}%` }}
                  />
                </div>
              </div>

              {/* Biological Sex Dual Segment Switch */}
              <div className="flex flex-col gap-1.5">
                <span className="font-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Biological Sex (Hormonal Baseline)
                </span>
                <div className="grid grid-cols-2 p-1 bg-surface-container-low rounded-lg gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSex('male');
                      updateUserProfile({ gender: 'male' });
                    }}
                    className={`py-1.5 rounded-md font-label-md text-label-md shadow-sm text-center font-semibold transition-all cursor-pointer ${
                      selectedSex === 'male' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSex('female');
                      updateUserProfile({ gender: 'female' });
                    }}
                    className={`py-1.5 rounded-md font-label-md text-label-md shadow-sm text-center font-semibold transition-all cursor-pointer ${
                      selectedSex === 'female' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-space-md mt-space-md flex items-center justify-between">
              <span className="font-label-sm text-on-surface-variant">Last Full DXA Scan</span>
              <span className="font-label-md text-on-surface font-semibold">{userProfile.lastDxaDate}</span>
            </div>
          </div>

          {/* Biometric Vital Stat Bricks (Col 8) */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            {/* Weight Brick */}
            <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-all">
              <div className="flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-primary">scale</span>
                  <span className="font-label-sm uppercase tracking-wider font-semibold">Current Weight</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInputWeight(userProfile.weightKg.toString());
                    setEditingStat('weight');
                  }}
                  className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div className="my-space-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                    {userProfile.weightKg}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant">kg</span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="flex items-center font-label-sm text-label-sm text-primary bg-primary/10 px-2 py-0.5 rounded-full font-bold">
                    <span className="material-symbols-outlined text-[12px] mr-0.5">trending_down</span> -2.3 kg
                  </span>
                  <span className="font-body-sm text-body-sm text-outline">from 76.8 kg</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg">
                <span className="font-label-sm text-outline font-medium">Target</span>
                <span className="font-label-md text-on-surface font-semibold">
                  {userProfile.targetWeightKg.toFixed(1)} kg (
                  {(userProfile.targetWeightKg - userProfile.weightKg).toFixed(1)} kg to go)
                </span>
              </div>
            </div>

            {/* Height Brick */}
            <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-all">
              <div className="flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-secondary">straighten</span>
                  <span className="font-label-sm uppercase tracking-wider font-semibold">Stature</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInputHeight(userProfile.heightCm.toString());
                    setEditingStat('height');
                  }}
                  className="text-on-surface-variant hover:text-secondary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div className="my-space-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                    {userProfile.heightCm}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant">cm</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">Imperial: 5 ft 10 in</span>
              </div>
              <div className="flex items-center justify-between pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg">
                <span className="font-label-sm text-outline font-medium">Calculated BMI</span>
                <span className="font-label-md text-secondary font-semibold">{bmi} kg/m² (Normal)</span>
              </div>
            </div>

            {/* Age & Longevity Brick */}
            <div className="bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col justify-between group hover:bg-surface-container-high transition-all">
              <div className="flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">hourglass_top</span>
                  <span className="font-label-sm uppercase tracking-wider font-semibold">Chronological Age</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInputAge(userProfile.age.toString());
                    setEditingStat('age');
                  }}
                  className="text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <div className="my-space-sm">
                <div className="flex items-baseline gap-1">
                  <span className="font-metric-value-lg text-metric-value-lg text-on-surface font-bold">
                    {userProfile.age}
                  </span>
                  <span className="font-title-md text-title-md text-on-surface-variant">yrs</span>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">Born: Mar 1998</span>
              </div>
              <div className="flex items-center justify-between pt-space-xs bg-surface-container-low px-space-sm py-1 rounded-lg">
                <span className="font-label-sm text-outline font-medium">Bio Age Estimate</span>
                <span className="font-label-md text-tertiary font-semibold">
                  {userProfile.bioAge} yrs (-{(userProfile.age - userProfile.bioAge).toFixed(1)})
                </span>
              </div>
            </div>

            {/* Activity Factor Selector (Wide row inside Col 8) */}
            <div className="sm:col-span-3 bg-surface-container rounded-xl p-space-md shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px]">fitness_center</span>
                </div>
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">
                      Physical Multiplier (PAL: 1.55)
                    </span>
                    <span
                      className="material-symbols-outlined text-[14px] text-primary cursor-help"
                      title="Multiplier applied to basal metabolic rate based on total weekly physical exertion"
                    >
                      info
                    </span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">Moderately Active Routine</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Heavy compound weight lifting + functional HIIT 4-5x per week
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-space-xs self-stretch sm:self-auto shrink-0">
                <select
                  value={userProfile.activityMultiplier}
                  onChange={(e) => {
                    updateUserProfile({ activityMultiplier: e.target.value });
                    showToast('Updated activity multiplier & metabolic burn projection');
                  }}
                  className="bg-surface-container-low text-on-surface font-label-md text-label-md px-space-md py-space-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="sedentary">Sedentary (Desk bound, little exercise)</option>
                  <option value="light">Lightly Active (1-3 sessions/wk)</option>
                  <option value="moderate">Moderately Active (Gym 4-5x/wk)</option>
                  <option value="very">Very Active (Intense 6-7x/wk)</option>
                  <option value="athlete">Elite Athlete / 2x daily training</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Automated Metabolic Calculations (BMR & TDEE) & Macro Planner */}
        <div className="grid grid-cols-12 gap-space-md mb-space-lg">
          {/* Metabolic Engine Panel (Col 7) */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">local_fire_department</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Metabolic Telemetry &amp; Energy Budget
                  </h2>
                </div>
                <div className="group relative">
                  <span className="material-symbols-outlined text-outline hover:text-on-surface cursor-help text-[18px]">
                    help
                  </span>
                  <div className="absolute right-0 top-6 hidden group-hover:block w-72 bg-surface-container-highest p-space-sm rounded-lg text-on-surface font-body-sm text-body-sm shadow-xl z-20">
                    Calculated via Mifflin-St Jeor formula: 10 x weight (kg) + 6.25 x height (cm) - 5 x age (y) + 5
                    (male).
                  </div>
                </div>
              </div>

              {/* BMR, TDEE, Deficit Cards */}
              <div className="grid grid-cols-3 gap-space-sm mb-space-lg">
                <div className="bg-surface-container-low rounded-xl p-space-sm">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                    Basal Rate (BMR)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-value-md text-metric-value-md text-on-surface font-bold">
                      {userProfile.bmr.toLocaleString()}
                    </span>
                    <span className="font-label-sm text-outline">kcal</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-outline block mt-0.5">Coma baseline</span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-space-sm">
                  <span className="font-label-sm text-on-surface-variant uppercase tracking-wider block mb-1 font-semibold">
                    Total Burn (TDEE)
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-value-md text-metric-value-md text-secondary font-bold">
                      {userProfile.tdee.toLocaleString()}
                    </span>
                    <span className="font-label-sm text-outline">kcal</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-secondary block mt-0.5">Maintenance level</span>
                </div>

                <div className="bg-primary/10 rounded-xl p-space-sm">
                  <span className="font-label-sm text-primary uppercase tracking-wider block mb-1 font-bold">
                    Target Intake
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-metric-value-md text-metric-value-md text-primary font-bold">
                      {userProfile.targetCalories.toLocaleString()}
                    </span>
                    <span className="font-label-sm text-primary">kcal</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-primary block mt-0.5 font-medium">
                    {userProfile.calorieOffset >= 0 ? `+${userProfile.calorieOffset}` : userProfile.calorieOffset} kcal deficit
                  </span>
                </div>
              </div>

              {/* Interactive Deficit Slider with Presets */}
              <div className="bg-surface-container-low rounded-xl p-space-md mb-space-md">
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Caloric Strategy Mode</span>
                  <span className="font-label-md text-label-md text-primary font-semibold">
                    {userProfile.calorieStrategy}
                  </span>
                </div>
                <input
                  type="range"
                  min="1650"
                  max="2750"
                  step="50"
                  value={userProfile.targetCalories}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary my-space-sm"
                />
                <div className="grid grid-cols-4 gap-space-xs mt-space-xs">
                  {presets.map((p) => {
                    const isSelected = userProfile.calorieOffset === p.offset;
                    return (
                      <button
                        key={p.offset}
                        type="button"
                        onClick={() => handleSelectPreset(p.offset, p.title)}
                        className={`py-1 px-1.5 rounded-lg text-center font-label-sm transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                            : 'bg-surface-container text-outline hover:text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* AI Coach Insight Callout */}
            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-transparent p-space-sm rounded-xl flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[20px] shrink-0">psychology</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                A 300 kcal reduction preserves approximately 94% of existing lean quadricep &amp; lats tissue while
                yielding roughly 0.38 kg weekly fat oxidation.
              </p>
            </div>
          </div>

          {/* Macro Split Visualizer & Fine-Tuner (Col 5) */}
          <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-md">
                <div>
                  <span className="font-label-sm text-outline uppercase tracking-wider block font-semibold">
                    Nutritional Matrix
                  </span>
                  <h3 className="font-title-md text-title-md text-on-surface font-bold">Target Macro Allocation</h3>
                </div>
                <span className="font-label-md text-label-md bg-surface-container-low px-space-sm py-0.5 rounded-full text-secondary font-semibold">
                  High Protein Active
                </span>
              </div>

              {/* Triple SVG Concentric Doughnut Rings */}
              <div className="flex items-center justify-center my-space-sm relative">
                <svg className="w-48 h-48 -rotate-90 transform" viewBox="0 0 160 160">
                  {/* Protein Track & Arc (Radius 68) */}
                  <circle
                    className="text-surface-container-highest"
                    cx="80"
                    cy="80"
                    fill="none"
                    opacity="0.4"
                    r="68"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-primary transition-all duration-500"
                    cx="80"
                    cy="80"
                    fill="none"
                    r="68"
                    stroke="currentColor"
                    strokeDasharray="427.3"
                    strokeDashoffset={pOffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />

                  {/* Carbs Track & Arc (Radius 52) */}
                  <circle
                    className="text-surface-container-highest"
                    cx="80"
                    cy="80"
                    fill="none"
                    opacity="0.4"
                    r="52"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-secondary transition-all duration-500"
                    cx="80"
                    cy="80"
                    fill="none"
                    r="52"
                    stroke="currentColor"
                    strokeDasharray="326.7"
                    strokeDashoffset={cOffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />

                  {/* Fat Track & Arc (Radius 36) */}
                  <circle
                    className="text-surface-container-highest"
                    cx="80"
                    cy="80"
                    fill="none"
                    opacity="0.4"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                  />
                  <circle
                    className="text-tertiary transition-all duration-500"
                    cx="80"
                    cy="80"
                    fill="none"
                    r="36"
                    stroke="currentColor"
                    strokeDasharray="226.2"
                    strokeDashoffset={fOffset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-metric-value-md text-metric-value-md text-on-surface font-bold">
                    {calories.toLocaleString()}
                  </span>
                  <span className="font-label-sm text-outline uppercase tracking-wider font-semibold">kcal total</span>
                </div>
              </div>

              {/* Macro Data Bars */}
              <div className="flex flex-col gap-space-xs mt-space-sm">
                {/* Protein Bar */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Protein</span>
                    <span className="font-label-sm text-outline">{proteinPercent}%</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-title-md text-title-md text-primary font-bold">{proteinGrams}g</span>
                    <span className="font-label-sm text-outline">({proteinGrams * 4} kcal)</span>
                  </div>
                </div>

                {/* Carbs Bar */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Carbohydrates</span>
                    <span className="font-label-sm text-outline">{carbsPercent}%</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-title-md text-title-md text-secondary font-bold">{carbsGrams}g</span>
                    <span className="font-label-sm text-outline">({carbsGrams * 4} kcal)</span>
                  </div>
                </div>

                {/* Fats Bar */}
                <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0" />
                    <span className="font-label-md text-label-md text-on-surface font-semibold">Healthy Fats</span>
                    <span className="font-label-sm text-outline">{fatsPercent}%</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-title-md text-title-md text-tertiary font-bold">{fatsGrams}g</span>
                    <span className="font-label-sm text-outline">({fatsGrams * 9} kcal)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-space-xs text-outline font-label-sm">
              <span>Ratio standard: 2.16g/kg Protein</span>
              <button
                type="button"
                onClick={() => setEditingStat('macros')}
                className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-semibold"
              >
                <span>Customize Grams</span>
                <span className="material-symbols-outlined text-[14px]">tune</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Weight & Body Composition Trend Chart (Interactive SVG) */}
        <div className="bg-surface-container rounded-xl p-space-lg shadow-sm mb-space-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mb-space-md">
            <div>
              <div className="flex items-center gap-space-xs text-secondary font-label-sm uppercase tracking-wider mb-0.5 font-bold">
                <span className="material-symbols-outlined text-[16px]">query_stats</span>
                Dynamic Trajectory Modeling
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                30-Day Weight &amp; DXA Fat% Path
              </h2>
            </div>

            {/* Key Metrics Highlights in Chart Header */}
            <div className="flex items-center gap-space-md flex-wrap">
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-xl">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_clock</span>
                <div>
                  <span className="font-label-sm text-outline block leading-none font-medium">Projected Goal Arrival</span>
                  <span className="font-label-md text-on-surface font-semibold">{userProfile.projectedGoalDate}</span>
                </div>
              </div>
              <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-xl">
                <span className="material-symbols-outlined text-secondary text-[20px]">pie_chart</span>
                <div>
                  <span className="font-label-sm text-outline block leading-none font-medium">Body Fat % Delta</span>
                  <span className="font-label-md text-secondary font-semibold">
                    {userProfile.bodyFatPercent}%{' '}
                    <span className="text-on-surface-variant font-normal">(was {userProfile.previousBodyFatPercent}%)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main SVG Vector Line Graph */}
          <div className="w-full h-72 relative bg-surface-container-low/50 rounded-xl p-space-sm overflow-hidden flex flex-col justify-end">
            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 900 240">
              <defs>
                <linearGradient id="chartGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="projectedGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4fdbc8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#4fdbc8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid Guides */}
              <line stroke="#2d3449" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="40" y2="40" />
              <line stroke="#2d3449" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="100" y2="100" />
              <line stroke="#2d3449" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="900" y1="160" y2="160" />
              <line stroke="#3c4a42" strokeWidth="1" x1="0" x2="900" y1="210" y2="210" />

              {/* Target Benchmark Line (71.0 kg) */}
              <line opacity="0.6" stroke="#91db2a" strokeDasharray="6 4" strokeWidth="1.5" x1="0" x2="900" y1="190" y2="190" />
              <text fill="#91db2a" fontSize="11" fontWeight="600" opacity="0.8" x="800" y="185">
                TARGET 71.0 kg
              </text>

              {/* Past 20 Days Actual Area & Path */}
              <path d="M 40 50 Q 150 65, 260 85 T 480 120 L 480 210 L 40 210 Z" fill="url(#chartGrad)" />
              <path d="M 40 50 Q 150 65, 260 85 T 480 120" stroke="#4edea3" strokeLinecap="round" strokeWidth="3" />

              {/* Projected 10-15 Days Future Line */}
              <path d="M 480 120 Q 640 155, 860 190 L 860 210 L 480 210 Z" fill="url(#projectedGrad)" />
              <path
                d="M 480 120 Q 640 155, 860 190"
                stroke="#4fdbc8"
                strokeDasharray="6 4"
                strokeLinecap="round"
                strokeWidth="2.5"
              />

              {/* Actual Key Points */}
              <circle cx="40" cy="50" fill="#0b1326" r="5" stroke="#4edea3" strokeWidth="2.5" />
              <circle cx="180" cy="72" fill="#0b1326" r="4" stroke="#4edea3" strokeWidth="2.5" />
              <circle cx="330" cy="98" fill="#0b1326" r="4" stroke="#4edea3" strokeWidth="2.5" />

              {/* Current Day Pin (Oct 24) */}
              <circle className="animate-pulse" cx="480" cy="120" fill="#4edea3" r="7" />
              <circle cx="480" cy="120" fill="#003824" r="3" />

              {/* Future Target Pin */}
              <circle cx="860" cy="190" fill="#91db2a" r="6" />
            </svg>

            {/* Current Date Floating Metric Flag */}
            <div className="absolute left-[52%] top-16 bg-surface-container-highest px-space-sm py-1 rounded-lg text-left shadow-lg pointer-events-none transform -translate-x-1/2">
              <span className="font-label-sm text-outline block leading-none font-semibold">Today (Oct 24)</span>
              <span className="font-label-md text-primary font-bold">{userProfile.weightKg} kg</span>
              <span className="font-label-sm text-secondary block">BF: {userProfile.bodyFatPercent}%</span>
            </div>

            {/* Horizontal Dates Strip */}
            <div className="flex items-center justify-between text-outline font-label-sm pt-2 px-space-xs">
              <span>Oct 4 (76.8 kg)</span>
              <span>Oct 11 (75.9 kg)</span>
              <span>Oct 18 (75.1 kg)</span>
              <span className="text-primary font-bold">Today: Oct 24 ({userProfile.weightKg} kg)</span>
              <span>Nov 2 (72.6 kg Proj)</span>
              <span className="text-tertiary font-bold">Nov 14 ({userProfile.targetWeightKg.toFixed(1)} kg Target)</span>
            </div>
          </div>
        </div>

        {/* Section 4 & 5: Dietary Preferences & Connected Biometric Devices (Two Columns) */}
        <div className="grid grid-cols-12 gap-space-md">
          {/* Section 4: Dietary Restrictions & Preferences (Col 7) */}
          <div className="col-span-12 lg:col-span-7 bg-surface-container rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-secondary text-[22px]">restaurant_menu</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Dietary Regimen &amp; Allergies
                  </h2>
                </div>
                <span className="font-label-sm text-on-surface-variant uppercase font-semibold">
                  Adaptive AI Menu Sync
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                NutriPulse AI dynamically discards suggestions containing checked allergen flags and optimizes your
                fasting feeding window.
              </p>

              {/* Filter Pills Grid */}
              <div className="flex flex-wrap gap-space-xs mb-space-md">
                {allergyList.map((allergy) => {
                  const isActive = activeAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      type="button"
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-space-md py-1.5 rounded-full font-label-md text-label-md flex items-center gap-1.5 cursor-pointer transition-all font-semibold ${
                        isActive
                          ? 'bg-primary/15 text-primary shadow-sm'
                          : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {isActive ? 'check_circle' : 'add'}
                      </span>
                      <span>{allergy}</span>
                    </button>
                  );
                })}
              </div>

              {/* Intermittent Fasting Dedicated Module */}
              <div className="bg-surface-container-low rounded-xl p-space-md">
                <div className="flex items-center justify-between mb-space-xs">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">timelapse</span>
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      Intermittent Fasting Mode
                    </span>
                  </div>
                  {/* Active Fasting Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={fastingEnabled}
                      onChange={(e) => {
                        setFastingEnabled(e.target.checked);
                        updateUserProfile({ intermittentFasting: e.target.checked });
                        showToast(e.target.checked ? 'Intermittent Fasting protocol activated' : 'Fasting mode paused');
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-primary-fixed after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-sm">
                  Standard 16:8 Protocol — Metabolic autophagy activated from 8:00 PM to 12:00 PM next day.
                </p>
                <div className="grid grid-cols-2 gap-space-sm bg-surface-container p-space-xs rounded-lg">
                  <div className="flex items-center justify-between px-space-sm py-1">
                    <span className="font-label-sm text-outline font-medium">Fast Breaks (Window Open):</span>
                    <span className="font-label-md text-secondary font-semibold">
                      {userProfile.fastingWindowStart}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-space-sm py-1">
                    <span className="font-label-sm text-outline font-medium">Last Meal (Window Close):</span>
                    <span className="font-label-md text-primary font-semibold">{userProfile.fastingWindowEnd}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-space-md flex items-center justify-between">
              <span className="font-label-sm text-outline">Allergen scanning active across barcode &amp; photo OCR</span>
              <button
                type="button"
                onClick={() => showToast('Opening Menu OCR Barcode & QR Scanner')}
                className="font-label-md text-primary flex items-center gap-1 cursor-pointer hover:underline font-semibold"
              >
                <span>Scan Menu QR</span>
                <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
              </button>
            </div>
          </div>

          {/* Section 5: Connected Fitness Devices & Sensor Health (Col 5) */}
          <div className="col-span-12 lg:col-span-5 bg-surface-container rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-space-sm">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-primary text-[22px]">devices_wearables</span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Connected Devices</h2>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Searching for nearby Bluetooth Smart sensors...')}
                  className="text-primary hover:text-primary-fixed text-label-md font-label-md flex items-center gap-1 cursor-pointer font-semibold"
                >
                  <span className="material-symbols-outlined text-[16px]">add_link</span>
                  <span>Pair New</span>
                </button>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                Continuously polling heart rate, active calorie burn, and DEXA impedance metrics.
              </p>

              {/* Device Cards List */}
              <div className="flex flex-col gap-space-xs">
                {/* Apple Health Badge */}
                <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block font-semibold">
                        Apple Health &amp; Watch Ultra
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">Active Energy &amp; Heart Rate</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary bg-primary/10 px-space-sm py-1 rounded-full font-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span>Connected</span>
                  </div>
                </div>

                {/* Garmin Connect Badge */}
                <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-secondary">
                      <span className="material-symbols-outlined text-[20px]">watch</span>
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block font-semibold">Garmin Epix Gen 2</span>
                      <span className="font-body-sm text-body-sm text-outline">VO₂ Max &amp; Sleep Stress Factor</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-space-sm py-1 rounded-full font-label-sm font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    <span>Connected</span>
                  </div>
                </div>

                {/* Smart Scale Withings */}
                <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low hover:bg-surface-container-high transition-colors">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-tertiary">
                      <span className="material-symbols-outlined text-[20px]">monitor_weight</span>
                    </div>
                    <div>
                      <span className="font-label-md text-label-md text-on-surface block font-semibold">
                        Withings Body Scan Smart Scale
                      </span>
                      <span className="font-body-sm text-body-sm text-outline">Daily Weight &amp; Segmental BF%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant bg-surface-container px-space-sm py-1 rounded-full font-label-sm font-semibold">
                    <span className="material-symbols-outlined text-[12px] text-primary">done_all</span>
                    <span>2h ago</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-space-md flex items-center justify-between">
              <span className="font-label-sm text-outline">Auto-sync cadence: Every 15 minutes</span>
              <button
                type="button"
                onClick={triggerBleSync}
                className="text-on-surface-variant hover:text-on-surface text-label-sm font-label-sm flex items-center gap-1 cursor-pointer font-semibold"
              >
                <span className={`material-symbols-outlined text-[14px] ${isBleSyncing ? 'animate-spin' : ''}`}>sync</span>
                <span>{isBleSyncing ? 'Syncing...' : 'Force Resync Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Stat Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container rounded-2xl p-space-lg w-full max-w-md border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold capitalize">
                Update {editingStat === 'macros' ? 'Target Macro Ratio' : editingStat}
              </h3>
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {editingStat === 'weight' && (
              <div className="flex flex-col gap-space-sm mb-space-md">
                <label className="font-label-md text-label-md text-on-surface-variant">Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline-sm p-space-sm rounded-lg border border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {editingStat === 'height' && (
              <div className="flex flex-col gap-space-sm mb-space-md">
                <label className="font-label-md text-label-md text-on-surface-variant">Stature Height (cm)</label>
                <input
                  type="number"
                  value={inputHeight}
                  onChange={(e) => setInputHeight(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline-sm p-space-sm rounded-lg border border-secondary/30 focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
            )}

            {editingStat === 'age' && (
              <div className="flex flex-col gap-space-sm mb-space-md">
                <label className="font-label-md text-label-md text-on-surface-variant">Chronological Age (yrs)</label>
                <input
                  type="number"
                  value={inputAge}
                  onChange={(e) => setInputAge(e.target.value)}
                  className="w-full bg-surface-container-low text-on-surface font-headline-sm p-space-sm rounded-lg border border-tertiary/30 focus:outline-none focus:ring-1 focus:ring-tertiary"
                />
              </div>
            )}

            {editingStat === 'macros' && (
              <div className="flex flex-col gap-space-md mb-space-md">
                <div>
                  <div className="flex justify-between font-label-md mb-1">
                    <span className="text-primary font-bold">Protein ({proteinPercent}%)</span>
                    <span>{proteinGrams}g</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={proteinPercent}
                    onChange={(e) => setProteinPercent(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-label-md mb-1">
                    <span className="text-secondary font-bold">Carbs ({carbsPercent}%)</span>
                    <span>{carbsGrams}g</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="65"
                    value={carbsPercent}
                    onChange={(e) => setCarbsPercent(parseInt(e.target.value))}
                    className="w-full accent-secondary"
                  />
                </div>
                <div>
                  <div className="flex justify-between font-label-md mb-1">
                    <span className="text-tertiary font-bold">Fats ({fatsPercent}%)</span>
                    <span>{fatsGrams}g</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="45"
                    value={fatsPercent}
                    onChange={(e) => setFatsPercent(parseInt(e.target.value))}
                    className="w-full accent-tertiary"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-space-sm">
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                className="px-space-md py-2 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveStatModal}
                className="px-space-md py-2 rounded-lg bg-primary text-on-primary font-bold hover:bg-primary-fixed transition-colors"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
