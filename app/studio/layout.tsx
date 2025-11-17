"use client";

import type React from "react";
import { useEffect } from "react";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Restore normal cursor for Studio by overriding globals.css
  useEffect(() => {
    // Add style to restore cursor
    const style = document.createElement('style');
    style.id = 'studio-cursor-override';
    style.innerHTML = `
      body, body * {
        cursor: auto !important;
      }
      button, a, [role="button"], [type="button"] {
        cursor: pointer !important;
      }
      input, textarea, select, [contenteditable] {
        cursor: text !important;
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount
    return () => {
      const existingStyle = document.getElementById('studio-cursor-override');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return <>{children}</>;
}

