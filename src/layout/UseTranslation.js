import { useSelector } from "react-redux";
import { translations } from "./Translations";

export const useTranslation = () => {
  const currentLanguage = useSelector(
    (state) => state.language.currentLanguage,
  );
  const availableLanguages = useSelector(
    (state) => state.language.availableLanguages,
  );

  const t = (key) => {
    const keys = key.split(".");
    let value = translations[currentLanguage];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key; // Fallback to key if translation not found
  };

  return { t, currentLanguage, availableLanguages };
};
