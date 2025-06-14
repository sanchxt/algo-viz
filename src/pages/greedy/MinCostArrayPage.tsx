import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { minCostCodes } from "@constants/greedy/min-cost-array/minCostCode";
import { minCostIntuition } from "@constants/greedy/min-cost-array/minCostIntuition";
import MinCostVisualizer from "@components/animation/greedy/min-cost-array/MinCostVisualizer";
import MinCostCustomizer from "@components/animation/greedy/MinCostCustomizer";
import MinCostInputModal from "@components/animation/greedy/MinCostInputModal";

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

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const MinCostArrayPage = () => {
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

  if (algorithmId !== "min-cost-array") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

  // state for array input
  const [currentArray, setCurrentArray] = useState<number[]>([3, 1, 4, 2]);
  const [showInputModal, setShowInputModal] = useState(false);

  // state for step tracking and code display integration
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

  const handleArrayChange = (newArray: number[]) => {
    setCurrentArray(newArray);
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 4) + 3; // 3-6 elements
    const randomArray = Array.from(
      { length },
      () => Math.floor(Math.random() * 50) + 1
    );
    setCurrentArray(randomArray);
  };

  const resetToDefault = () => {
    setCurrentArray([3, 1, 4, 2]);
  };

  // calculate expected result
  const expectedResult =
    currentArray.length > 1
      ? (currentArray.length - 1) * Math.min(...currentArray)
      : 0;

  return (
    <>
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
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-purple-100 to-blue-100 bg-clip-text text-transparent"
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

      {/* input customizer */}
      <MinCostCustomizer
        currentArray={currentArray}
        onOpenModal={() => setShowInputModal(true)}
        onGenerateRandom={generateRandomArray}
        onReset={resetToDefault}
        expectedResult={expectedResult}
      />

      {/* input modal */}
      <MinCostInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyArray={handleArrayChange}
        currentArray={currentArray}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <MinCostVisualizer
          key={JSON.stringify(currentArray)} // re-render when array changes
          initialArray={currentArray}
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
          title="Minimum Cost Array Implementation"
          language={selectedLanguage}
          code={minCostCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={minCostIntuition}
        />
      </motion.section>

      {/* algorithm info */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              How Greedy Strategy Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-violet-400 mt-1">•</span>
                Find the minimum element in the array (our "anchor")
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400 mt-1">•</span>
                Always pair this minimum with any other element
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400 mt-1">•</span>
                Remove the larger element, pay cost of smaller (minimum)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400 mt-1">•</span>
                Repeat until only one element remains
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
                  Single pass to find minimum, direct calculation
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(1)</div>
                <div className="text-gray-400 text-xs">
                  Only need to store minimum element
                </div>
              </div>
              <div>
                <span className="text-gray-400">Approach:</span>
                <div className="text-violet-400">Greedy Optimization</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use greedy */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Greedy Approaches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Optimal Substructure
              </h4>
              <p className="text-gray-300 text-sm">
                When local optimal choices lead to global optimal solutions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Efficiency Needed
              </h4>
              <p className="text-gray-300 text-sm">
                When you need fast solutions and can prove greedy choice is
                optimal
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🧮</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Resource Optimization
              </h4>
              <p className="text-gray-300 text-sm">
                For scheduling, resource allocation, and cost minimization
                problems
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* practical considerations */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">✓</span>
              Advantages of Greedy
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Fast execution with linear or near-linear time complexity
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Simple to understand and implement
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Memory efficient with minimal space requirements
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Often provides optimal solutions for well-chosen problems
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠</span>
              Considerations & Limitations
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Not always guaranteed to find optimal solution
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Requires proof that greedy choice leads to optimality
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                May get stuck in local optima for some problems
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Problem structure must support greedy approach
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default MinCostArrayPage;
