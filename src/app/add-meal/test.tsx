"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import PouchDB from "pouchdb";

const db = new PouchDB("meals"); // Inisialisasi IndexedDB pakai PouchDB

export default function AddMealPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [mealType, setMealType] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsOnline(navigator.onLine);
    window.addEventListener("online", syncOfflineMeals);
    window.addEventListener("offline", () => setIsOnline(false));

    return () => {
      window.removeEventListener("online", syncOfflineMeals);
      window.removeEventListener("offline", () => setIsOnline(false));
    };
  }, []);

  // Fungsi untuk upload file ke server atau simpan di IndexedDB jika offline
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.warning("Please upload an image");
    if (!mealType) return toast.warning("Please select a meal type");

    const mealData = {
      _id: new Date().toISOString(),
      description,
      mealType,
      file, // Simpan file sebagai Blob
    };

    try {
      setLoading(true);

      if (isOnline) {
        await uploadMeal(mealData);
      } else {
        await db.put(mealData);
        toast.info("Meal saved locally, will sync when online");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk upload meal ke server
  const uploadMeal = async (meal: any) => {
    const formData = new FormData();
    formData.append("file", meal.file);
    formData.append("description", meal.description);
    formData.append("mealType", meal.mealType);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      toast.success("Meal uploaded successfully");
      router.refresh();
      router.push("/");
    } else {
      toast.error("Upload failed");
    }
  };

  // Fungsi untuk mengirim meal yang disimpan di IndexedDB ketika online kembali
  const syncOfflineMeals = async () => {
    setIsOnline(true);
    const meals = await db.allDocs({ include_docs: true });

    for (const row of meals.rows) {
      try {
        await uploadMeal(row.doc);
        if (row.doc) {
          await db.remove(row.doc);
        }
      } catch (error) {
        console.error("Failed to sync meal:", error);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Add Meal</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 p-6 rounded-lg cursor-pointer hover:border-blue-400">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              className="w-full rounded-lg"
              width={300}
              height={300}
            />
          ) : (
            <>
              <Camera size={40} strokeWidth={1.5} className="text-gray-400" />
              <span className="mt-2 text-sm text-gray-400">
                Tap to take a photo or upload
              </span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              if (!e.target.files) return;
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              setPreview(URL.createObjectURL(selectedFile));
            }}
            className="hidden"
          />
        </label>

        <select
          value={mealType}
          onChange={(e) => setMealType(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg"
        >
          <option value="" disabled>
            Select meal type...
          </option>
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Dinner">Dinner</option>
          <option value="Snack">Snack</option>
        </select>

        <input
          type="text"
          placeholder="Short description..."
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition mb-20"
          disabled={loading}
        >
          {loading ? "Uploading..." : isOnline ? "Upload" : "Save Offline"}
        </button>
      </form>
    </div>
  );
}
