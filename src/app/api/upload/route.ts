import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const formData = await req.formData();

  const file = formData.get("file") as Blob | null;
  const description = formData.get("description") as string;
  const mealType = formData.get("mealType") as string;

  if (!file || !description || !mealType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload ke Supabase Storage
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("meals") // 🛠️ Pastikan ada bucket `meals`
      .upload(fileName, buffer, { contentType: "image/png" });

    if (uploadError) throw new Error(uploadError.message);

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/meals/${fileName}`;

    // 🔍 Analisis Gambar dengan Gemini
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Data = buffer.toString("base64");
    const prompt = `Analisis gambar makanan atau minuman ini dengan deskripsi "${description}" dan berikan jumlah kalori, protein, lemak, dan karbohidrat dalam format JSON seperti ini dan hanya berikan format JSON tanpa tambahan teks lain:  
    {
      "calories": jumlah_kalori,
      "protein": jumlah_protein,
      "fat": jumlah_lemak,
      "carbs": jumlah_karbohidrat,
      "deskripsi": deskripsi_singkat_tentang_makanan_12_kata
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: "image/png" } },
    ]);

    const text = result.response.text();
    //     console.log(text);
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const { calories, protein, fat, carbs, deskripsi } =
      JSON.parse(cleanedText);

    // Simpan ke Database
    const { error: dbError } = await supabase.from("meals").insert([
      {
        user_id: (await supabase.auth.getUser()).data.user?.id,
        image_url: imageUrl,
        description: deskripsi,
        meal_type: mealType,
        calories,
        protein,
        fat,
        carbs,
      },
    ]);

    if (dbError) throw new Error(dbError.message);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Upload Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
