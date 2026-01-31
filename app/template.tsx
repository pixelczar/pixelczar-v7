"use client";

import type React from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";
import CustomCursor from "@/components/custom-cursor";
import Footer from "@/components/footer";

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

  const isPixels = pathname === '/pixels';

  return (
    <>
      <CustomCursor />
      {!isPixels && <Header />}
      <PageTransition>
        {children}
      </PageTransition>
      {!isPixels && <Footer />}
    </>
  );
}

