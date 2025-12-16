"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  strength?: number;
  "data-cursor-rounded"?: "full" | string;
}

export default function MagneticLink({
  href,
  children,
  className = "",
  style,
  onClick,
  strength = 0.3, // Strength prop is now decorative
  "data-cursor-rounded": dataCursorRounded,
}: MagneticLinkProps) {
  return (
    <div style={{ display: "inline-block" }}>
      <Link
        href={href}
        className={`cursor-hover ${className}`}
        style={style}
        onClick={onClick}
        data-cursor-rounded={dataCursorRounded}
      >
        {children}
      </Link>
    </div>
  );
}
