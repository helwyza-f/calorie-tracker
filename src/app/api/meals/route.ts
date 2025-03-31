import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// ✅ API Handler untuk GET meals dari Supabase
export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("meals") // Nama tabel
      .select("*") // Ambil semua kolom
      .order("created_at", { ascending: false }); // Urutkan dari terbaru

    if (error) throw error; // Handle error jika ada

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch meals", error },
      { status: 500 }
    );
  }
}
