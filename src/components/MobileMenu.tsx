import { Lightbulb, Eye, Menu, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Language } from "@/types/algorithm";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  showVariableViewer?: boolean;
  onToggleVariableViewer?: () => void;
  onShowIntuition?: () => void;
  // language selector props
  selectedLanguage?: string;
  availableLanguages?: string[];
  languageLabels?: Record<string, string>;
  onLanguageChange?: (language: Language) => void;
  // conditional rendering flags
  showIntuitionOption?: boolean;
  showVariableViewerOption?: boolean;
  showLanguageSelector?: boolean;
}

const MobileMenu = ({
  isOpen,
  onClose,
  showVariableViewer = false,
  onToggleVariableViewer,
  onShowIntuition,
  selectedLanguage = "javascript",
  availableLanguages = [],
  languageLabels = {},
  onLanguageChange,
  showIntuitionOption = false,
  showVariableViewerOption = false,
  showLanguageSelector = false,
}: MobileMenuProps) => {
  const handleMenuAction = (action: () => void) => {
    action();
    onClose();
  };

  const handleLanguageSelect = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sm:hidden relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 min-w-[200px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* show intuition option */}
            {showIntuitionOption && onShowIntuition && (
              <button
                onClick={() => handleMenuAction(onShowIntuition)}
                className="w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 text-amber-200 hover:bg-amber-500/20 border-b border-white/10"
              >
                <Lightbulb size={16} className="text-amber-400" />
                <span className="font-medium">Show Intuition</span>
              </button>
            )}

            {/* variable inspector option */}
            {showVariableViewerOption && onToggleVariableViewer && (
              <button
                onClick={() => handleMenuAction(onToggleVariableViewer)}
                className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 border-b border-white/10 ${
                  showVariableViewer
                    ? "text-emerald-200 hover:bg-emerald-500/20"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <Eye
                  size={16}
                  className={
                    showVariableViewer ? "text-emerald-400" : "text-gray-400"
                  }
                />
                <span className="font-medium">
                  {showVariableViewer ? "Hide" : "Show"} Inspector
                </span>
              </button>
            )}

            {/* language selector section */}
            {showLanguageSelector && availableLanguages.length > 1 && (
              <div>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
                  Programming Language
                </div>
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
                    <Code
                      size={16}
                      className={
                        lang === selectedLanguage
                          ? "text-blue-400"
                          : "text-gray-500"
                      }
                    />
                    <span className="font-medium">
                      {languageLabels[lang] ||
                        lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </span>
                    {lang === selectedLanguage && (
                      <div className="ml-auto text-blue-400">✓</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* backdrop to close menu */}
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}
    </div>
  );
};

export default MobileMenu;
