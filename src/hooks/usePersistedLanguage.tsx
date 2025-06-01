import { useState, useEffect } from "react";
import type { Language } from "../types/algorithm";

const STORAGE_KEY = "algoviz-preferred-language";
const DEFAULT_LANGUAGE: Language = "javascript";

interface UsePersistedLanguageOptions {
  availableLanguages?: Language[];
}

export const usePersistedLanguage = (
  options: UsePersistedLanguageOptions = {}
) => {
  const { availableLanguages = [] } = options;

  const [language, setLanguageState] = useState<Language>(() => {
    // init from localStorage or fallback to default
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedLanguage = saved as Language;

        // if we have available languages, validate the saved language
        if (availableLanguages.length > 0) {
          return availableLanguages.includes(parsedLanguage)
            ? parsedLanguage
            : availableLanguages.includes(DEFAULT_LANGUAGE)
            ? DEFAULT_LANGUAGE
            : availableLanguages[0];
        }

        return parsedLanguage;
      }
    } catch (error) {
      console.warn(
        "failed to read language preference from localStorage:",
        error
      );
    }

    // fallback
    if (availableLanguages.length > 0) {
      return availableLanguages.includes(DEFAULT_LANGUAGE)
        ? DEFAULT_LANGUAGE
        : availableLanguages[0];
    }

    return DEFAULT_LANGUAGE;
  });

  // update localStorage whenever language changes
  const setLanguage = (newLanguage: Language) => {
    // validate against available languages if provided
    if (
      availableLanguages.length > 0 &&
      !availableLanguages.includes(newLanguage)
    ) {
      console.warn(
        `language "${newLanguage}" is not available. Available languages:`,
        availableLanguages
      );
      return;
    }

    setLanguageState(newLanguage);

    try {
      localStorage.setItem(STORAGE_KEY, newLanguage);
    } catch (error) {
      console.warn(
        "failed to save language preference to localStorage:",
        error
      );
    }
  };

  // re-validate when available languages change
  useEffect(() => {
    if (
      availableLanguages.length > 0 &&
      !availableLanguages.includes(language)
    ) {
      const fallbackLanguage = availableLanguages.includes(DEFAULT_LANGUAGE)
        ? DEFAULT_LANGUAGE
        : availableLanguages[0];

      setLanguage(fallbackLanguage);
    }
  }, [availableLanguages, language]);

  return [language, setLanguage] as const;
};
