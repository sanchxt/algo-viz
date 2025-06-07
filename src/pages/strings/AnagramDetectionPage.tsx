import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import StringInputModal from "@components/animation/strings/StringInputModal";
import StringCustomizer from "@components/animation/strings/StringCustomizer";
import { anagramDetectionCodes } from "@constants/strings/anagram-detection/anagramDetectionCode";
import { anagramDetectionIntuition } from "@constants/strings/anagram-detection/anagramDetectionIntuition";
import AnagramDetectionVisualizer from "@components/animation/strings/anagram-detection/AnagramDetectionVisualizer";

const languageLabels: Record<Language, string> = {
  cpp: "C++",
  python: "Python",
  java: "Java",
  rust: "Rust",
  javascript: "JavaScript",
  typescript: "TypeScript",
  go: "Go",
};

const availableLanguages = Object.keys(languageLabels) as Language[];

const AnagramDetectionPage = () => {
  const { categoryId, algorithmId } = useParams<{
    categoryId: string;
    algorithmId: string;
  }>();

  // validate route parameters
  if (!categoryId || !algorithmId) {
    return <Navigate to="/" replace />;
  }

  // validate that the algorithm exists in the category
  const category = getCategoryById(categoryId);
  if (!category) {
    return <Navigate to="/" replace />;
  }

  const algorithm = category.algorithms.find((alg) => alg.id === algorithmId);
  if (!algorithm) {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  if (algorithmId !== "anagram-detection") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

  const [currentHighlightedLines, setCurrentHighlightedLines] = useState<
    number[]
  >([]);
  const [showVariableViewer, setShowVariableViewer] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    EnhancedAlgorithmStep | undefined
  >();
  const [previousStep, setPreviousStep] = useState<
    EnhancedAlgorithmStep | undefined
  >();

  // string inputs
  const [currentString1, setCurrentString1] = useState<string>("listen");
  const [currentString2, setCurrentString2] = useState<string>("silent");
  const [showInputModal, setShowInputModal] = useState(false);

  // receive highlighted lines from visualizer
  const handleStepChange = (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
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

  const handleOpenInputModal = () => {
    setShowInputModal(true);
  };

  const handleStringUpdate = (newString1: string, newString2: string) => {
    setCurrentString1(newString1);
    setCurrentString2(newString2);
  };

  return (
    <>
      {/* string input modal */}
      <StringInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyStrings={handleStringUpdate}
        currentString1={currentString1}
        currentString2={currentString2}
        title="Customize Anagram Strings"
      />

      {/* navigation */}
      <motion.nav
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300 font-medium text-sm"
          >
            <motion.span
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              ←
            </motion.span>
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to={`/categories/${categoryId}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300 font-medium text-sm"
          >
            {category.name}
          </Link>
        </div>
      </motion.nav>

      {/* header */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-pink-100 to-purple-100 bg-clip-text text-transparent"
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
          {algorithm.name}
        </motion.h1>
        <motion.p
          className="text-gray-300 max-w-2xl mx-auto leading-relaxed italic"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {algorithm.description}
        </motion.p>
      </motion.header>

      {/* custom input */}
      <StringCustomizer
        currentString1={currentString1}
        currentString2={currentString2}
        onOpenModal={handleOpenInputModal}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <AnagramDetectionVisualizer
          initialString1={currentString1}
          initialString2={currentString2}
          onStepChange={handleStepChange}
          selectedLanguage={selectedLanguage}
        />
      </motion.main>

      {/* code display */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <CodeDisplay
          title="Anagram Detection Implementation"
          language={selectedLanguage}
          code={anagramDetectionCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={anagramDetectionIntuition}
        />
      </motion.section>

      {/* Algorithm info */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              How It Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-pink-400 mt-1">•</span>
                Normalize both strings by converting to lowercase and removing
                spaces
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400 mt-1">•</span>
                Check if strings have the same length (early optimization)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400 mt-1">•</span>
                Count character frequencies in both strings using hash maps
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-400 mt-1">•</span>
                Compare frequency maps to determine if strings are anagrams
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Complexity Analysis
            </h3>
            <div className="space-y-3 text-[0.9rem]">
              <div>
                <span className="text-gray-400">Time Complexity:</span>
                <div className="text-white font-mono">O(n)</div>
                <div className="text-gray-400 text-xs">
                  Where n is string length
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(k)</div>
                <div className="text-gray-400 text-xs">
                  Where k is number of unique characters
                </div>
              </div>
              <div>
                <span className="text-gray-400">Technique:</span>
                <div className="text-pink-400">Frequency Counting</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* When to use frequency counting */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Frequency Counting Technique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Character Analysis
              </h4>
              <p className="text-gray-300 text-sm">
                When you need to analyze character distributions, patterns, or
                frequencies in text
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Permutation Problems
              </h4>
              <p className="text-gray-300 text-sm">
                When checking if strings are rearrangements of each other
                without generating permutations
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Pattern Matching
              </h4>
              <p className="text-gray-300 text-sm">
                For word games, linguistic analysis, and text processing
                applications
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default AnagramDetectionPage;
