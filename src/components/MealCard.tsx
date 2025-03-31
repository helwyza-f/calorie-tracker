"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

export default function MealCard({
  title,
  description,
  calories,
  image,
}: {
  title: string;
  description: string;
  calories: number;
  image: string;
}) {
  return (
    <Card className="bg-gray-800 p-4 rounded-lg flex flex-row items-center gap-4 text-white max-w-3xl w-full">
      <div className="w-14 h-14 bg-gray-700 rounded-md overflow-hidden">
        <Image
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          width={300}
          height={300}
        />
      </div>
      <div className="flex-1">
        <h2 className="text-sm font-bold">{title}</h2>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <span className="text-sm font-bold">{calories} kcal</span>
    </Card>
  );
}
