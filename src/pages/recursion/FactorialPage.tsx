import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { Calculator, RotateCcw, Shuffle } from "lucide-react";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { factorialCodes } from "@constants/recursion/factorial/factorialCode";
import { factorialIntuition } from "@constants/recursion/factorial/factorialIntuition";
import FactorialVisualizer from "@components/animation/recursion/factorial/FactorialVisualizer";

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

const FactorialPage = () => {
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

  if (algorithmId !== "factorial") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

  // state for factorial input
  const [currentN, setCurrentN] = useState<number>(5);
  const [inputValue, setInputValue] = useState<string>("5");

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

  // input validation and handling
  const handleInputChange = (value: string) => {
    setInputValue(value);
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 8) {
      setCurrentN(num);
    }
  };

  const handleInputSubmit = () => {
    const num = parseInt(inputValue);
    if (!isNaN(num) && num >= 0 && num <= 8) {
      setCurrentN(num);
    } else {
      // reset to valid value
      setInputValue(currentN.toString());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInputSubmit();
    }
  };

  // preset values
  const presetValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const generateRandomN = () => {
    const randomN = Math.floor(Math.random() * 7) + 1; // 1-7
    setCurrentN(randomN);
    setInputValue(randomN.toString());
  };

  const resetToDefault = () => {
    setCurrentN(5);
    setInputValue("5");
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
      <motion.section
        className="max-w-6xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* current input display */}
            <div className="flex-1 w-full">
              <h3 className="text-lg font-semibold text-white mb-4">
                Factorial Input
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm font-medium">
                    Current: factorial({currentN})
                  </span>
                </div>

                {/* visual representation */}
                <motion.div
                  className="flex items-center justify-center gap-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Calculator className="text-purple-300" size={24} />
                  <span className="text-purple-200 font-mono text-xl font-bold">
                    factorial({currentN})
                  </span>
                  <span className="text-gray-400 text-lg">=</span>
                  <span className="text-cyan-200 font-mono text-lg">
                    {currentN === 0 || currentN === 1
                      ? "1"
                      : `${currentN} × factorial(${currentN - 1})`}
                  </span>
                </motion.div>

                {/* mathematical expression */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg">
                    <span className="text-cyan-200 font-mono text-sm">
                      Expected result:{" "}
                      {currentN === 0
                        ? 1
                        : Array.from(
                            { length: currentN },
                            (_, i) => i + 1
                          ).reduce((acc, val) => acc * val, 1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* input controls */}
            <div className="flex flex-col items-center gap-4">
              {/* manual input */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="8"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onBlur={handleInputSubmit}
                  onKeyPress={handleKeyPress}
                  className="w-16 px-3 py-2 bg-white/10 border border-white/30 rounded-lg text-white text-center font-mono focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-colors duration-150"
                />
                <button
                  onClick={handleInputSubmit}
                  className="px-3 py-2 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 text-sm font-medium"
                >
                  Set
                </button>
              </div>

              {/* quick actions */}
              <div className="flex gap-2">
                <button
                  onClick={generateRandomN}
                  className="flex items-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-400/40 rounded-lg text-amber-200 hover:bg-amber-600/30 transition-colors duration-150 font-medium text-xs"
                >
                  <Shuffle size={14} />
                  Random
                </button>
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/30 transition-colors duration-150 font-medium text-xs"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>

              {/* validation info */}
              <div className="text-center">
                <div className="text-gray-400 text-xs">Valid range: 0-8</div>
                <div className="text-cyan-400 font-bold text-lg mt-1">
                  n = {currentN}
                </div>
              </div>
            </div>
          </div>

          {/* preset values */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-white text-sm mb-3 text-center">
              Quick Select:
            </h4>
            <div className="flex justify-center gap-2 flex-wrap">
              {presetValues.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setCurrentN(n);
                    setInputValue(n.toString());
                  }}
                  className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-150 ${
                    currentN === n
                      ? "bg-purple-500/30 border-purple-400/50 text-purple-200"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {n}!
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <FactorialVisualizer
          key={currentN} // re-render when n changes
          initialN={currentN}
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
          title="Factorial Recursion Implementation"
          language={selectedLanguage}
          code={factorialCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={factorialIntuition}
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
              How Recursion Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Each recursive call creates a new stack frame
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                The base case (n ≤ 1) stops the recursion
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Return values bubble back up through the call stack
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Each level multiplies its n by the result from below
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
                  Makes exactly n recursive calls
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(n)</div>
                <div className="text-gray-400 text-xs">
                  Call stack depth grows with input size
                </div>
              </div>
              <div>
                <span className="text-gray-400">Technique:</span>
                <div className="text-purple-400">
                  Recursive Divide & Conquer
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use recursion */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Recursive Approaches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌳</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Tree-like Problems
              </h4>
              <p className="text-gray-300 text-sm">
                When the problem naturally breaks down into smaller identical
                subproblems
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📐</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Mathematical Functions
              </h4>
              <p className="text-gray-300 text-sm">
                For mathematical definitions that reference themselves, like
                factorials or Fibonacci
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎯</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Elegant Solutions
              </h4>
              <p className="text-gray-300 text-sm">
                When the recursive solution is more intuitive and closer to the
                problem definition
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
              Advantages of Recursion
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Clean, readable code that matches problem definition
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Natural for problems with recursive structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Eliminates explicit loop management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Easier to prove correctness mathematically
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
                Stack overflow risk for large inputs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Higher memory usage due to call stack
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                Function call overhead can impact performance
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400 mt-1">•</span>
                May repeat calculations (consider memoization)
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default FactorialPage;
