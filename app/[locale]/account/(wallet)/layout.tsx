import { headers } from "next/headers";

import { getTranslations } from "next-intl/server";

import BaseLayout from "@/components/layout/base-layout";
import Container from "@/components/layout/container";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { WalletTabs } from "@/components/wallet";

export default async function WalletLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations();

  const headersList = headers();

  return (
    <BaseLayout
      className={headersList.get("x-current-path")?.substring(1).replace(/\//g, "-")}
      renderHeader={() => <Header />}
      renderFooter={() => <Footer />}
      renderMobileNavigation={() => <MobileNavigation />}
    >
      <Container layout="center">
        <h1 className="-mx-4 block border-b border-gray-400 px-4 pb-6 text-2xl font-medium text-black md:mx-0 md:!border-b-0 md:!px-0 md:pb-8">
          {t("wallet.title")}
        </h1>
        <WalletTabs>{children}</WalletTabs>
      </Container>
    </BaseLayout>
  );
}
