import { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "./context/authContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

export const metadata = {
  title: "Multi Agent App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
