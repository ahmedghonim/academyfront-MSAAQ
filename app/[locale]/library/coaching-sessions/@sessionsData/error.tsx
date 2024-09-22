"use client";

import { BaseError } from "@/components/errors";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <BaseError error={error} />;
}
