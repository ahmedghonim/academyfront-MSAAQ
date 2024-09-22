import { useEffect, useState } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export const useCopyToClipboard = (): [CopyFn, Array<CopiedValue>] => {
  const [copiedTexts, setCopiedTexts] = useState<Array<CopiedValue>>([]);
  let timeout: NodeJS.Timeout;
  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedTexts((prev) => [...prev, text]);
      timeout = setTimeout(() => setCopiedTexts([]), 2000);

      return true;
    } catch (error) {
      setCopiedTexts([]);

      return false;
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return [copy, copiedTexts];
};
