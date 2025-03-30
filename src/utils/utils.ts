"use server";

import { redirect } from "next/navigation";

export const encodedRedirect = async (
  status: "success" | "error",
  path: string,
  message: string
) => {
  const params = new URLSearchParams({ status, message });
  return redirect(`${path}?${params.toString()}`);
};
