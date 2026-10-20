export type ScreenId = 'daily-dashboard' | 'log-meals-and-ai-scanner' | 'ai-diet-coach' | 'profile-and-fitness-metrics';

export interface MealItem {
  id: string;
  name: string;
  time: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sodium?: number;
  description: string;
  image?: string;
  isAiRecommendation?: boolean;
}

export interface UserProfile {
  name: string;
  plan: string;
  weightKg: number;
  targetWeightKg: number;
  heightCm: number;
  age: number;
  bioAge: number;
  gender: 'male' | 'female';
  goal: string;
  goalVector: string;
  goalProgress: number; // percentage
  activityMultiplier: string;
  bmr: number;
  tdee: number;
  targetCalories: number;
  calorieStrategy: string;
  calorieOffset: number;
  lastDxaDate: string;
  bodyFatPercent: number;
  previousBodyFatPercent: number;
  projectedGoalDate: string;
  allergies: string[];
  intermittentFasting: boolean;
  fastingWindowStart: string;
  fastingWindowEnd: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  recipeRecommendation?: {
    title: string;
    prepTime: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: { name: string; info: string }[];
  };
  speedOption?: {
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    description: string;
  };
}

export interface FoodDatabaseItem {
  id: string;
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  category: 'Frequent' | 'Supplements' | 'Whole Foods' | 'Beverages';
  icon: string;
  colorClass: string;
}
