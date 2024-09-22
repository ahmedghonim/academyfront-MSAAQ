import { getDestination } from "@/utils";
import { permanentRedirect } from "@/utils/navigation";

export default async function Page({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  permanentRedirect(getDestination("/library/certificates", searchParams));
}
