import { useMemo } from "react";

import { PageBlock } from "@/types";

function useSectionStyles(block: PageBlock<any>) {
  return useMemo(() => {
    const styles = block.styles?.custom;

    if (
      !styles ||
      !styles
        .replace(/(<([^>]+)>\r\n|\n|\r|[{}])/gi, "")
        .replaceAll("selector", "")
        .trim().length
    ) {
      return null;
    }

    return styles.replaceAll("selector", `#block-${block.id}`);
  }, [block.styles?.custom]);
}

export default useSectionStyles;
