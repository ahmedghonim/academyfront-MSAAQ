import { notFound } from "next/navigation";

import deepmerge from "deepmerge";
import { getRequestConfig } from "next-intl/server";

import { fetchTranslations } from "./server-actions/services/translations-service";

export const DEFAULT_LOCALE = "ar";

export const LOCALES = ["ar", "en"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const translations = (await fetchTranslations()) as any;

  if (!translations[locale]) notFound();
  const userMessages = temperRemoveDupleCurlPresses(translations[locale]);
  const defaultMessages = (await import(`./locales/${locale}.json`)).default;

  const messages = deepmerge(defaultMessages, userMessages);

  return {
    messages: messages
  };
});

// Define types for the translation structure
type TranslationValue = string | Record<string, Record<string, string>>;
type Translations = Record<string, TranslationValue>;

// Recursive function to remove duplicate curly braces from translation strings
function temperRemoveDupleCurlPresses(translations: Translations): Translations {
  const newTranslations: Translations | any = {};

  // Iterate over each key in the translations object
  for (const key in translations) {
    const value = translations[key];
    // Replace "." in the key with ".\n"
    const sanitizedKey = key.replace(/\./g, "_");
    // If the value is an object, recurse to process nested translations

    if (typeof value === "object") {
      newTranslations[sanitizedKey] = temperRemoveDupleCurlPresses(value as any);
    } else {
      // If the value is a string, replace duplicate curly braces with single curly braces
      newTranslations[sanitizedKey] = value.split("{{").join("{").split("}}").join("}");
    }
  }

  return newTranslations;
}
