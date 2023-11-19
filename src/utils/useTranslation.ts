import { useContext, useState, useEffect } from "react";
import { LanguageContext } from "./LanguageContext";

type Translations = { [key: string]: string };

const useTranslation = () => {
  const { locale } = useContext(LanguageContext);
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    import(`../locales/${locale}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) =>
        console.error(`Failed to load ${locale} translations`, error)
      );
  }, [locale]);

  const t = (key: string): string => translations[key] || key;

  return { t };
};

export default useTranslation;
