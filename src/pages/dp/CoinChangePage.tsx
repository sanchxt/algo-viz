import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import {
  Calculator,
  RotateCcw,
  Shuffle,
  Coins,
  TrendingUp,
  Zap,
} from "lucide-react";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { coinChangeCodes } from "@constants/dp/coin-change/coinChangeCode";
import CoinChangeCustomizer from "@components/animation/dp/CoinChangeCustomizer";
import CoinChangeInputModal from "@components/animation/dp/CoinChangeInputModal";
import { coinChangeIntuition } from "@constants/dp/coin-change/coinChangeIntuition";
import CoinChangeVisualizer from "@/components/animation/dp/coin-change/CoinChangeVisualizer";

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

const CoinChangePage = () => {
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

  if (algorithmId !== "coin-change") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

  // state for coin change problem
  const [currentCoins, setCurrentCoins] = useState<number[]>([1, 3, 4]);
  const [currentAmount, setCurrentAmount] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // handle input modal
  const handleApplyValues = (coins: number[], amount: number) => {
    setCurrentCoins(coins);
    setCurrentAmount(amount);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // quick preset problems
  const generateRandomProblem = () => {
    const presets = [
      { coins: [1, 3, 4], amount: 6 },
      { coins: [2, 5, 10], amount: 12 },
      { coins: [1, 4, 5], amount: 8 },
      { coins: [3, 5], amount: 7 },
      { coins: [1, 2, 5], amount: 11 },
      { coins: [1, 7, 10], amount: 14 },
    ];
    const randomPreset = presets[Math.floor(Math.random() * presets.length)];
    setCurrentCoins(randomPreset.coins);
    setCurrentAmount(randomPreset.amount);
  };

  const resetToDefault = () => {
    setCurrentCoins([1, 3, 4]);
    setCurrentAmount(6);
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
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-yellow-100 to-orange-100 bg-clip-text text-transparent"
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
      <CoinChangeCustomizer
        currentCoins={currentCoins}
        currentAmount={currentAmount}
        onOpenModal={openModal}
      />

      {/* quick actions */}
      <motion.section
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="flex justify-center gap-4">
          <button
            onClick={generateRandomProblem}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 border border-amber-400/40 rounded-lg text-amber-200 hover:bg-amber-600/30 transition-colors duration-150 font-medium text-sm"
          >
            <Shuffle size={16} />
            Random Problem
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600/20 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/30 transition-colors duration-150 font-medium text-sm"
          >
            <RotateCcw size={16} />
            Reset to Default
          </button>
        </div>
      </motion.section>

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <CoinChangeVisualizer
          key={`${currentCoins.join(",")}-${currentAmount}`} // re-render when inputs change
          initialCoins={currentCoins}
          initialAmount={currentAmount}
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
          title="Coin Change Dynamic Programming Implementation"
          language={selectedLanguage}
          code={coinChangeCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={coinChangeIntuition}
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
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="text-blue-400" size={20} />
              How Dynamic Programming Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Build solutions for smaller amounts first (bottom-up)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                For each amount, try every coin denomination
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Use previously computed optimal solutions (memoization)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 mt-1">•</span>
                Choose the option that minimizes total coins needed
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-400" size={20} />
              Complexity Analysis
            </h3>
            <div className="space-y-3 text-[0.9rem]">
              <div>
                <span className="text-gray-400">Time Complexity:</span>
                <div className="text-white font-mono">O(amount × coins)</div>
                <div className="text-gray-400 text-xs">
                  Try each coin for every amount value
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(amount)</div>
                <div className="text-gray-400 text-xs">
                  DP table stores one value per amount
                </div>
              </div>
              <div>
                <span className="text-gray-400">Technique:</span>
                <div className="text-blue-400">
                  Bottom-up Dynamic Programming
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use DP */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
            <Zap className="text-yellow-400" size={24} />
            When to Choose Dynamic Programming
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Overlapping Subproblems
              </h4>
              <p className="text-gray-300 text-sm">
                Same subproblems appear multiple times during recursion, worth
                caching results
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Optimal Substructure
              </h4>
              <p className="text-gray-300 text-sm">
                Optimal solution contains optimal solutions to subproblems
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">❌</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Greedy Fails</h4>
              <p className="text-gray-300 text-sm">
                Local optimal choices don't lead to global optimum
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* DP vs other approaches */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-green-400">✓</span>
              Dynamic Programming
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Always finds optimal solution
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Efficient O(amount × coins) time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Can reconstruct solution path
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Handles any coin system
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-yellow-400">⚠</span>
              Greedy Algorithm
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Very fast O(amount) time
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Simple to implement
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Only works for some coin systems
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                May give suboptimal results
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-red-400">⚠</span>
              Brute Force Recursion
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Always finds optimal solution
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400 mt-1">•</span>
                Natural recursive structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Exponential time complexity
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Recomputes same subproblems
              </li>
            </ul>
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
          <h3 className="text-xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
            <Coins className="text-yellow-400" size={24} />
            Real-World Applications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-semibold mb-2">
                💰 Financial Systems
              </h4>
              <p className="text-gray-300 text-sm">
                ATM cash dispensing, making change with minimum bills, currency
                exchange optimization
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-4">
              <h4 className="text-purple-200 font-semibold mb-2">
                🎮 Game Development
              </h4>
              <p className="text-gray-300 text-sm">
                Experience point systems, skill point allocation, resource
                management in strategy games
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-4">
              <h4 className="text-green-200 font-semibold mb-2">
                📦 Inventory Management
              </h4>
              <p className="text-gray-300 text-sm">
                Minimizing shipping costs, packaging optimization, warehouse
                space allocation
              </p>
            </div>
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-lg p-4">
              <h4 className="text-amber-200 font-semibold mb-2">
                🔢 Mathematical Problems
              </h4>
              <p className="text-gray-300 text-sm">
                Minimum steps to reach a number, perfect square summation,
                Fibonacci variants
              </p>
            </div>
            <div className="bg-cyan-500/10 border border-cyan-400/30 rounded-lg p-4">
              <h4 className="text-cyan-200 font-semibold mb-2">
                🚀 Algorithm Contests
              </h4>
              <p className="text-gray-300 text-sm">
                Classic DP problem in competitive programming, foundation for
                more complex DP solutions
              </p>
            </div>
            <div className="bg-pink-500/10 border border-pink-400/30 rounded-lg p-4">
              <h4 className="text-pink-200 font-semibold mb-2">
                🎯 Optimization Problems
              </h4>
              <p className="text-gray-300 text-sm">
                Unbounded knapsack variants, resource allocation, production
                planning
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* input modal */}
      <CoinChangeInputModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onApplyValues={handleApplyValues}
        currentCoins={currentCoins}
        currentAmount={currentAmount}
      />
    </>
  );
};

export default CoinChangePage;
