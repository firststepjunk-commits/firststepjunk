import NextImage from "next/image";

// One image element for every content-driven photo on the site.
//
// Local paths ("/images/…") go through next/image so they get resized and
// cached. Anything else renders as a plain <img>: next/image THROWS on a
// remote host that isn't listed in next.config remotePatterns, and site photos
// are owner-editable — a pasted link would otherwise take the page down.
export default function SiteImage({
  src,
  alt = "",
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  ...rest
}) {
  if (!src) return null;

  // "//cdn.example.com/x.jpg" is remote despite the leading slash.
  const isLocal = src.startsWith("/") && !src.startsWith("//");

  if (isLocal) {
    return (
      <NextImage
        src={src}
        alt={alt}
        className={className}
        sizes={sizes}
        priority={priority}
        {...(fill ? { fill: true } : { width, height })}
        {...rest}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={fill ? `absolute inset-0 h-full w-full ${className}` : className}
      {...(fill ? {} : { width, height })}
      {...(priority ? { fetchPriority: "high" } : { loading: "lazy" })}
      {...rest}
    />
  );
}
