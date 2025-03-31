import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { full_name, bb, tb, calorie_goal } = await req.json();

  if (!full_name || !bb || !tb || !calorie_goal) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name, bb, tb, calorie_goal })
    .eq("id", user_id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Profile updated" });
}
