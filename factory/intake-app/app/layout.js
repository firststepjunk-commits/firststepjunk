import "./globals.css";

export const metadata = {
  title: "Site Factory — Intake",
  description:
    "Answer the intake questions and get a ready-to-run intake.json for factory/generate.mjs.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="wrap">{children}</main>
        <footer className="foot">
          Site Factory · intake webform · answers feed{" "}
          <code>factory/generate.mjs</code>
        </footer>
      </body>
    </html>
  );
}
