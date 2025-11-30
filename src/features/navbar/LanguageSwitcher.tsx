import { dnt, useTranslation } from "eqqo-react";
import { Globe, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "en-gb", name: "English (GB)" },
  { code: "en-us", name: "English (US)" },
  { code: "ar", name: "العربية" },
  { code: "bg", name: "Български" },
  { code: "cs", name: "Čeština" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "el", name: "Ελληνικά" },
  { code: "es", name: "Español" },
  { code: "es-419", name: "Español (LA)" },
  { code: "et", name: "Eesti" },
  { code: "fi", name: "Suomi" },
  { code: "fr", name: "Français" },
  { code: "he", name: "עברית" },
  { code: "hu", name: "Magyar" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "it", name: "Italiano" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "lt", name: "Lietuvių" },
  { code: "lv", name: "Latviešu" },
  { code: "nb", name: "Norsk Bokmål" },
  { code: "nl", name: "Nederlands" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "pt-br", name: "Português (BR)" },
  { code: "pt-pt", name: "Português (PT)" },
  { code: "ro", name: "Română" },
  { code: "ru", name: "Русский" },
  { code: "sk", name: "Slovenčina" },
  { code: "sl", name: "Slovenščina" },
  { code: "sv", name: "Svenska" },
  { code: "th", name: "ไทย" },
  { code: "tr", name: "Türkçe" },
  { code: "uk", name: "Українська" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "zh", name: "中文" },
  { code: "zh-hans", name: "简体中文" },
  { code: "zh-hant", name: "繁體中文" },
];

export default function LanguageSwitcher() {
  const { switchLanguage, currentLanguage, isLoading } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLanguageSelect = async (langCode: string) => {
    if (langCode !== currentLanguage && !isLoading) {
      await switchLanguage(langCode);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex flex-row gap-0 rounded-full border border-gray-200 clickable relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-label="Select language"
      >
        {isLoading ? (
          <Loader2 className="size-4 my-1.5 mx-2 z-10 animate-spin text-gray-400" />
        ) : (
          <Globe className="size-4 my-1.5 mx-2 z-10 transition-colors text-gray-400" />
        )}
      </button>

      <div
        className={`absolute right-0 w-48 max-h-96 rounded-lg border border-gray-200 bg-gray-50 shadow-lg z-50 overflow-y-auto transition-all duration-200 ease-out ${
          isOpen
            ? "opacity-100 top-full mt-2 pointer-events-auto"
            : "opacity-0 top-0 pointer-events-none"
        }`}
      >
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              currentLanguage === lang.code
                ? "bg-gray-100 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleLanguageSelect(lang.code)}
            disabled={isLoading}
          >
            {dnt(lang.name)}
          </button>
        ))}
      </div>
    </div>
  );
}
