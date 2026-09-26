import "@/components/website/website.css";
import { SiteTopBar } from "@/components/website/common/SiteTopBar";
import { Footer } from "@/components/website/footer/Footer";
import { Navbar } from "@/components/website/navbar/Navbar";

type WebsiteLayoutProps = {
  children: React.ReactNode;
};

export default function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <div className="site-shell">
      <div className="site-chrome">
        <SiteTopBar />
        <Navbar />
      </div>
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  );
}
