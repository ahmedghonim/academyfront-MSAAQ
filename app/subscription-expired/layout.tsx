import "@/styles/globals.scss";

import "@msaaqcom/abjad/dist/style.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
