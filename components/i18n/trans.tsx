import { RichTranslationValues, useTranslations } from "next-intl";

interface TransProps {
  i18nKey: string;
  values?: RichTranslationValues;
}

const Trans = ({ i18nKey, values }: TransProps) => {
  const t = useTranslations();

  if (values) {
    return t.rich(i18nKey, values);
  }

  return t(i18nKey);
};

export default Trans;
