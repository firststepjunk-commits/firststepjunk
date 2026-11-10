// Server component — applies the published theme at runtime.
//
// The owner picks a theme in Settings → Theming; the choice is stored as
// `content.theme` (published via the Apps Script/Sheet pipeline like every
// other setting). This component reads it per-request and injects a `:root`
// override for the Tailwind @theme tokens defined in src/app/globals.css,
// so switching themes never requires a rebuild.
//
// Theme definitions live in src/lib/themes.json (the factory-wide catalog).
import { getContent } from "@/lib/content";
import catalog from "@/lib/themes.json";

export default async function ThemeStyle() {
  let themeId = null;
  try {
    const content = await getContent();
    themeId = content?.theme || null;
  } catch {
    themeId = null;
  }
  if (!themeId) return null;
  const theme = catalog.themes.find((t) => t.id === themeId);
  if (!theme?.css || !Object.keys(theme.css).length) return null;
  const css = `:root{${Object.entries(theme.css)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")}}`;
  return <style id="theme-override" dangerouslySetInnerHTML={{ __html: css }} />;
}
