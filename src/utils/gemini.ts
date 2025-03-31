import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API!);

export async function analyzeFood(base64Image: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analisis gambar makanan ini dan berikan:
    1. Nama makanan  
    2. Estimasi kalori  
    3. Kandungan protein, lemak, dan karbohidrat  

    Format respons JSON (tanpa tambahan teks lain):  
    {
      "name": "nama makanan",
      "calories": jumlah_kalori,
      "protein": jumlah_protein,
      "fat": jumlah_lemak,
      "carbs": jumlah_karbohidrat
    }`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Image, mimeType: "image/png" } },
    ]);

    const text = result.response.text();
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error analyzing food:", error);
    return null;
  }
}
