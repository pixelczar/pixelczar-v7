"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Profile() {
  return (
    <motion.section
      variants={itemVariants}
      className="flex flex-col items-center space-y-6 mb-12"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border">
          <Image
            src="/images/will.png"
            alt="Will Smith"
            width={48}
            height={48}
            className="w-full h-full object-cover "
          />
        </div>
        <div>
          <h2 className="text-lg font-sans font-medium text-foreground text-left">
            Will Smith
          </h2>
          <p className="text-sm font-sans font-normal text-left" style={{ color: 'var(--muted-foreground)' }}>
            Boston, Massachusetts
          </p>
        </div>
      </div>
    </motion.section>
  );
}
