import SettingsApp from "@/components/settings/SettingsApp";
import { BUSINESS } from "@/lib/seo";

export const dynamic = "force-dynamic";

// Keep this page out of search engines. It is not linked anywhere public.
export const metadata = {
  title: `Site Settings — ${BUSINESS.shortName}`,
  robots: { index: false, follow: false, nocache: true },
};

export default function SettingsPage() {
  return <SettingsApp />;
}
