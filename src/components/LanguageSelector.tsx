import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Language } from "@/types/algorithm";

interface LanguageSelectorProps {
  selectedLanguage: string;
  availableLanguages: string[];
  languageLabels: Record<string, string>;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

const LanguageSelector = ({
  selectedLanguage,
  availableLanguages,
  languageLabels,
  onLanguageChange,
  className = "",
}: LanguageSelectorProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang);
    setIsDropdownOpen(false);
  };

  // if only one language available, show a static badge
  if (availableLanguages.length <= 1) {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-400/30 ${className}`}
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
        <span className="text-blue-200 text-sm font-medium capitalize">
          {languageLabels[selectedLanguage] || selectedLanguage}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-200 font-medium"
      >
        <div className="w-2 h-2 bg-blue-400 rounded-full" />
        <span className="text-sm capitalize">
          {languageLabels[selectedLanguage] || selectedLanguage}
        </span>
        <div>
          <ChevronDown
            size={16}
            className={`${
              isDropdownOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-200`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 min-w-[140px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang as Language)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 ${
                  lang === selectedLanguage
                    ? "bg-blue-500/20 text-blue-200 border-l-2 border-blue-400"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-150 ${
                    lang === selectedLanguage ? "bg-blue-400" : "bg-gray-500"
                  }`}
                />
                <span className="font-medium">
                  {languageLabels[lang] ||
                    lang.charAt(0).toUpperCase() + lang.slice(1)}
                </span>
                {lang === selectedLanguage && (
                  <span className="ml-auto text-blue-400">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* backdrop to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
