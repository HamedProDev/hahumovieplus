import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: ReactNode;
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export function Layout({ children, hideNavbar, hideFooter }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideNavbar && <Navbar />}
      <main className="flex-1 pt-16 lg:pt-20">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
}
