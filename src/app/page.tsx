import Navigation from "@/components/Navigation";
import MealList from "@/components/MealList";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4 bg-black text-white">
      <Navigation />
      <div className="p-4">
        <h1 className="text-xl font-bold md:text-2xl">Hi, Helwiza</h1>
      </div>
      <MealList />
    </main>
  );
}
