import MealList from "@/components/MealList";

import { signOutAction } from "@/actions/auth";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/sign-in");
  let metadata = user.user_metadata;
  return (
    <div className="flex flex-col pb-40 md:items-center">
      <div className="p-4 ">
        <h1 className="text-xl font-bold md:text-2xl">
          Hi, {metadata.full_name}
        </h1>
        <form action={signOutAction}>
          <button
            type="submit"
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
          >
            Sign Out
          </button>
        </form>
      </div>
      <div className="fixed bottom-24 right-5 bg-white rounded-full xl:bottom-14 xl:right-24">
        <Link href="/add-meal" className="text-blue-500 hover:text-blue-400">
          <PlusCircle size={44} strokeWidth={1.5} />
        </Link>
      </div>

      <MealList />
    </div>
  );
}
