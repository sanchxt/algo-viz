import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, Lightbulb, Menu } from "lucide-react";

import Intuition from "./Intuition";
import MobileMenu from "./MobileMenu";
import LanguageSelector from "./LanguageSelector";
import VariableInspector from "./VariableInspector";
import CodeSyntaxHighlighter from "./CodeSyntaxHighlighter";
import type {
  AlgorithmIntuition,
  Language,
  EnhancedAlgorithmStep,
} from "@/types/algorithm";

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
  currentStep?: EnhancedAlgorithmStep;
  previousStep?: EnhancedAlgorithmStep;
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
  const [showIntuition, setShowIntuition] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLanguageSelect = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const currentLanguage = selectedLanguage || language;

  return (
    <motion.div
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* algorithm intuition component */}
      {intuitionData && (
        <Intuition
          isOpen={showIntuition}
          onClose={() => setShowIntuition(false)}
          intuitionData={intuitionData}
        />
      )}

      {/* Header */}
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
          <button
            onClick={() => setShowMobileMenu(true)}
            className="sm:hidden flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors duration-200"
          >
            <Menu size={18} />
          </button>

          {/* mobile menu */}
          <MobileMenu
            isOpen={showMobileMenu}
            onClose={() => setShowMobileMenu(false)}
            showVariableViewer={showVariableViewer}
            onToggleVariableViewer={onToggleVariableViewer}
            onShowIntuition={() => setShowIntuition(true)}
            selectedLanguage={currentLanguage}
            availableLanguages={availableLanguages}
            languageLabels={languageLabels}
            onLanguageChange={handleLanguageSelect}
            showIntuitionOption={!!intuitionData}
            showVariableViewerOption={!!onToggleVariableViewer}
            showLanguageSelector={availableLanguages.length > 1}
          />

          {/* desktop Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* show intuition button */}
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
            <LanguageSelector
              selectedLanguage={currentLanguage}
              availableLanguages={availableLanguages}
              languageLabels={languageLabels}
              onLanguageChange={handleLanguageSelect}
            />
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
            <CodeSyntaxHighlighter
              code={code}
              language={currentLanguage}
              highlightedLines={highlightedLines}
              showLineNumbers={true}
            />
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
  );
};

export default CodeDisplay;
