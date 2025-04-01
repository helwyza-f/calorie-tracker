"use client";

import CircularProgress from "@/components/CircularProgress";
import MealCard from "@/components/MealCard";

interface Meal {
  id: string;
  user_id: string;
  image_url: string;
  description: string | null;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack" | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  created_at: string;
}

interface MealListProps {
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  calorieGoal: number;
}

export default function MealList({
  meals,
  totalCalories,
  totalProtein,
  totalFat,
  totalCarbs,
  calorieGoal,
}: MealListProps) {
  return (
    <div className="flex flex-col gap-3 m-2 items-center">
      {/* 🥗 Progress Section */}
      <div className="bg-black p-4 rounded-lg flex flex-col items-center gap-4 md:flex-row md:justify-between md:mx-auto md:min-w-4xl">
        <CircularProgress percentage={(totalCalories / calorieGoal) * 100} />

        {/* Macronutrient Breakdown */}
        <div className="w-full flex justify-between text-sm text-gray-400 md:w-auto md:gap-6">
          {[
            { label: "Protein", value: `${totalProtein}g` },
            { label: "Fat", value: `${totalFat}g` },
            { label: "Carbs", value: `${totalCarbs}g` },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="font-bold text-white text-base md:text-lg">
                {item.value}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* 🔥 Total Calorie Count */}
        <div className="flex flex-col items-center">
          <p className="text-white text-lg font-bold">
            {totalCalories} kcal / {calorieGoal} kcal
          </p>
          <span className="text-xs text-gray-400 hidden md:block">
            Calorie Goal
          </span>
        </div>
      </div>

      {/* 🍽 Meal List */}
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          image={meal.image_url}
          title={meal.meal_type || "Unknown"}
          description={meal.description || "No description"}
          calories={meal.calories || 0}
        />
      ))}
    </div>
  );
}
