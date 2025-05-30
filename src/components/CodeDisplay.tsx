import { useState } from "react";
import { ChevronDown, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { Language, AlgorithmStep } from "../types/algorithm";
import VariableInspector from "./VariableInspector";

interface CodeDisplayProps {
  title?: string;
  language?: string;
  code: string;
  highlightedLines?: number[];
  selectedLanguage?: string;
  onLanguageChange?: (language: Language) => void;
  availableLanguages?: string[];
  languageLabels?: Record<string, string>;
  showVariableViewer?: boolean;
  onToggleVariableViewer?: () => void;
  currentStep?: AlgorithmStep;
  previousStep?: AlgorithmStep;
}

const CodeDisplay = ({
  title = "Code",
  language = "javascript",
  code,
  highlightedLines = [],
  selectedLanguage = language,
  onLanguageChange,
  availableLanguages = [language as Language],
  languageLabels = {
    [language]: language.charAt(0).toUpperCase() + language.slice(1),
  },
  showVariableViewer = false,
  onToggleVariableViewer,
  currentStep,
  previousStep,
}: CodeDisplayProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const customStyle = {
    ...oneDark,
    'pre[class*="language-"]': {
      ...oneDark['pre[class*="language-"]'],
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "16px",
      padding: "1.5rem",
      margin: 0,
    },
    'code[class*="language-"]': {
      ...oneDark['code[class*="language-"]'],
      background: "transparent",
      fontSize: "14px",
      lineHeight: "1.6",
    },
  };

  const handleLanguageSelect = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    setIsDropdownOpen(false);
  };

  const currentLanguage = selectedLanguage || language;

  return (
    <motion.div
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* header */}
      <motion.div
        className="flex items-center justify-between p-6 border-b border-white/10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          {title}
        </h3>

        <div className="flex items-center gap-3">
          {/* variable inspector toggle */}
          {onToggleVariableViewer && (
            <motion.button
              onClick={onToggleVariableViewer}
              className={`flex items-center gap-2 px-3 py-2 backdrop-blur-md border rounded-xl font-medium transition-all duration-300 ${
                showVariableViewer
                  ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/25"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/15"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={
                showVariableViewer
                  ? "Hide Variable Inspector"
                  : "Show Variable Inspector"
              }
            >
              <motion.div
                animate={{ rotate: showVariableViewer ? 360 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <Eye size={16} />
              </motion.div>
              <span className="text-sm">
                {showVariableViewer ? "Hide" : "Show"} Inspector
              </span>
            </motion.button>
          )}

          {/* language selector */}
          {availableLanguages.length > 1 ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm capitalize">
                  {languageLabels[currentLanguage] || currentLanguage}
                </span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 min-w-[140px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {availableLanguages.map((lang) => (
                      <motion.button
                        key={lang}
                        onClick={() => handleLanguageSelect(lang as Language)}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center gap-3 ${
                          lang === currentLanguage
                            ? "bg-blue-500/20 text-blue-200 border-l-2 border-blue-400"
                            : "text-gray-300 hover:bg-white/10 hover:text-white"
                        }`}
                        whileHover={{
                          backgroundColor:
                            lang === currentLanguage
                              ? undefined
                              : "rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            lang === currentLanguage
                              ? "bg-blue-400"
                              : "bg-gray-500"
                          }`}
                        />
                        <span className="font-medium">
                          {languageLabels[lang] ||
                            lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </span>
                        {lang === currentLanguage && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-auto text-blue-400"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {isDropdownOpen && (
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200 text-sm font-medium capitalize">
                {languageLabels[currentLanguage] || currentLanguage}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* content area */}
      <div
        className={`${
          showVariableViewer ? "grid grid-cols-1 lg:grid-cols-2" : ""
        }`}
      >
        {/* code panel */}
        <motion.div
          className={`relative ${
            showVariableViewer ? "border-r border-white/10" : ""
          }`}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          key={currentLanguage}
        >
          <div className="p-6" style={{ height: "auto", minHeight: "500px" }}>
            <SyntaxHighlighter
              language={currentLanguage}
              style={customStyle}
              showLineNumbers={true}
              lineNumberStyle={{
                color: "rgba(156, 163, 175, 0.5)",
                fontSize: "12px",
                minWidth: "2.5em",
                paddingRight: "1em",
              }}
              wrapLines={true}
              lineProps={(lineNumber) => {
                const isHighlighted = highlightedLines.includes(lineNumber);
                const isPrimary =
                  highlightedLines.length > 0 &&
                  highlightedLines[0] === lineNumber;

                return {
                  style: {
                    display: "block",
                    backgroundColor: isHighlighted
                      ? isPrimary
                        ? "rgba(59, 130, 246, 0.3)"
                        : "rgba(59, 130, 246, 0.15)"
                      : "transparent",
                    borderLeft: isHighlighted
                      ? isPrimary
                        ? "4px solid rgb(59, 130, 246)"
                        : "3px solid rgba(59, 130, 246, 0.7)"
                      : "3px solid transparent",
                    paddingLeft: "0.5rem",
                    paddingRight: "2rem",
                    transition: "all 0.3s ease",
                    marginLeft: isHighlighted ? "2px" : "0px",
                    minWidth: "100%",
                    width: "max-content",
                    boxSizing: "border-box",
                  },
                };
              }}
            >
              {code}
            </SyntaxHighlighter>
          </div>
        </motion.div>

        {/* variable inspector panel */}
        <VariableInspector
          isOpen={showVariableViewer}
          onClose={onToggleVariableViewer || (() => {})}
          currentStep={currentStep}
          previousStep={previousStep}
        />
      </div>
    </motion.div>
  );
};

export default CodeDisplay;
