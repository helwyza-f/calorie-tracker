"use client";

import { useState, useEffect } from "react";
import CircularProgress from "@/components/CircularProgress";
import MealCard from "@/components/MealCard";

// ✅ Definisikan tipe Meal sesuai database Supabase
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

export default function MealList() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [calorieGoal, setCalorieGoal] = useState(0);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch("/api/meals"); // Panggil API dari Supabase
        const data: Meal[] = await res.json(); // Parsing data sesuai tipe Meal
        setMeals(data);

        // ✅ Hitung total kalori & makronutrien dari semua makanan
        const totalCal = data.reduce(
          (sum, meal) => sum + (meal.calories || 0),
          0
        );
        const totalProt = data.reduce(
          (sum, meal) => sum + (meal.protein || 0),
          0
        );
        const totalFat = data.reduce((sum, meal) => sum + (meal.fat || 0), 0);
        const totalCarb = data.reduce(
          (sum, meal) => sum + (meal.carbs || 0),
          0
        );

        setTotalCalories(totalCal);
        setTotalProtein(totalProt);
        setTotalFat(totalFat);
        setTotalCarbs(totalCarb);

        // 🎯 Fetch Calorie Goal dari Supabase
        const resProfile = await fetch("/api/profile");
        const profileData = await resProfile.json();
        setCalorieGoal(profileData.calorie_goal || 2000); // Jika null, pakai default 2000
      } catch (error) {
        console.error("Failed to fetch meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div className="flex flex-col gap-3 mt-4 items-center">
      {/* 🥗 Progress Section */}
      <div className="bg-black p-4 rounded-lg flex flex-col items-center gap-4 md:flex-row md:justify-between md:mx-auto md:min-w-4xl">
        {/* Circular Progress */}
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
          key={meal.id} // ✅ Gunakan ID dari database
          image={meal.image_url}
          title={meal.meal_type || "Unknown"} // Jika meal_type null, default ke "Unknown"
          description={meal.description || "No description"}
          calories={meal.calories || 0}
        />
      ))}
    </div>
  );
}
