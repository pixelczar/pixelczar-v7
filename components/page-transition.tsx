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
        duration: 2.5,
        ease: [0.16, 1.0, 0.3, 1.0], // easeOutExpo - extra smooth
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1.5,
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
        duration: 2.0,
        ease: [0.16, 1.0, 0.3, 1.0], // easeOutExpo - extra smooth
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
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

