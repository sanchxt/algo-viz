import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import HeapCustomizer from "@components/animation/heaps/HeapCustomizer";
import HeapInputModal from "@components/animation/heaps/HeapInputModal";
import { kLargestElementsCodes } from "@constants/heaps/k-largest-elements/kLargestElementsCode";
import { kLargestElementsIntuition } from "@constants/heaps/k-largest-elements/kLargestElementsIntuition";
import KLargestElementsVisualizer from "@components/animation/heaps/k-largest-elements/KLargestElementsVisualizer";

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

const KLargestElementsPage = () => {
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

  if (algorithmId !== "k-largest-elements") {
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

  // default input array and k value
  const [currentArray, setCurrentArray] = useState<number[]>([
    3, 1, 4, 1, 5, 9, 2, 6, 5, 3,
  ]);
  const [currentK, setCurrentK] = useState(4);
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

  const handleInputUpdate = (newArray: number[], newK: number) => {
    // validate inputs
    if (
      newArray &&
      newArray.length > 0 &&
      newK > 0 &&
      newK <= newArray.length
    ) {
      setCurrentArray([...newArray]);
      setCurrentK(newK);
    }
  };

  return (
    <>
      {/* input modal */}
      <HeapInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyInput={handleInputUpdate}
        currentArray={currentArray}
        currentK={currentK}
        title="Customize K Largest Elements Input"
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
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-purple-100 to-emerald-100 bg-clip-text text-transparent"
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
      <HeapCustomizer
        currentArray={currentArray}
        currentK={currentK}
        onOpenModal={handleOpenInputModal}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <KLargestElementsVisualizer
          key={`${currentArray.join(",")}-${currentK}`} // re-render when input changes
          initialArray={currentArray}
          initialK={currentK}
          onStepChange={handleStepChange}
          selectedLanguage={selectedLanguage}
        />
      </motion.main>

      {/* code display */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={sectionVariants}
      >
        <CodeDisplay
          title="K Largest Elements Implementation"
          language={selectedLanguage}
          code={kLargestElementsCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={kLargestElementsIntuition}
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
              How It Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Use a min-heap of size K to maintain the K largest elements
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                If heap size &lt; K, add the element directly
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                If heap is full, compare with minimum (root element)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Replace minimum if current element is larger
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
                <div className="text-white font-mono">O(n log k)</div>
                <div className="text-gray-400 text-xs">
                  Each element: O(log k) operations
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(k)</div>
                <div className="text-gray-400 text-xs">
                  For heap storing k elements
                </div>
              </div>
              <div>
                <span className="text-gray-400">Data Structure:</span>
                <div className="text-purple-400">Min-Heap</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use k largest elements */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use K Largest Elements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Top-K Analytics</h4>
              <p className="text-gray-300 text-sm">
                Find top performers, highest scores, or most expensive items
                from large datasets
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💾</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Memory Efficiency
              </h4>
              <p className="text-gray-300 text-sm">
                Process large datasets with limited memory by maintaining only K
                elements
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🚀</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Streaming Data</h4>
              <p className="text-gray-300 text-sm">
                Process data streams in real-time without storing all elements
                in memory
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* real world applications */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Real-World Applications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 rounded-xl p-4">
              <h4 className="text-blue-200 font-semibold mb-2 text-sm">
                E-commerce
              </h4>
              <p className="text-gray-300 text-xs">
                Find top-selling products, highest-rated items, or most
                expensive goods
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4">
              <h4 className="text-green-200 font-semibold mb-2 text-sm">
                Gaming
              </h4>
              <p className="text-gray-300 text-xs">
                Leaderboards, high scores, top players in massive multiplayer
                games
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-400/20 rounded-xl p-4">
              <h4 className="text-purple-200 font-semibold mb-2 text-sm">
                Social Media
              </h4>
              <p className="text-gray-300 text-xs">
                Trending posts, most-liked content, top influencers by
                engagement
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 rounded-xl p-4">
              <h4 className="text-orange-200 font-semibold mb-2 text-sm">
                Finance
              </h4>
              <p className="text-gray-300 text-xs">
                Best-performing stocks, highest transactions, top investment
                returns
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* algorithm comparison */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            Algorithm Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white font-semibold p-3">
                    Approach
                  </th>
                  <th className="text-left text-white font-semibold p-3">
                    Time Complexity
                  </th>
                  <th className="text-left text-white font-semibold p-3">
                    Space Complexity
                  </th>
                  <th className="text-left text-white font-semibold p-3">
                    Best Use Case
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/10">
                  <td className="p-3 font-medium text-emerald-400">
                    Min-Heap (This)
                  </td>
                  <td className="p-3 font-mono">O(n log k)</td>
                  <td className="p-3 font-mono">O(k)</td>
                  <td className="p-3">k &lt;&lt; n, streaming data</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-3 font-medium">Full Sorting</td>
                  <td className="p-3 font-mono">O(n log n)</td>
                  <td className="p-3 font-mono">O(1)</td>
                  <td className="p-3">When k is close to n</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-3 font-medium">Quick Select</td>
                  <td className="p-3 font-mono">O(n) avg, O(n²) worst</td>
                  <td className="p-3 font-mono">O(1)</td>
                  <td className="p-3">One-time selection</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Max-Heap (all)</td>
                  <td className="p-3 font-mono">O(n log n)</td>
                  <td className="p-3 font-mono">O(n)</td>
                  <td className="p-3">Need all elements sorted</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default KLargestElementsPage;
