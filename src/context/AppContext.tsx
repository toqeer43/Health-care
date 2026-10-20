import React, { createContext, useContext, useState, useMemo } from 'react';
import { ScreenId, MealItem, UserProfile, ChatMessage } from '../types';

interface AppContextType {
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  loggedMeals: MealItem[];
  addMeal: (meal: Omit<MealItem, 'id'>) => void;
  removeMeal: (id: string) => void;
  quickLogDinner: () => void;
  dinnerLogged: boolean;
  waterLitres: number;
  targetWater: number;
  logWater: (amount: number) => void;
  chatMessages: ChatMessage[];
  sendUserMessage: (text: string) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isBleSyncing: boolean;
  triggerBleSync: () => void;
  lastBleSync: string;
  dailyTotals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    burnedCalories: number;
    remainingCalories: number;
    caloriePercentage: number;
  };
}

const defaultProfile: UserProfile = {
  name: 'Alexander Vance',
  plan: 'Optimal Metabolic State • Pro Plan',
  weightKg: 74.5,
  targetWeightKg: 71.0,
  heightCm: 178,
  age: 26,
  bioAge: 23.8,
  gender: 'male',
  goal: 'Fat Loss & Lean Muscle Retention',
  goalVector: 'Stage 2 / Cut',
  goalProgress: 68,
  activityMultiplier: 'moderate',
  bmr: 1745,
  tdee: 2450,
  targetCalories: 2150,
  calorieStrategy: 'Moderate Cut (-300 kcal)',
  calorieOffset: -300,
  lastDxaDate: '18 Oct 2024 • 16.8% BF',
  bodyFatPercent: 16.8,
  previousBodyFatPercent: 18.2,
  projectedGoalDate: 'November 14, 2024',
  allergies: ['Gluten-Free', 'Dairy-Free', 'Low Sodium'],
  intermittentFasting: true,
  fastingWindowStart: '12:00 PM',
  fastingWindowEnd: '8:00 PM',
};

const initialMeals: MealItem[] = [
  {
    id: 'meal-1',
    name: 'Oatmeal with Blueberries, Greek Yogurt & Chia',
    time: '8:30 AM',
    category: 'breakfast',
    calories: 480,
    protein: 32,
    carbs: 65,
    fats: 10,
    fiber: 9.0,
    sodium: 120,
    description: 'Rolled oats, 150g non-fat Greek yogurt, 10g organic chia seeds, wildflower honey drizzle',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBodH0AycmWhNp-2LYOoLcWm0GNnOL1zOyHtHC-sVX5sUGpRVOEpsc_wjldbTTspchTGbUA3Vwma7PShnbkPFrgGHY-lwU1SvdNEZzXK1VGdDCe7aKtN_-hK32X__MoV7N4Ur1e9KTxZYRIvO5W-_AAdk2x23pakAwr71bHtho2-AjD9XXQmkuY3l8YvDHDqUklIQ8EnREmTrJECxOVLM5SAJL1K0a4p9z3UBBB3bRVcz2MLmreWOxF',
  },
  {
    id: 'meal-2',
    name: 'Grilled Lemon Herb Chicken Bowl with Quinoa & Avocado',
    time: '1:15 PM',
    category: 'lunch',
    calories: 680,
    protein: 54,
    carbs: 55,
    fats: 22,
    fiber: 11.0,
    sodium: 480,
    description: '200g Free-range chicken breast, cooked red quinoa, 50g avocado, extra virgin olive oil',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXQLHBmLvzbNf8Xc-DosJiJV9GfihX-LE_yCVQ8lw5r3FBZN96SAyQWBUv7PWNroVkM9xL7wN5Wj0AtipahAnMh3SP2ndMMB5S6vhobZ_dbQF9JlIl1Soow8ro3F-Ye5d91Rz_ZMKpuZIjc54c7pKdHxz6AfHcg_iteS8AQOo72wcyRty7xM88zgmzcZkVraixFu6tMzXQGpVtQsCMyGsZz0PCioed-OdAivQe-m4mVmTk3frMTxIS',
  },
  {
    id: 'meal-3',
    name: 'Whey Isolate Shake with Unsweetened Almond Milk & Apple',
    time: '4:30 PM',
    category: 'snack',
    calories: 260,
    protein: 30,
    carbs: 22,
    fats: 4,
    fiber: 4.5,
    sodium: 140,
    description: '1 scoop Grass-fed vanilla whey, 300ml almond milk, 1 medium crisp green apple',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiNJtA7ucqwk8LSkpjAEk2JGU7grtgNmrK4jmGhBWz7nWhXhuBz-SOzV2Khbp3ySNr1R9NvhKQOFlGcNqkQDmtI6EdEfoc9kIqyO07JUKJuK4OnJLlB1czdGZ--AfxhyC8ThXHp4S6JuAGzMvgk7t9_BlwS7rr36ttLU3DwcCm_6HQTGJmE0sLNqg6BhkH0ex61px-S0calmYwCCRqzOHiB9mxWQRKhdkzQP_M1-RFXzBuAlSQeL09',
  },
];

const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'user',
    text: "I'm still 26g of protein short of my goal today, but I only have 350 calories left for dinner. What should I cook with chicken breast, eggs, or cottage cheese?",
    timestamp: 'Just now',
  },
  {
    id: 'msg-2',
    sender: 'coach',
    text: 'I reviewed your remaining pool. You have prime headroom: we can easily crush that 26g deficit while retaining a safe caloric buffer below your 350 kcal ceiling. Here is your optimal dinner execution:',
    timestamp: 'Just now',
    recipeRecommendation: {
      title: 'Lemon Garlic Pan-Seared Chicken Breast with Steamed Broccoli',
      prepTime: '12 Min Prep',
      calories: 255,
      protein: 35,
      carbs: 8,
      fats: 5.5,
      ingredients: [
        { name: '150g Raw Skinless Chicken Breast', info: '165 kcal • 31g P' },
        { name: '150g Steamed Fresh Broccoli Florets', info: '50 kcal • 4g P • 4g Fiber' },
        { name: '1 tsp Extra Virgin Olive Oil (or Olive Oil Spray)', info: '40 kcal • 4.5g Healthy Fats' },
      ],
    },
    speedOption: {
      title: 'Speed Option (Zero Cooking Required)',
      calories: 210,
      protein: 28,
      carbs: 6,
      fats: 5,
      description: 'Low-Fat Cottage Cheese Whip: 200g 1% cottage cheese sprinkled with 7g crushed almonds and ground cinnamon. Yields 28g Protein, 6g Carbs, 5g Fat.',
    },
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('daily-dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultProfile);
  const [loggedMeals, setLoggedMeals] = useState<MealItem[]>(initialMeals);
  const [dinnerLogged, setDinnerLogged] = useState(false);
  const [waterLitres, setWaterLitres] = useState(2.25);
  const targetWater = 3.0;
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isBleSyncing, setIsBleSyncing] = useState(false);
  const [lastBleSync, setLastBleSync] = useState('Continuous BLE');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const next = { ...prev, ...updates };
      // Recalculate BMR if weight, height, age, or gender change
      if (updates.weightKg || updates.heightCm || updates.age || updates.gender) {
        const s = next.gender === 'male' ? 5 : -161;
        next.bmr = Math.round(10 * next.weightKg + 6.25 * next.heightCm - 5 * next.age + s);
        const multipliers: Record<string, number> = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          very: 1.725,
          athlete: 1.9,
        };
        const pal = multipliers[next.activityMultiplier] || 1.55;
        next.tdee = Math.round(next.bmr * pal);
        next.targetCalories = next.tdee + next.calorieOffset;
      }
      return next;
    });
  };

  const addMeal = (mealData: Omit<MealItem, 'id'>) => {
    const newMeal: MealItem = {
      ...mealData,
      id: `meal-${Date.now()}`,
    };
    setLoggedMeals((prev) => [...prev, newMeal]);
    showToast(`Logged "${newMeal.name}" (+${newMeal.calories} kcal)`);
  };

  const removeMeal = (id: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== id));
    showToast('Meal removed from daily log');
  };

  const quickLogDinner = () => {
    if (dinnerLogged) {
      showToast('Upcoming dinner has already been logged!');
      return;
    }
    const dinnerMeal: MealItem = {
      id: `meal-${Date.now()}`,
      name: 'Pan-Seared Atlantic Salmon, Roasted Asparagus & Sweet Potato',
      time: '7:30 PM',
      category: 'dinner',
      calories: 460,
      protein: 26,
      carbs: 40,
      fats: 16,
      fiber: 6.0,
      sodium: 380,
      description: 'Calibrated automatically to fulfill your remaining 23g Protein and micro-potassium balance.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDx_bBrKbOlC7w9NYO2cjeRdYHCtJsJQIuM-T5Kc159cu71xtdvVqoMrDts9GJNCjur2IK4RCxha3Tag47zcf0L9BIOriSYdqxJ4kjFN8how5gDJKicZZP6Mz7BAPLTBVVRLLqKSOai7YA108Zk3FcICrVv_GX9JozBLnixjhYXMaA0dZS84bmJym4M9TqQGtCIAh2hpcBxKvk4jykl7freb-oX02MOb0Oz_gw3FiH7BUKqzKL26_7b',
      isAiRecommendation: true,
    };
    setLoggedMeals((prev) => [...prev, dinnerMeal]);
    setDinnerLogged(true);
    showToast('AI Recommended Dinner successfully logged!');
  };

  const logWater = (amount: number) => {
    setWaterLitres((prev) => {
      const updated = Math.min(targetWater, +(prev + amount).toFixed(2));
      showToast(`+${amount * 1000}ml logged. Total: ${updated}L / ${targetWater}L`);
      return updated;
    });
  };

  const triggerBleSync = () => {
    setIsBleSyncing(true);
    setTimeout(() => {
      setIsBleSyncing(false);
      setLastBleSync('Synced just now');
      showToast('Apple Watch & Garmin biometric telemetry synchronized!');
    }, 1200);
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let coachReply: ChatMessage;
      const lower = text.toLowerCase();

      if (lower.includes('post-workout') || lower.includes('snack') || lower.includes('recovery')) {
        coachReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: 'For post-workout glycogen replenishment and MPS (Muscle Protein Synthesis), target a 2:1 carbohydrate-to-protein ratio within 45 minutes.',
          timestamp: 'Just now',
          recipeRecommendation: {
            title: 'Tart Cherry Whey Recovery Bowl',
            prepTime: '5 Min Prep',
            calories: 280,
            protein: 30,
            carbs: 32,
            fats: 3,
            ingredients: [
              { name: '1 scoop Whey Isolate Vanilla', info: '120 kcal • 25g P' },
              { name: '100g Frozen Tart Cherries', info: '60 kcal • Reduces DOMS' },
              { name: '1/2 sliced banana + coconut water', info: '100 kcal • 22g Carbs' },
            ],
          },
        };
      } else if (lower.includes('sugar') || lower.includes('craving') || lower.includes('night')) {
        coachReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: 'Late evening sugar cravings are often caused by a dopamine dip or electrolyte drop. Try casein protein or high-tryptophan snacks with magnesium to induce deep slow-wave sleep.',
          timestamp: 'Just now',
          speedOption: {
            title: 'Warm Cinnamon Vanilla Micellar Casein',
            calories: 140,
            protein: 26,
            carbs: 3,
            fats: 1.5,
            description: 'Slow-digesting protein prevents midnight muscle catabolism while calming cortisol release.',
          },
        };
      } else if (lower.includes('rest day') || lower.includes('adjust')) {
        coachReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: 'On non-training days, we taper active carbs by 25% (down to 140g) and elevate anti-inflammatory omega-3 and avocado fats to promote tendon and joint collagen synthesis.',
          timestamp: 'Just now',
        };
      } else {
        coachReply = {
          id: `msg-${Date.now() + 1}`,
          sender: 'coach',
          text: `Based on your current bio-profile (74.5 kg, 16.8% body fat, 2,150 kcal cut target), I've analyzed your request: "${text}". Maintain your 2.16g/kg protein threshold while keeping glycemic load moderate.`,
          timestamp: 'Just now',
          recipeRecommendation: {
            title: 'High-Bioavailability Micro-Plate',
            prepTime: '10 Min',
            calories: 310,
            protein: 34,
            carbs: 12,
            fats: 8,
            ingredients: [
              { name: '160g Wild Alaskan Cod or Chicken Breast', info: '140 kcal • 30g P' },
              { name: 'Sautéed Asparagus & Baby Spinach', info: '45 kcal • Potassium & Folate' },
              { name: 'Cold-pressed extra virgin olive oil', info: '85 kcal • Polyphenols' },
            ],
          },
        };
      }

      setChatMessages((prev) => [...prev, coachReply]);
    }, 700);
  };

  const dailyTotals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;

    loggedMeals.forEach((m) => {
      calories += m.calories;
      protein += m.protein;
      carbs += m.carbs;
      fats += m.fats;
    });

    const burnedCalories = 450;
    const target = userProfile.targetCalories || 2150;
    const remainingCalories = Math.max(0, target - calories);
    const caloriePercentage = Math.min(100, Math.round((calories / target) * 100));

    return {
      calories,
      protein,
      carbs,
      fats,
      burnedCalories,
      remainingCalories,
      caloriePercentage,
    };
  }, [loggedMeals, userProfile.targetCalories]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        userProfile,
        updateUserProfile,
        loggedMeals,
        addMeal,
        removeMeal,
        quickLogDinner,
        dinnerLogged,
        waterLitres,
        targetWater,
        logWater,
        chatMessages,
        sendUserMessage,
        toastMessage,
        showToast,
        searchQuery,
        setSearchQuery,
        isBleSyncing,
        triggerBleSync,
        lastBleSync,
        dailyTotals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
