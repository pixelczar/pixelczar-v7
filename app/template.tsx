"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";
import DarkThemePicker from "@/components/dark-theme-picker";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Don't apply template to Studio routes
  if (pathname?.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <>
      <CustomCursor />
      <DarkThemePicker />
      <Header />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </>
  );
}

