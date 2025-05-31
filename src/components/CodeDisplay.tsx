import { useState } from "react";
import { ChevronDown, Eye, Lightbulb, X, Menu, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import type { Language, AlgorithmStep } from "../types/algorithm";
import type { AlgorithmIntuition } from "../types/algorithm";
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
  intuitionData?: AlgorithmIntuition;
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
  intuitionData,
}: CodeDisplayProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showIntuition, setShowIntuition] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false); // close mobile menu when language is selected
  };

  const handleMobileMenuAction = (action: () => void) => {
    action();
    setShowMobileMenu(false); // close mobile menu after action
  };

  const currentLanguage = selectedLanguage || language;

  return (
    <motion.div
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* intuition overlay */}
      <AnimatePresence>
        {showIntuition && intuitionData && (
          <>
            {/* background overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden absolute inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowIntuition(false)}
            />

            {/* intuition card */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
                x:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? 20
                    : 0,
                y:
                  typeof window !== "undefined" && window.innerWidth < 1024
                    ? 20
                    : 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
                x:
                  typeof window !== "undefined" && window.innerWidth >= 1024
                    ? 20
                    : 0,
                y:
                  typeof window !== "undefined" && window.innerWidth < 1024
                    ? 20
                    : 0,
              }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-0 lg:inset-4 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              {/* header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-400/30"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Lightbulb size={20} className="text-amber-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      Algorithm Intuition
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {intuitionData.title}
                    </p>
                  </div>
                </div>

                <motion.button
                  onClick={() => setShowIntuition(false)}
                  className="flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
                  whileHover={{ scale: 1.05, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* content */}
              <div
                className="overflow-y-auto"
                style={{ height: "calc(100% - 80px)" }}
              >
                <div className="p-6 space-y-8">
                  {/* description */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5"
                  >
                    <p className="text-gray-300 leading-relaxed">
                      {intuitionData.description}
                    </p>
                  </motion.div>

                  {/* core intuition */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">
                        {intuitionData.intuition.title}
                      </h4>
                    </div>
                    <div className="space-y-3">
                      {intuitionData.intuition.content.map(
                        (paragraph, index) => (
                          <motion.p
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-400/30"
                          >
                            {paragraph}
                          </motion.p>
                        )
                      )}
                    </div>
                  </motion.div>

                  {/* real world analogy */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">
                        {intuitionData.realWorldAnalogy.title}
                      </h4>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {intuitionData.realWorldAnalogy.content}
                    </p>
                  </motion.div>

                  {/* when to use */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <h4 className="text-lg font-semibold text-white">
                        {intuitionData.whenToUse.title}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* use cases */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-emerald-400 uppercase tracking-wide">
                          Best Use Cases
                        </h5>
                        {intuitionData.whenToUse.content.map(
                          (useCase, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="flex items-start gap-3 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg"
                            >
                              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {useCase}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>

                      {/* examples */}
                      <div className="space-y-3">
                        <h5 className="text-sm font-medium text-amber-400 uppercase tracking-wide">
                          Practical Examples
                        </h5>
                        {intuitionData.whenToUse.examples.map(
                          (example, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + index * 0.1 }}
                              className="flex items-start gap-3 p-3 backdrop-blur-md bg-amber-500/10 border border-amber-400/20 rounded-lg"
                            >
                              <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-gray-300 text-sm leading-relaxed">
                                {example}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
          {/* mbile menu button (small screens) */}
          <div className="sm:hidden relative">
            <motion.button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Menu size={18} />
            </motion.button>

            {/* mobile menu dropdown */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 min-w-[200px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  {/* "Show Intuition" option */}
                  {intuitionData && (
                    <motion.button
                      onClick={() =>
                        handleMobileMenuAction(() => setShowIntuition(true))
                      }
                      className="w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center gap-3 text-amber-200 hover:bg-amber-500/20 border-b border-white/10"
                      whileHover={{
                        backgroundColor: "rgba(245, 158, 11, 0.1)",
                      }}
                    >
                      <Lightbulb size={16} className="text-amber-400" />
                      <span className="font-medium">Show Intuition</span>
                    </motion.button>
                  )}

                  {/* "Variable Inspector" option */}
                  {onToggleVariableViewer && (
                    <motion.button
                      onClick={() =>
                        handleMobileMenuAction(onToggleVariableViewer)
                      }
                      className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center gap-3 border-b border-white/10 ${
                        showVariableViewer
                          ? "text-emerald-200 hover:bg-emerald-500/20"
                          : "text-white hover:bg-white/10"
                      }`}
                      whileHover={{
                        backgroundColor: showVariableViewer
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <Eye
                        size={16}
                        className={
                          showVariableViewer
                            ? "text-emerald-400"
                            : "text-gray-400"
                        }
                      />
                      <span className="font-medium">
                        {showVariableViewer ? "Hide" : "Show"} Inspector
                      </span>
                    </motion.button>
                  )}

                  {/* language selector section */}
                  {availableLanguages.length > 1 && (
                    <div>
                      <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
                        Programming Language
                      </div>
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
                          <Code
                            size={16}
                            className={
                              lang === currentLanguage
                                ? "text-blue-400"
                                : "text-gray-500"
                            }
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
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* mobile menu backdrop */}
            {showMobileMenu && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMobileMenu(false)}
              />
            )}
          </div>

          {/* buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* "Show Intuition" button */}
            {intuitionData && (
              <motion.button
                onClick={() => setShowIntuition(true)}
                className="flex items-center gap-2 px-3 py-2 backdrop-blur-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl text-amber-200 hover:from-amber-500/25 hover:to-orange-500/25 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Show Algorithm Intuition"
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Lightbulb size={16} />
                </motion.div>
                <span className="text-sm">Show Intuition</span>
              </motion.button>
            )}

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
