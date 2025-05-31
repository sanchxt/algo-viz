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
    setShowMobileMenu(false);
  };

  const handleMobileMenuAction = (action: () => void) => {
    action();
    setShowMobileMenu(false);
  };

  const currentLanguage = selectedLanguage || language;

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUpStagger {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intuition-overlay {
          animation: fadeInScale 0.25s ease-out;
        }

        .intuition-content {
          animation: fadeInUp 0.3s ease-out 0.1s both;
        }

        .intuition-item {
          animation: fadeInUpStagger 0.2s ease-out both;
        }

        .intuition-item:nth-child(1) { animation-delay: 0.15s; }
        .intuition-item:nth-child(2) { animation-delay: 0.2s; }
        .intuition-item:nth-child(3) { animation-delay: 0.25s; }
        .intuition-item:nth-child(4) { animation-delay: 0.3s; }
      `}</style>

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
                transition={{ duration: 0.15 }}
                className="lg:hidden absolute inset-0 bg-black/30 z-40"
                onClick={() => setShowIntuition(false)}
              />

              {/* intuition card */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 lg:inset-4 z-50"
              >
                <div className="intuition-overlay h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                  {/* header */}
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-400/30">
                        <Lightbulb size={20} className="text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          Algorithm Intuition
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {intuitionData.title}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowIntuition(false)}
                      className="flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {/* content */}
                  <div
                    className="overflow-y-auto"
                    style={{ height: "calc(100% - 80px)" }}
                  >
                    <div className="intuition-content p-6 space-y-8">
                      {/* description */}
                      <div className="intuition-item backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5">
                        <p className="text-gray-300 leading-relaxed">
                          {intuitionData.description}
                        </p>
                      </div>

                      {/* core intuition */}
                      <div className="intuition-item space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <h4 className="text-lg font-semibold text-white">
                            {intuitionData.intuition.title}
                          </h4>
                        </div>
                        <div className="space-y-3">
                          {intuitionData.intuition.content.map(
                            (paragraph, index) => (
                              <p
                                key={index}
                                className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-400/30"
                              >
                                {paragraph}
                              </p>
                            )
                          )}
                        </div>
                      </div>

                      {/* real world analogy */}
                      <div className="intuition-item backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                          <h4 className="text-lg font-semibold text-white">
                            {intuitionData.realWorldAnalogy.title}
                          </h4>
                        </div>
                        <p className="text-gray-300 leading-relaxed">
                          {intuitionData.realWorldAnalogy.content}
                        </p>
                      </div>

                      {/* when to use */}
                      <div className="intuition-item space-y-4">
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
                            <div className="space-y-2">
                              {intuitionData.whenToUse.content.map(
                                (useCase, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg"
                                  >
                                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {useCase}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* examples */}
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium text-amber-400 uppercase tracking-wide">
                              Practical Examples
                            </h5>
                            <div className="space-y-2">
                              {intuitionData.whenToUse.examples.map(
                                (example, index) => (
                                  <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 backdrop-blur-md bg-amber-500/10 border border-amber-400/20 rounded-lg"
                                  >
                                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                      {example}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
            {/* mobile menu button (small screens) */}
            <div className="sm:hidden relative">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors duration-200"
              >
                <Menu size={18} />
              </button>

              {/* mobile menu dropdown */}
              <AnimatePresence>
                {showMobileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 min-w-[200px] backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl z-50 overflow-hidden"
                  >
                    {/* "Show Intuition" option */}
                    {intuitionData && (
                      <button
                        onClick={() =>
                          handleMobileMenuAction(() => setShowIntuition(true))
                        }
                        className="w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 text-amber-200 hover:bg-amber-500/20 border-b border-white/10"
                      >
                        <Lightbulb size={16} className="text-amber-400" />
                        <span className="font-medium">Show Intuition</span>
                      </button>
                    )}

                    {/* "Variable Inspector" option */}
                    {onToggleVariableViewer && (
                      <button
                        onClick={() =>
                          handleMobileMenuAction(onToggleVariableViewer)
                        }
                        className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 border-b border-white/10 ${
                          showVariableViewer
                            ? "text-emerald-200 hover:bg-emerald-500/20"
                            : "text-white hover:bg-white/10"
                        }`}
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
                      </button>
                    )}

                    {/* language selector section */}
                    {availableLanguages.length > 1 && (
                      <div>
                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-white/10">
                          Programming Language
                        </div>
                        {availableLanguages.map((lang) => (
                          <button
                            key={lang}
                            onClick={() =>
                              handleLanguageSelect(lang as Language)
                            }
                            className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 ${
                              lang === currentLanguage
                                ? "bg-blue-500/20 text-blue-200 border-l-2 border-blue-400"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
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
                              <div className="ml-auto text-blue-400">✓</div>
                            )}
                          </button>
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
                <button
                  onClick={() => setShowIntuition(true)}
                  className="flex items-center gap-2 px-3 py-2 backdrop-blur-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-xl text-amber-200 hover:from-amber-500/25 hover:to-orange-500/25 transition-all duration-200 font-medium"
                  title="Show Algorithm Intuition"
                >
                  <Lightbulb size={16} />
                  <span className="text-sm">Show Intuition</span>
                </button>
              )}

              {/* variable inspector toggle */}
              {onToggleVariableViewer && (
                <button
                  onClick={onToggleVariableViewer}
                  className={`flex items-center gap-2 px-3 py-2 backdrop-blur-md border rounded-xl font-medium transition-all duration-200 ${
                    showVariableViewer
                      ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/25"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/15"
                  }`}
                  title={
                    showVariableViewer
                      ? "Hide Variable Inspector"
                      : "Show Variable Inspector"
                  }
                >
                  <Eye size={16} />
                  <span className="text-sm">
                    {showVariableViewer ? "Hide" : "Show"} Inspector
                  </span>
                </button>
              )}

              {/* language selector */}
              {availableLanguages.length > 1 ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-200 font-medium"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm capitalize">
                      {languageLabels[currentLanguage] || currentLanguage}
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
                            onClick={() =>
                              handleLanguageSelect(lang as Language)
                            }
                            className={`w-full text-left px-4 py-3 text-sm transition-colors duration-150 flex items-center gap-3 ${
                              lang === currentLanguage
                                ? "bg-blue-500/20 text-blue-200 border-l-2 border-blue-400"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full transition-colors duration-150 ${
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
                              <span className="ml-auto text-blue-400">✓</span>
                            )}
                          </button>
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
          <div
            className={`relative ${
              showVariableViewer ? "border-r border-white/10" : ""
            } transition-opacity duration-300`}
          >
            <div className="p-6" style={{ height: "auto", minHeight: "500px" }}>
              <div
                className="transition-opacity duration-200"
                key={currentLanguage}
              >
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
            </div>
          </div>

          {/* variable inspector panel */}
          <VariableInspector
            isOpen={showVariableViewer}
            onClose={onToggleVariableViewer || (() => {})}
            currentStep={currentStep}
            previousStep={previousStep}
          />
        </div>
      </motion.div>
    </>
  );
};

export default CodeDisplay;
