// ============================================================
// LogoMark — Official ParkEase Brand Icon
// ============================================================
// Three combined brand elements (per brand identity plan):
//   1. Location Pin   — blue teardrop, "find & navigate"
//   2. P for Parking  — white P letter with counter inside pin
//   3. Parking Slot   — L-bracket corners + green center dashes
//
// viewBox: 36 × 50  →  aspect ratio 0.72
// Use the `height` prop to scale; width is auto-calculated.
// ============================================================

interface LogoMarkProps {
  /** Height in px. Width is derived from the 36:50 aspect ratio. */
  height?: number;
  className?: string;
}

export function LogoMark({ height = 32, className }: LogoMarkProps) {
  const width = Math.round(height * 0.72);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* ── 1. Location Pin ─────────────────────────────────────
          Blue teardrop shape: circle body narrows to a sharp tip.   */}
      <path
        d="M18 0C8.059 0 0 8.059 0 18C0 27.5 18 39 18 39C18 39 36 27.5 36 18C36 8.059 27.941 0 18 0Z"
        fill="#2563EB"
      />

      {/* ── 2. P for Parking ────────────────────────────────────
          White P letter: vertical stem + D-shaped bowl.
          Inner counter left as blue so the "hole" of the P reads. */}

      {/* Vertical stem */}
      <rect x="11.5" y="6.5" width="3.5" height="20" rx="0.8" fill="white" />

      {/* Outer bowl (D-shape, upper half of stem height) */}
      <path
        d="M15 6.5H19.5C26 6.5 26 17.5 19.5 17.5H15V6.5Z"
        fill="white"
      />

      {/* Inner counter — blue cutout makes the loop of P visible */}
      <path
        d="M15.5 9.5H19.5C22.5 9.5 22.5 14.5 19.5 14.5H15.5V9.5Z"
        fill="#2563EB"
      />

      {/* ── 3. Parking Slot ─────────────────────────────────────
          Two L-shaped corner brackets framing the pin tip,
          with two green dashes in the centre — representing
          a physical parking bay marking (viewed from above). */}

      {/* Left bracket — vertical bar */}
      <rect x="2"  y="39" width="3"  height="10" rx="0.5" fill="#2563EB" />
      {/* Left bracket — horizontal bar */}
      <rect x="2"  y="46" width="10" height="3"  rx="0.5" fill="#2563EB" />

      {/* Right bracket — vertical bar */}
      <rect x="31" y="39" width="3"  height="10" rx="0.5" fill="#2563EB" />
      {/* Right bracket — horizontal bar */}
      <rect x="24" y="46" width="10" height="3"  rx="0.5" fill="#2563EB" />

      {/* Centre green dashes (owner / earn accent colour) */}
      <rect x="13.5" y="46" width="4"  height="3" rx="0.5" fill="#10B981" />
      <rect x="19.5" y="46" width="4"  height="3" rx="0.5" fill="#10B981" />
    </svg>
  );
}
