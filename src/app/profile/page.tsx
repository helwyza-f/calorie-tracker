// src/app/profile/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm"; // Import the client component
import { signOutAction } from "@/actions/auth";

export default async function ProfilePage() {
  "use server";

  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) return redirect("/sign-in");

  // Fetch profile data from the database
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, bb, tb, calorie_goal")
    .eq("id", user.id)
    .single();

  if (!profile)
    return <div className="text-center text-white">Profile not found.</div>;

  // Pass profile data to the ProfileForm component
  return (
    <div className="max-w-md mx-auto p-4 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <ProfileForm profile={profile} userId={user.id} />
      {/* signout button */}
      <div className="text-center my-10">
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4  rounded-lg"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
