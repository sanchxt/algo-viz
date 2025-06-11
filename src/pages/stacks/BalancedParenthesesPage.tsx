import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";
import { Edit3 } from "lucide-react";

import CodeDisplay from "@components/CodeDisplay";
import SingleStringInputModal from "@components/animation/stacks/SingleStringInputModal";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { balancedParenthesesCodes } from "@constants/stacks/balanced-parentheses/balancedParenthesesCode";
import { balancedParenthesesIntuition } from "@constants/stacks/balanced-parentheses/balancedParenthesesIntuition";
import BalancedParenthesesVisualizer from "@components/animation/stacks/balanced-parenthesis/BalancedParenthesesVisualizer";

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

const BalancedParenthesesPage = () => {
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

  if (algorithmId !== "balanced-parentheses") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

  // state for input string
  const [currentInput, setCurrentInput] = useState<string>("()[]{}");
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

  const handleOpenInputModal = () => {
    setShowInputModal(true);
  };

  const handleInputUpdate = (newInput: string) => {
    setCurrentInput(newInput);
  };

  return (
    <>
      {/* string input modal */}
      <SingleStringInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyString={handleInputUpdate}
        currentInput={currentInput}
        title="Customize Bracket String"
        placeholder="Enter brackets: () [] {}"
        maxLength={20}
        validationPattern={/^[()[\]{}]*$/}
        validationMessage="Only brackets allowed: ( ) [ ] { }"
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
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Input String
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-gray-300 text-[0.9rem]">Current:</span>
              <div className="flex items-center gap-1">
                {currentInput.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`font-mono text-lg font-bold px-2 py-1 rounded border ${
                      ["(", ")"].includes(char)
                        ? "text-blue-200 border-blue-400/30 bg-blue-500/20"
                        : ["[", "]"].includes(char)
                        ? "text-emerald-200 border-emerald-400/30 bg-emerald-500/20"
                        : ["{", "}"].includes(char)
                        ? "text-purple-200 border-purple-400/30 bg-purple-500/20"
                        : "text-gray-200 border-gray-400/30 bg-gray-500/20"
                    }`}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">
                Length: {currentInput.length}/20
              </span>
              <span className="text-gray-400 text-sm">•</span>
              <span className="text-cyan-400 text-sm font-medium">
                Brackets: ( ) [ ] {}
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenInputModal}
            className="flex items-center gap-2 px-4 py-2 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-400/30 rounded-lg text-purple-100 font-semibold hover:from-purple-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <Edit3 size={16} />
            Customize Input
          </button>
        </div>
      </motion.section>

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <BalancedParenthesesVisualizer
          key={currentInput} // re-render when input changes
          initialInput={currentInput}
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
          title="Balanced Parentheses Implementation"
          language={selectedLanguage}
          code={balancedParenthesesCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={balancedParenthesesIntuition}
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
              How the Algorithm Works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Scan each character from left to right
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Push opening brackets onto the stack
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                For closing brackets, check if they match the stack top
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Pop matching opening brackets when found
              </li>
              <li className="flex items-center gap-2">
                <span className="text-purple-400 mt-1">•</span>
                Valid if stack is empty at the end
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
                  Single pass through the input string
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(n)</div>
                <div className="text-gray-400 text-xs">
                  Stack can grow up to n elements in worst case
                </div>
              </div>
              <div>
                <span className="text-gray-400">Data Structure:</span>
                <div className="text-purple-400">Stack (LIFO)</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* real-world applications */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💻</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Code Editors & IDEs
              </h4>
              <p className="text-gray-300 text-sm">
                Syntax highlighting, bracket matching, and error detection in
                programming languages
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚙️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Compilers & Parsers
              </h4>
              <p className="text-gray-300 text-sm">
                Lexical analysis, syntax validation, and parsing in programming
                language compilers
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">📐</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Mathematical Expressions
              </h4>
              <p className="text-gray-300 text-sm">
                Validating mathematical formulas, equation parsing, and
                calculator applications
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* stack advantages */}
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
              Why Use a Stack?
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                LIFO naturally matches nested bracket structure
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Efficient O(1) push and pop operations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Simple and intuitive algorithm design
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 mt-1">•</span>
                Easy to extend for multiple bracket types
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-amber-400">💡</span>
              Key Insights
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-amber-400 mt-1">•</span>
                Most recently opened bracket must be first to close
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 mt-1">•</span>
                Stack tracks "unmatched" opening brackets
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 mt-1">•</span>
                Empty stack at end means perfect balance
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-400 mt-1">•</span>
                Order matters: proper nesting is required
              </li>
            </ul>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default BalancedParenthesesPage;
