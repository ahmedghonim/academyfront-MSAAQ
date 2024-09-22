import { ProfilePage } from "schema-dts";

import { Academy, Mentor } from "@/types";

function profilePageJsonLd(member?: Mentor | null, tenant?: Academy | null): ProfilePage {
  if (!member || !tenant) {
    return {} as ProfilePage;
  }

  return {
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: member.name || undefined,
      alternateName: member.username || undefined,
      identifier: member.username || member.uuid,
      url: `https://${tenant.domain}/@${member.username ?? member.uuid}`,
      image: member.avatar || undefined,
      description: member.bio || "",
      jobTitle: member.education || undefined,
      agentInteractionStatistic: {
        "@type": "InteractionCounter",
        interactionType: "https://schema.org/WriteAction",
        userInteractionCount: member.courses_count
      },
      sameAs:
        Object.keys(member.social_links ?? {}).length > 0
          ? Object.keys(member.social_links ?? {})
              .map((key) => member.social_links?.[key as keyof typeof member.social_links])
              .filter((link) => link)
          : undefined
    }
  } as ProfilePage;
}

export default profilePageJsonLd;
