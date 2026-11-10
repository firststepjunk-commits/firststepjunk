// Lists the photos shipped in public/images so the editors can offer a picker
// instead of asking the owner to type a file path.
//
// Everything here is already publicly served, so there's nothing to gate. If
// the filesystem isn't readable (some serverless bundles drop public/), this
// returns an empty list and the picker falls back to the photos the site is
// already using — never an error the owner has to see.
import { readdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const IMAGE_EXT = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const MAX_DEPTH = 4;

async function walk(dir, urlBase, depth = 0) {
  if (depth > MAX_DEPTH) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    if (entry.isDirectory()) {
      found.push(
        ...(await walk(path.join(dir, entry.name), `${urlBase}/${entry.name}`, depth + 1))
      );
    } else if (IMAGE_EXT.test(entry.name)) {
      found.push(`${urlBase}/${entry.name}`);
    }
  }
  return found;
}

export async function GET() {
  try {
    const root = path.join(process.cwd(), "public", "images");
    const images = await walk(root, "/images");
    return Response.json({ images: images.sort() });
  } catch {
    return Response.json({ images: [] });
  }
}
