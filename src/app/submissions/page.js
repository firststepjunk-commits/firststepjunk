import SubmissionsClient from "@/components/SubmissionsClient";

export const metadata = {
  title: "Submissions",
  robots: { index: false, follow: false, nocache: true },
};

export default function SubmissionsPage() {
  return <SubmissionsClient />;
}
