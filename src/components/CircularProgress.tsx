"use client";

export default function CircularProgress({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 w-full h-full rounded-full bg-gray-700"></div>
      <div
        className="absolute inset-0 w-full h-full rounded-full"
        style={{
          background: `conic-gradient(#22c55e ${
            percentage * 3.6
          }deg, #374151 0deg)`,
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-white">
        {Math.round(percentage)}%
      </div>
    </div>
  );
}
