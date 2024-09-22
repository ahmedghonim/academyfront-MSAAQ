import { notFound } from "next/navigation";

import { AnyObject } from "@/types";

import VerifyForm from "./verify-form";

export default function Page({ params }: { params: AnyObject }) {
  const { id, signature } = params;

  if (!signature || !id) {
    notFound();
  }

  return <VerifyForm params={params} />;
}
