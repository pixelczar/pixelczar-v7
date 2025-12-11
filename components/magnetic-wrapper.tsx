"use client";

interface MagneticWrapperProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  "data-cursor-rounded"?: "full" | string;
}

export default function MagneticWrapper({
  children,
  className = "",
  strength = 0.3,
  "data-cursor-rounded": dataCursorRounded,
}: MagneticWrapperProps) {
  return (
    <div
      style={{ display: "inline-block" }}
      className={className}
      data-cursor-rounded={dataCursorRounded}
    >
      {children}
    </div>
  );
}

