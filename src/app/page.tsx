// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Redirect users directly to the dashboard sign-in page
  redirect("/dashboard");
  return null;
}
