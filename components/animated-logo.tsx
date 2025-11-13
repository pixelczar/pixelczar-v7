"use client";

import { useEffect, useState } from "react";

interface AnimatedLogoProps {
  isHovered?: boolean;
}

export default function AnimatedLogo({ isHovered = false }: AnimatedLogoProps) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Start the animation after component mounts
    const timer = setTimeout(() => setStarted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`halo branding ${isHovered ? "hovered" : ""}`}>
      <div className="spinning-rings">
        <div className={`spinning logo ${started ? "started" : ""}`}>
          <div className="rings">
            <div className="tilt one">
              <span className="ring one">
                <span className="texture"></span>
              </span>
            </div>
            <div className="tilt two">
              <span className="ring two">
                <span className="texture"></span>
              </span>
            </div>
            <div className="tilt three">
              <span className="ring three">
                <span className="texture"></span>
              </span>
            </div>
            <div className="tilt four">
              <span className="ring four">
                <span className="texture"></span>
              </span>
            </div>
          </div>
          <svg className="z-logo">
            <path
              className="z-shape"
              stroke="currentColor"
              fill="currentColor"
              d="M15.2,36.2c0,0.7,0.6,1.5,2.1,1c1.2,3-3.9,3.7-3.9,0.7c0-1.6,1.3-2.6,3.2-3.4L34,21.3 c-5.9,1.8-16,0.8-16,4.1c0,1.5,2.2,1.9,3.6,1.9v0.1c-4.3,0.1-5.6-3.1-5.6-5.4c0-3.1,1.9-6,6-6c4.8,0,9.9,4.7,12.7,4.7 c0.9,0,2.1-0.3,2.1-1.5c0-0.9-1.1-1.6-2.1-1.2c-0.8-1.2,0.2-2.6,1.6-2.6c1,0,2.1,0.6,2.1,2c0,1.8-1.4,2.9-3.4,3.6L17.5,34.1 c6-2.3,16.7-2,16.7-4.7c0-1.1-2.6-1.3-3.8-1.2v-0.1c4.3-0.4,5.8,1.9,5.8,4.5c0,4-3.4,6.6-6.8,6.6c-4.5,0-9.1-4.7-11.9-4.7 C16.6,34.5,15.2,34.9,15.2,36.2z M30.4,11.5c0,1.5-1.3,2.6-2.7,2.6c-1.1,0-1.9-0.8-1.9-2c0-1.4,1.3-2.6,2.7-2.6 C29.6,9.5,30.4,10.4,30.4,11.5z"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .branding {
          width: 45.6px;
          height: 45.6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .branding svg {
          fill: var(--foreground);
          stroke: var(--foreground);
          color: var(--foreground);
          position: absolute;
          top: 50%;
          left: 50%;
          height: 50px;
          width: 50px;
          transform: translate(-50%, -50%) scale(0.8);
          transition: fill 0.3s ease, stroke 0.3s ease, color 0.3s ease;
        }

        .halo .rings {
          opacity: 0.8;
        }

        .spinning.logo {
          height: 90px;
          width: 90px;
          position: relative;
          transform-style: preserve-3d;
        }

        .logo .rings {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          animation-name: ringspin;
          animation-duration: 7s;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }

        .logo .tilt {
          margin: 0;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          transform-style: preserve-3d;
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          opacity: 0;
        }

        .logo .tilt.one {
          transform: rotate(0deg) scale(0.3);
        }

        .logo .tilt.two {
          transform: rotate(45deg) scale(0.3);
        }

        .logo .tilt.three {
          transform: rotate(90deg) scale(0.3);
        }

        .logo .tilt.four {
          transform: rotate(135deg) scale(0.3);
        }

        .logo.started .tilt {
          opacity: 1;
        }

        .logo.started .tilt.one {
          transform: rotate(0deg) scale(0.75);
          transition-delay: 0.16s;
        }

        .logo.started .tilt.two {
          transform: rotate(45deg) scale(0.75);
          transition-delay: 0.32s;
        }

        .logo.started .tilt.three {
          transform: rotate(90deg) scale(0.75);
          transition-delay: 0.48s;
        }

        .logo.started .tilt.four {
          transform: rotate(135deg) scale(0.75);
          transition-delay: 0.64s;
        }

        .logo .ring {
          margin: 0;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          transform: translateZ(0);
          transform-style: preserve-3d;
          animation-name: logo-ring-1;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
          animation-duration: 4.2s;
          animation-delay: 1s;
        }

        .logo.started .ring {
          animation-play-state: running;
        }

        .logo .ring .texture {
          box-sizing: border-box;
          background-repeat: no-repeat;
          background-position: 50%;
          border: 2px solid hsl(var(--accent));
          opacity: 0.9;
          border-radius: 100%;
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          transform-style: preserve-3d;
          outline: none;
          box-shadow: none;
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .logo .ring.one,
        .logo .ring.two {
          animation-name: logo-ring-1;
        }

        .logo .ring.two {
          animation-duration: 3.75s;
        }

        .logo .ring.three {
          animation-duration: 3.42s;
          animation-name: logo-ring-1;
        }

        .logo .ring.four {
          animation-name: logo-ring-1;
          animation-duration: 2.936s;
        }

        .halo .spinning-rings {
          opacity: 1;
          transition-delay: 1.2s;
        }

        @keyframes ringspin {
          0% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes logo-ring-1 {
          0% {
            transform: rotateY(0deg) scaleX(0.9);
          }
          50% {
            transform: rotateY(180deg) scaleX(0.9);
          }
          100% {
            transform: rotateY(360deg) scaleX(0.9);
          }
        }

        .halo {
          transition: all 0.3s ease-in-out !important;
        }

        /* Smooth hover transitions - flatten rings into perfect flat circles */
        .halo:hover .ring .texture,
        .halo.hovered .ring .texture {
          transform: rotateY(0deg) rotateX(0deg) scaleX(1) scaleY(1) !important;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
        }

        .halo:hover .rings,
        .halo.hovered .rings {
          animation-play-state: paused !important;
          transform: rotate(0deg) !important;
        }

        .halo:hover .ring,
        .halo.hovered .ring {
          animation-play-state: paused !important;
          transform: rotateY(0deg) rotateX(0deg) !important;
        }

        .halo:hover .tilt,
        .halo.hovered .tilt {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
          opacity: 1;
          transform-style: flat !important;
        }

        /* Completely flatten all rings - no rotation, no 3D transforms */
        .halo:hover .tilt.one,
        .halo.hovered .tilt.one {
          transform: rotate(0deg) scale(0.75) rotateX(0deg) rotateY(0deg) !important;
        }

        .halo:hover .tilt.two,
        .halo.hovered .tilt.two {
          transform: rotate(0deg) scale(0.75) rotateX(0deg) rotateY(0deg) !important;
        }

        .halo:hover .tilt.three,
        .halo.hovered .tilt.three {
          transform: rotate(0deg) scale(0.75) rotateX(0deg) rotateY(0deg) !important;
        }

        .halo:hover .tilt.four,
        .halo.hovered .tilt.four {
          transform: rotate(0deg) scale(0.75) rotateX(0deg) rotateY(0deg) !important;
        }

        .logo .ring,
        .logo .ring *,
        .logo .tilt,
        .logo .tilt * {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
