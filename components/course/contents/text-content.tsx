"use client";

import { useEffect } from "react";

import { Content, Text } from "@/types";

interface Props {
  content: Content<Text>;
}

const TextContent = ({ content }: Props) => {
  useEffect(() => {
    try {
      const contentElement = document.getElementById(`text-content-${content.id}`);

      if (contentElement) {
        const links = contentElement.getElementsByTagName("a");

        for (let i = 0; i < links.length; i++) {
          if (!links[i].hasAttribute("target")) {
            links[i].setAttribute("target", "_blank");
          }
        }
      }
    } catch (e) {}
  }, [content]);

  return (
    <article
      id={`text-content-${content.id}`}
      className="prose prose-sm prose-stone sm:prose-base lg:prose-lg h-full !max-w-full p-4 [&_iframe]:h-48 [&_iframe]:max-w-full sm:[&_iframe]:h-64 md:[&_iframe]:h-64 lg:[&_iframe]:h-80"
      dangerouslySetInnerHTML={{ __html: content.description }}
    />
  );
};

export default TextContent;
