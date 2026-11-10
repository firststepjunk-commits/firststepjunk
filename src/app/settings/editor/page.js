import SiteEditor from "@/components/settings/SiteEditor";
import { BUSINESS } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Owner-only tool — keep out of search engines. Not linked anywhere public.
export const metadata = {
  title: `Site Editor — ${BUSINESS.shortName}`,
  robots: { index: false, follow: false, nocache: true },
};

export default function SiteEditorPage() {
  return <SiteEditor />;
}
