"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";

import { PageBlock } from "@/types";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function Html({ block }: { block: PageBlock<"html"> }) {
  const styles = block.styles?.custom;
  let sectionStyles: string | null = "";
  const containerRef = useRef<HTMLDivElement>(null);

  if (
    !styles ||
    !styles
      .replace(/(<([^>]+)>\r\n|\n|\r|[{}])/gi, "")
      .replaceAll("selector", "")
      .trim().length
  ) {
    sectionStyles = null;
  } else {
    sectionStyles = styles.replaceAll("selector", `#block-${block.id}`);
  }

  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    const code = block.fields_values.html;

    if (!container || !code) {
      return;
    }

    const range = document.createRange();

    range.setStart(container, 0);
    const fragment = range.createContextualFragment(code);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.append(fragment);
  }, []);

  return (
    block.fields_values.html && (
      <>
        {sectionStyles && (
          <style
            data-mq-style={`block-${block.id}`}
            dangerouslySetInnerHTML={{
              __html: sectionStyles
            }}
          />
        )}
        <div
          id={`block-${block.id}`}
          ref={containerRef}
          style={{ display: "contents" }}
        />
      </>
    )
  );
}

export default Html;
