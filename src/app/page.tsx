import MealList from "@/components/MealList";
import { signOutAction } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");

  const now = new Date();

  // Get today's date in UTC (removing time)
  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
    .toISOString()
    .split("T")[0];

  const { data: meals, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user.id)
    .gte("created_at", `${todayUTC}T00:00:00.000Z`)
    .lte("created_at", `${todayUTC}T23:59:59.999Z`);

  if (error) console.error("Error fetching meals:", error);

  // Fetch user calorie goal
  const { data: profile } = await supabase
    .from("profiles")
    .select("calorie_goal,full_name")
    .eq("id", user.id)
    .single();

  const calorieGoal = profile?.calorie_goal || 2000;

  // Hitung total nutrisi
  const totalCalories =
    meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) || 0;
  const totalProtein =
    meals?.reduce((sum, meal) => sum + (meal.protein || 0), 0) || 0;
  const totalFat = meals?.reduce((sum, meal) => sum + (meal.fat || 0), 0) || 0;
  const totalCarbs =
    meals?.reduce((sum, meal) => sum + (meal.carbs || 0), 0) || 0;

  return (
    <div className="flex flex-col pb-40 md:items-center">
      <div className="p-4">
        <h1 className="text-xl font-bold md:text-2xl">
          Hi, {profile?.full_name}
        </h1>
      </div>
      <div className="fixed bottom-24 right-5 bg-white rounded-full xl:bottom-14 xl:right-24">
        <Link href="/add-meal" className="text-blue-500 hover:text-blue-400">
          <PlusCircle size={44} strokeWidth={1.5} />
        </Link>
      </div>

      {/* Kirim data hasil fetch ke MealList */}
      <MealList
        meals={meals || []}
        totalCalories={totalCalories}
        totalProtein={totalProtein}
        totalFat={totalFat}
        totalCarbs={totalCarbs}
        calorieGoal={calorieGoal}
      />
    </div>
  );
}
