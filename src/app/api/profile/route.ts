import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();

  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, bb, tb, calorie_goal")
    .eq("id", user_id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
