import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const user_id = (await supabase.auth.getUser()).data.user?.id;

  if (!user_id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range");
  let start = searchParams.get("start");
  let end = searchParams.get("end");

  // 🔥 Auto-generate start & end jika pakai range
  const today = new Date().toISOString().split("T")[0];

  if (range === "today") {
    start = today;
    end = today;
  } else if (range === "this_week") {
    const now = new Date();
    const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Minggu pertama
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6); // Sabtu terakhir

    start = firstDayOfWeek.toISOString().split("T")[0];
    end = lastDayOfWeek.toISOString().split("T")[0];
  } else if (range === "this_month") {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    start = firstDayOfMonth.toISOString().split("T")[0];
    end = lastDayOfMonth.toISOString().split("T")[0];
  }

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing start or end date" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user_id)
    .gte("created_at", `${start}T00:00:00.000Z`)
    .lte("created_at", `${end}T23:59:59.999Z`);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
