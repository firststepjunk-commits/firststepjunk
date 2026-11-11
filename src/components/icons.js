/**
 * Inline SVG icons for the hero and navbar.
 *
 * The site loads Material Symbols for icon ligatures elsewhere, but the
 * hero's critical elements (call button, badge, trust cards) must never
 * depend on that font — when it fails to load, the ligature word (e.g.
 * "call") renders as literal text. These are plain SVGs: they render
 * identically everywhere.
 */

export function PhoneIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

export function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function StarIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function ClockIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

export function ShieldCheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
      <path d="M9 11.5l2 2 4-4.5" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Extra icons for the "We haul almost anything" section and the
 * text-a-photo / mobile sticky-bar actions. Same rule as above: plain
 * inline SVGs, never a font ligature. These are simple stroke shapes
 * (feather-style) drawn from basic rects and paths, so they render
 * identically everywhere.
 */
function StrokeIcon({ className = "h-5 w-5", children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

export function MessageIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </StrokeIcon>
  );
}

export function CameraIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </StrokeIcon>
  );
}

export function InfoIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 7.5h.01" />
    </StrokeIcon>
  );
}

export function ArmchairIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="7" y="3" width="10" height="8" rx="1" />
      <path d="M5 11h14v6H5z" />
      <path d="M7 17v3M17 17v3" />
    </StrokeIcon>
  );
}

export function SofaIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="3" y="4" width="18" height="7" rx="1" />
      <path d="M2 11h20v6H2z" />
      <path d="M5 17v3M19 17v3" />
    </StrokeIcon>
  );
}

export function MattressIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="2" y="9" width="20" height="8" rx="2" />
      <path d="M2 13h20" />
      <rect x="5" y="5" width="5" height="4" rx="1" />
    </StrokeIcon>
  );
}

export function FridgeIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="6" y="2" width="12" height="20" rx="1" />
      <path d="M6 10h12" />
      <path d="M15 5v3M15 13v3" />
    </StrokeIcon>
  );
}

export function PianoIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="2" y="5" width="20" height="11" rx="1" />
      <path d="M2 13h20" />
      <path d="M6 13v3M10 13v3M14 13v3M18 13v3" />
      <path d="M5 16v4M19 16v4" />
    </StrokeIcon>
  );
}

export function ShedIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M3 11L12 4l9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </StrokeIcon>
  );
}

export function FenceIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M4 4v16M9 4v16M14 4v16M19 4v16" />
      <path d="M2 9h20M2 15h20" />
    </StrokeIcon>
  );
}

export function TreeIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8" />
      <path d="M8 21h8" />
    </StrokeIcon>
  );
}

export function BricksIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="2" y="4" width="9" height="6" />
      <rect x="13" y="4" width="9" height="6" />
      <rect x="7" y="14" width="9" height="6" />
      <rect x="2" y="14" width="3" height="6" />
      <rect x="18" y="14" width="4" height="6" />
    </StrokeIcon>
  );
}

export function HomeIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
      <path d="M17 4v4" />
    </StrokeIcon>
  );
}

export function StorageIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M4 8h16M4 13h16M4 18h16" />
      <rect x="10" y="10" width="4" height="3" />
    </StrokeIcon>
  );
}

export function BoxIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
      <path d="M3 8l9 5 9-5" />
      <path d="M12 13v8" />
    </StrokeIcon>
  );
}

export function TvIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="2" y="4" width="20" height="13" rx="1" />
      <path d="M8 21h8M12 17v4" />
    </StrokeIcon>
  );
}

export function WasherIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <circle cx="12" cy="13" r="4" />
      <path d="M4 7h16" />
    </StrokeIcon>
  );
}

export function DresserIcon({ className = "h-5 w-5" }) {
  return (
    <StrokeIcon className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M4 9h16M4 15h16M10 6h4M10 12h4M10 18h4" />
    </StrokeIcon>
  );
}
