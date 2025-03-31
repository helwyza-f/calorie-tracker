"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { toast } from "sonner";

export default function AddMealPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // ✅ Preview image
  const [description, setDescription] = useState("");
  const [mealType, setMealType] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.warning("Please upload an image");
    if (!mealType) return toast.warning("Please select a meal type");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("description", description);
      formData.append("mealType", mealType);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Item berhasil ditambahkan");
        router.push("/");
      } else {
        toast.error("Item gagal ditambahkan");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Add Meal</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Upload File */}
        <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-500 p-6 rounded-lg cursor-pointer hover:border-blue-400">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full rounded-lg" />
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
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Meal Type Dropdown */}
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

        {/* Short Description */}
        <input
          type="text"
          placeholder="Short description..."
          value={description}
          required
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-800 text-white rounded-lg"
        />

        {/* Upload Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition mb-20"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
