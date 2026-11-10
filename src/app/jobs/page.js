import JobsClient from "@/components/JobsClient";

export const metadata = {
  title: "Jobs CRM",
  robots: { index: false, follow: false, nocache: true },
};

export default function JobsPage() {
  return <JobsClient />;
}
