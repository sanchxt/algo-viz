import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { Language, AlgorithmStep } from "../types/algorithm";
import CodeDisplay from "../components/CodeDisplay";
import { bubbleSortCodes } from "../constants/bubbleSortCode";
import BubbleSortVisualizer from "../components/animation/BubbleSortVisualizer";

const languageLabels: Record<Language, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  rust: "Rust",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
};

const BubbleSortPage = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>("javascript");
  const [currentHighlightedLines, setCurrentHighlightedLines] = useState<
    number[]
  >([]);
  const [showVariableViewer, setShowVariableViewer] = useState(false);
  const [currentStep, setCurrentStep] = useState<AlgorithmStep | undefined>();
  const [previousStep, setPreviousStep] = useState<AlgorithmStep | undefined>();

  const handleStepChange = (
    highlightedLines: number[],
    stepData?: AlgorithmStep
  ) => {
    setCurrentHighlightedLines(highlightedLines);
    if (stepData) {
      setPreviousStep(currentStep);
      setCurrentStep(stepData);
    }
  };

  const toggleVariableViewer = () => {
    setShowVariableViewer(!showVariableViewer);
  };

  return (
    <>
      {/* navigation */}
      <motion.nav
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-all duration-300 font-medium"
        >
          <motion.span
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            ←
          </motion.span>
          Back to Home
        </Link>
      </motion.nav>

      {/* header */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-blue-100 to-purple-100 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            backgroundSize: "400% 400%",
          }}
        >
          Bubble Sort
        </motion.h1>
        <motion.p
          className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Watch how Bubble Sort compares adjacent elements and swaps them to
          gradually move larger elements to the end of the array.
        </motion.p>
      </motion.header>

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <BubbleSortVisualizer
          onStepChange={handleStepChange}
          selectedLanguage={selectedLanguage}
        />
      </motion.main>

      {/* code display section */}
      <motion.section
        className="mt-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <CodeDisplay
          title="Bubble Sort Implementation"
          language={selectedLanguage}
          code={bubbleSortCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={Object.keys(languageLabels) as Language[]}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
        />
      </motion.section>

      {/* algorithm info */}
      <motion.section
        className="mt-16 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              How It Works
            </h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Compare adjacent elements in the array
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Swap them if they are in the wrong order
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Repeat until no more swaps are needed
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Largest elements "bubble up" to the end
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Complexity
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400">Time Complexity:</span>
                <div className="text-white font-mono">O(n²)</div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(1)</div>
              </div>
              <div>
                <span className="text-gray-400">Stability:</span>
                <div className="text-green-400">Stable</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default BubbleSortPage;
