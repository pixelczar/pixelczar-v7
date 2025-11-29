"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Header from "@/components/header";
import { smoothEase, exitEase } from "@/lib/animations";

export default function AnimatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: smoothEase,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.25,
        ease: exitEase,
      },
    },
  };

  return (
    <>
      {/* Persistent Header - handles its own animations */}
      <Header />

      {/* Page Content with AnimatePresence for exit animations */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{ 
            minHeight: "100vh",
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
