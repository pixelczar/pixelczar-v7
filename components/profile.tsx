"use client";

import Image from "next/image";

export default function Profile() {
  return (
    <section className="flex flex-col items-center space-y-4 mb-12">
      <div className="w-14 h-14 rounded-full overflow-hidden border">
        <Image
          src="/images/will.png"
          alt="Will Smith"
          width={56}
          height={56}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-sans font-medium text-foreground">
          Will Smith
        </h2>
        <p className="text-sm font-sans font-normal" style={{ color: 'var(--muted-foreground)' }}>
          Beverly, Massachusetts
        </p>
      </div>
    </section>
  );
}
