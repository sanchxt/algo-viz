import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import LinkedListInputModal from "@components/animation/linked-lists/LinkedListInputModal";
import LinkedListCustomizer from "@components/animation/linked-lists/LinkedListCustomizer";
import { reverseLinkedListCodes } from "@constants/linked-lists/reverse-linked-lists/reverseLinkedListCode";
import { reverseLinkedListIntuition } from "@constants/linked-lists/reverse-linked-lists/reverseLinkedListIntuition";
import ReverseLinkedListVisualizer from "@components/animation/linked-lists/reverse-linked-lists/ReverseLinkedListVisualizer";

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

const ReverseLinkedListPage = () => {
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

  if (algorithmId !== "reverse-linked-list") {
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

  // linked list inputs - ensure we always have a valid array
  const [currentValues, setCurrentValues] = useState<number[]>([1, 2, 3, 4, 5]);
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

  const handleValuesUpdate = (newValues: number[]) => {
    // ensure we have a valid array with at least one element
    if (newValues && newValues.length > 0) {
      setCurrentValues([...newValues]); // create new array to ensure re-render
    }
  };

  return (
    <>
      {/* linked list input */}
      <LinkedListInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyValues={handleValuesUpdate}
        currentValues={currentValues}
        title="Customize Linked List"
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
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-cyan-100 to-blue-100 bg-clip-text text-transparent"
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
      <LinkedListCustomizer
        currentValues={currentValues}
        onOpenModal={handleOpenInputModal}
      />

      {/* algo visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <ReverseLinkedListVisualizer
          key={currentValues.join(",")} // re-render when values change
          initialValues={currentValues}
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
          title="Reverse Linked List Implementation"
          language={selectedLanguage}
          code={reverseLinkedListCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={reverseLinkedListIntuition}
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
                <span className="text-cyan-400 mt-1">•</span>
                Initialize three pointers: prev (null), current (head), and next
                (null)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                Store the next node before breaking the link
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                Reverse the current node's link to point to the previous node
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                Move all pointers forward and repeat until the end
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
                  Where n is the number of nodes
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(1)</div>
                <div className="text-gray-400 text-xs">
                  Only uses a constant amount of extra space
                </div>
              </div>
              <div>
                <span className="text-gray-400">Technique:</span>
                <div className="text-cyan-400">Three Pointers</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use three pointers technique */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Three Pointers Technique
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔗</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Link Manipulation
              </h4>
              <p className="text-gray-300 text-sm">
                When you need to modify connections between nodes while
                preserving data integrity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Reversing Operations
              </h4>
              <p className="text-gray-300 text-sm">
                Perfect for reversing linked lists, sublists, or groups of nodes
                in place
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">💾</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Memory Efficiency
              </h4>
              <p className="text-gray-300 text-sm">
                When you need O(1) space complexity without using recursion or
                extra data structures
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default ReverseLinkedListPage;
