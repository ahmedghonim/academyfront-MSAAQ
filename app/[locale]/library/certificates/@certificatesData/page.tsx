import React from "react";

import { fetchMemberCertificates } from "@/server-actions/services/member-service";

import CertificatesListing from "./certificates-listing";

export default async function Page() {
  const certificates = await fetchMemberCertificates({
    limit: 3
  });

  return (
    <CertificatesListing
      initialCertificates={certificates}
      initialFilters={{
        limit: 3
      }}
    />
  );
}
