import "@/components/website/website.css";
import { SiteTicker } from "@/components/website/common/SiteTicker";
import { Footer } from "@/components/website/footer/Footer";
import { Navbar } from "@/components/website/navbar/Navbar";

type WebsiteLayoutProps = {
  children: React.ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <div className="site-shell">
      <div className="site-chrome">
        <SiteTicker />
        <Navbar />
      </div>
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
