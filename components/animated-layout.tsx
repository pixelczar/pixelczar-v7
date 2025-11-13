"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/header";

export default function AnimatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === "/";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };

  const homepageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };

  return (
    <>
      {/* Persistent Header - handles its own animations on homepage */}
      <Header />

      {/* Page Content with AnimatePresence for exit animations */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={isHomepage ? homepageVariants : containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            minHeight: "100vh",
            willChange: "opacity, transform",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
