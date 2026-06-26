import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FloatingWhatsApp, MobileActionBar } from "@/components/site/whatsapp-button";
import { OrganizationJsonLd } from "@/components/seo/json-ld";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
