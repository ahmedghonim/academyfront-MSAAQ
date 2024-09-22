import RootLayout from "@/components/layout/root-layout";
import { AnyObject } from "@/types";

export default function AccountLayout({ children, params }: { children: React.ReactNode; params: AnyObject }) {
  return <RootLayout params={params}>{children}</RootLayout>;
}
