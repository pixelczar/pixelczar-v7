import Link from "next/link";
import type { CSSProperties } from "react";

interface MagneticLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export default function MagneticLink({
  href,
  children,
  className = "",
  style,
  onClick,
}: MagneticLinkProps) {
  return (
    <Link href={href} className={`cursor-hover ${className}`} style={style} onClick={onClick}>
      {children}
    </Link>
  );
}
