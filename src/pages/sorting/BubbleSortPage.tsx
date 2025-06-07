// pages/sorting/BubbleSortPage.tsx
import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";

import CodeDisplay from "@components/CodeDisplay";
import ArrayInputModal from "@components/ArrayInputModal";
import ArrayCustomizer from "@components/ArrayCustomizer";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import { bubbleSortCodes } from "@/constants/sorting/bubble-sort/bubbleSortCode";
import { bubbleSortIntuition } from "@/constants/sorting/bubble-sort/bubbleSortIntuition";
import BubbleSortVisualizer from "@components/animation/bubble-sort/BubbleSortVisualizer";

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

const BubbleSortPage = () => {
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

  // for now, we're only handle bubble sort
  if (algorithmId !== "bubble-sort") {
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

  // array customization state
  const [currentArray, setCurrentArray] = useState<number[]>([64, 34, 25]);
  const [showArrayModal, setShowArrayModal] = useState(false);

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

  const handleArrayUpdate = (newArray: number[]) => {
    setCurrentArray(newArray);
  };

  const handleOpenArrayModal = () => {
    setShowArrayModal(true);
  };

  return (
    <>
      {/* array input modal */}
      <ArrayInputModal
        isOpen={showArrayModal}
        onClose={() => setShowArrayModal(false)}
        onApplyArray={handleArrayUpdate}
        currentArray={currentArray}
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

      {/* array customization */}
      <ArrayCustomizer
        currentArray={currentArray}
        onOpenModal={handleOpenArrayModal}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <BubbleSortVisualizer
          initialArray={currentArray}
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
          title="Bubble Sort Implementation"
          language={selectedLanguage}
          code={bubbleSortCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={bubbleSortIntuition}
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
                Compare adjacent elements in the array
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Swap them if they are in the wrong order
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Repeat until no more swaps are needed
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Largest elements "bubble up" to the end
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Complexity
            </h3>
            <div className="space-y-3 text-[0.9rem]">
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
