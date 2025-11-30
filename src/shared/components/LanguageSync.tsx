import { useTranslation } from "eqqo-react";
import { useEffect } from "react";

export default function LanguageSync() {
  const { currentLanguage } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return null;
}
