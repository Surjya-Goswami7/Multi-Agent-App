import { ReactNode } from "react";
import "./globals.css";
import { CreditsProvider } from "./context/creditcontext";
export const metadata = {
  title: "Multi Agent App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CreditsProvider>{children}</CreditsProvider>
      </body>
    </html>
  );
}
