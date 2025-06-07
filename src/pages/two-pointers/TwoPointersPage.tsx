import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import TargetCustomizer from "@components/TargetCustomizer";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { getCategoryById } from "@constants/algorithmCategories";
import { twoSumCodes } from "@constants/two-pointers/twoSumCode";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import { twoSumIntuition } from "@constants/two-pointers/twoSumIntuition";
import SearchInputModal from "@components/animation/search/SearchInputModal";
import TwoPointersVisualizer from "@components/animation/two-pointers/TwoPointersVisualizer";

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

const TwoPointersPage = () => {
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

  if (algorithmId !== "two-sum") {
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

  // array and target
  const [currentArray, setCurrentArray] = useState<number[]>([
    2, 3, 6, 7, 8, 11, 15, 17,
  ]);
  const [target, setTarget] = useState<number>(9);
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

  const handleArrayAndTargetUpdate = (
    newArray: number[],
    newTarget: number
  ) => {
    setCurrentArray(newArray);
    setTarget(newTarget);
  };

  return (
    <>
      {/* two sum input modal */}
      <SearchInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyArrayAndTarget={handleArrayAndTargetUpdate}
        currentArray={currentArray}
        currentTarget={target}
        title="Customize Two Sum"
        requiresSorting={true}
        warningMessage="⚠️ Array will be automatically sorted for two pointers approach"
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
      <TargetCustomizer
        currentTarget={target}
        onOpenModal={handleOpenInputModal}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <TwoPointersVisualizer
          initialArray={currentArray}
          target={target}
          onStepChange={handleStepChange}
          selectedLanguage={selectedLanguage}
        />
      </motion.main>

      {/* code display section */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <CodeDisplay
          title="Two Sum Implementation"
          language={selectedLanguage}
          code={twoSumCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={twoSumIntuition}
        />
      </motion.section>

      {/* algorithm info */}
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
                <span className="text-blue-400 mt-1">•</span>
                Sort the array while keeping track of original indices
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Use two pointers at the beginning and end of the array
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Calculate the sum and compare with target
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Move pointers based on sum comparison until target is found
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
                <div className="text-white font-mono">O(n log n)</div>
                <div className="text-gray-400 text-xs">Due to sorting step</div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(n)</div>
                <div className="text-gray-400 text-xs">
                  For sorted array with indices
                </div>
              </div>
              <div>
                <span className="text-gray-400">Technique:</span>
                <div className="text-yellow-400">Two Pointers</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use two pointers */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Two Pointers Technique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Sorted Arrays</h4>
              <p className="text-gray-300 text-sm">
                When you have a sorted array and need to find pairs that meet
                certain criteria
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Optimization</h4>
              <p className="text-gray-300 text-sm">
                When you want to avoid O(n²) brute force approaches and achieve
                O(n) time
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔍</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Pattern Matching
              </h4>
              <p className="text-gray-300 text-sm">
                For problems involving complementary elements, sums, or
                differences
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default TwoPointersPage;
