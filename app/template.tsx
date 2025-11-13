"use client";

import type React from "react";
import Header from "@/components/header";
import PageTransition from "@/components/page-transition";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  );
}

