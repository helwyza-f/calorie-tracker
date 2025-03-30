"use client";

import { useState, useEffect } from "react";
import CircularProgress from "@/components/CircularProgress";
import MealCard from "@/components/MealCard";

const MEALS = [
  {
    title: "Breakfast",
    description: "Eggs and toast",
    calories: 85,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "Lunch",
    description: "Pasta and salad",
    calories: 500,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80",
  },
  {
    title: "Dinner",
    description: "Grilled chicken and veggies",
    calories: 700,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1470&q=80",
  },
];

export default function MealList() {
  const [totalCalories, setTotalCalories] = useState(0);
  const calorieGoal = 2000; // Target kalori harian

  useEffect(() => {
    const total = MEALS.reduce((sum, meal) => sum + meal.calories, 0);
    setTotalCalories(total);
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-4 items-center">
      {/* 🥗 Progress Section */}
      <div className="bg-gray-900 p-4 rounded-lg flex flex-col items-center gap-4 md:flex-row md:justify-between md:mx-auto md:min-w-4xl">
        {/* Circular Progress */}
        <CircularProgress percentage={(totalCalories / calorieGoal) * 100} />

        {/* Macronutrient Breakdown */}
        <div className="w-full flex justify-between text-sm text-gray-400 md:w-auto md:gap-6">
          {[
            { label: "Protein", value: "120g" },
            { label: "Fat", value: "80g" },
            { label: "Carbs", value: "250g" },
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
      {MEALS.map((meal) => (
        <MealCard key={meal.title} {...meal} />
      ))}
    </div>
  );
}
