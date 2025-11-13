"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [displayPath, setDisplayPath] = useState(pathname);

  useEffect(() => {
    setDisplayPath(pathname);
  }, [pathname]);

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.04,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.2,
        ease: [0.4, 0, 1, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={displayPath}
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{ minHeight: "100vh" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

