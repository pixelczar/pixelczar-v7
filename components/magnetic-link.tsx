"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticLink({
  href,
  children,
  className = "",
  style,
  onClick,
  strength = 0.3,
}: MagneticLinkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={containerRef}
      style={{ display: "inline-block" }}
      animate={{
        x: position.x,
        y: position.y,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        mass: 0.5,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={href}
        className={`cursor-hover ${className}`}
        style={style}
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  );
}
