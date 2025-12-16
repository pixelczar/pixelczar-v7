"use client";

import Profile from "@/components/profile";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground theme-transition flex flex-col relative overflow-hidden">
      <main className="flex flex-col items-center justify-center px-6 text-center theme-transition relative mx-auto">
        <Profile />
      </main>
    </div>
  );
}
