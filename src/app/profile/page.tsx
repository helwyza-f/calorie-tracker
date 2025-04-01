"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [bb, setBb] = useState("");
  const [tb, setTb] = useState("");
  const [calorieGoal, setCalorieGoal] = useState("2200");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setFullName(data.full_name);
        setBb(data.bb || "");
        setTb(data.tb || "");
        setCalorieGoal(data.calorie_goal);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setLoading(true);
    try {
      await fetch("/api/profile/update", {
        method: "POST",
        body: JSON.stringify({
          full_name: fullName,
          bb,
          tb,
          calorie_goal: calorieGoal,
        }),
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Profile updated!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <label className="block mb-2">
            Full Name:
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </label>

          <label className="block mb-2">
            Berat Badan (kg):
            <input
              type="text"
              value={bb}
              onChange={(e) => setBb(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </label>

          <label className="block mb-2">
            Tinggi Badan (cm):
            <input
              type="text"
              value={tb}
              onChange={(e) => setTb(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </label>

          <label className="block mb-2">
            Calorie Goal:
            <input
              type="text"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            />
          </label>

          <button
            onClick={updateProfile}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
}
