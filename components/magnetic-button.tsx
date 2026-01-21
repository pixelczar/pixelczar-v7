"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  hideCursor?: boolean;
  hideBorder?: boolean;
  target?: string;
  rel?: string;
  "data-cursor-shape"?: "circle" | "default";
}

export default function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  strength = 0.3,
  hideCursor = false,
  hideBorder = false,
  target,
  rel,
  "data-cursor-shape": cursorShape,
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    setPosition({
      x: deltaX * strength,
      y: deltaY * strength,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hideCursor) {
      // Hide the outer cursor ring by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent("hideCursorOuter", { detail: true })
      );
    }
    if (hideBorder) {
      // Hide the cursor border by dispatching a custom event
      window.dispatchEvent(
        new CustomEvent("hideCursorBorder", { detail: true })
      );
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
    setIsHovered(false);
    if (hideCursor) {
      // Show the outer cursor ring again
      window.dispatchEvent(
        new CustomEvent("hideCursorOuter", { detail: false })
      );
    }
    if (hideBorder) {
      // Show the cursor border again
      window.dispatchEvent(
        new CustomEvent("hideCursorBorder", { detail: false })
      );
    }
  };

  const Component = href ? motion.a : motion.button;
  const props = href
    ? { 
        href, 
        target: target || (href.startsWith('mailto:') ? undefined : "_blank"), 
        rel: rel || (href.startsWith('mailto:') ? undefined : "noopener noreferrer") 
      }
    : { onClick };

  return (
    <Component
      ref={ref as any}
      className={`cursor-hover ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      data-cursor-shape={cursorShape}
      {...props}
    >
      {children}
    </Component>
  );
}
