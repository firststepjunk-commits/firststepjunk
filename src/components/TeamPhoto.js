"use client";

import { useState } from "react";

// Renders a team member photo, gracefully falling back to a branded initials
// avatar if the image path is empty or fails to load. This means an owner can
// point a member at any path (or none) without ever showing a broken image.
export default function TeamPhoto({ src, alt, name, imagePath }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div
        className="flex h-72 w-full items-center justify-center bg-cover bg-center bg-gradient-to-br from-primary-container to-primary"
        aria-label={alt || name}
        role="img"
        data-image-path={imagePath}
      >
        <span className="font-display-lg text-6xl font-bold text-secondary-fixed">
          {initial}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-72 w-full object-cover"
      data-image-path={imagePath}
    />
  );
}
