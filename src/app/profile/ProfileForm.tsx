// src/app/profile/ProfileForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client"; // Import the client-side Supabase client
import { useRouter } from "next/navigation";

interface ProfileProps {
  full_name: string;
  bb: number;
  tb: number;
  calorie_goal: number;
}

export default function ProfileForm({
  profile,
  userId,
}: {
  profile: ProfileProps;
  userId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  // Calculate BMI and recommended calorie goal
  const heightMeters = profile.tb ? profile.tb / 100 : 0;
  const bmi =
    profile.bb && heightMeters
      ? (profile.bb / (heightMeters * heightMeters)).toFixed(1)
      : "-";

  let recommendedCalorieGoal = "2200";
  if (bmi !== "-") {
    const bmiValue = parseFloat(bmi);
    recommendedCalorieGoal =
      bmiValue < 18.5
        ? "2500"
        : bmiValue < 24.9
        ? "2200"
        : bmiValue < 29.9
        ? "2000"
        : "1800";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Set loading state
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const full_name = formData.get("full_name") as string;
    const bb = parseFloat(formData.get("bb") as string);
    const tb = parseFloat(formData.get("tb") as string);
    const calorie_goal = parseFloat(formData.get("calorie_goal") as string);

    // Update profile in Supabase (client-side)
    const supabase = createClient();
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ full_name, bb, tb, calorie_goal })
      .eq("id", userId);

    if (updateError) {
      setError("Failed to update profile.");
      toast.error("Failed to update profile.");
    } else {
      setSuccess(true);
      router.refresh();
      toast.success("Profile updated successfully!");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block">
        Full Name:
        <input
          type="text"
          name="full_name"
          defaultValue={profile.full_name}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={isLoading}
        />
      </label>

      <label className="block">
        Berat Badan (kg):
        <input
          type="number"
          name="bb"
          defaultValue={profile.bb}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={isLoading}
        />
      </label>

      <label className="block">
        Tinggi Badan (cm):
        <input
          type="number"
          name="tb"
          defaultValue={profile.tb}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={isLoading}
        />
      </label>

      <p className="text-gray-300 text-sm">BMI: {bmi}</p>

      <p className="text-gray-300 text-sm">
        Rekomendasi Calorie Goal: {recommendedCalorieGoal}
      </p>

      <label className="block">
        Calorie Goal (Masukkan Sendiri):
        <input
          type="number"
          name="calorie_goal"
          defaultValue={profile.calorie_goal}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={isLoading}
        />
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>

      {/* Display success or error messages */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm">Profile updated successfully!</p>
      )}
    </form>
  );
}
