import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import { bfsTraversalCodes } from "@constants/queues/bfs-traversal/bfsTraversalCode";
import { bfsTraversalIntuition } from "@constants/queues/bfs-traversal/bfsTraversalIntuition";
import BfsTraversalVisualizer from "@components/animation/queues/bfs-traversal/BfsTraversalVisualizer";

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

const BfsTraversalPage = () => {
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

  if (algorithmId !== "bfs-traversal") {
    return <Navigate to={`/categories/${categoryId}`} replace />;
  }

  const [selectedLanguage, setSelectedLanguage] = usePersistedLanguage({
    availableLanguages,
  });

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

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <BfsTraversalVisualizer
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
          title="BFS (Level-Order) Traversal Implementation"
          language={selectedLanguage}
          code={bfsTraversalCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={bfsTraversalIntuition}
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
              how the algorithm works
            </h3>
            <ul className="text-gray-300 space-y-2 text-[0.9rem]">
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                start with root node in queue
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                dequeue node and visit it (add to result)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                enqueue all children of current node
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                repeat until queue is empty
              </li>
              <li className="flex items-center gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                fifo ensures level-by-level exploration
              </li>
            </ul>
          </div>

          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              complexity analysis
            </h3>
            <div className="space-y-3 text-[0.9rem]">
              <div>
                <span className="text-gray-400">time complexity:</span>
                <div className="text-white font-mono">O(n)</div>
                <div className="text-gray-400 text-xs">
                  each node visited exactly once
                </div>
              </div>
              <div>
                <span className="text-gray-400">space complexity:</span>
                <div className="text-white font-mono">O(w)</div>
                <div className="text-gray-400 text-xs">
                  w is maximum width of tree (queue size)
                </div>
              </div>
              <div>
                <span className="text-gray-400">data structure:</span>
                <div className="text-cyan-400">queue (fifo)</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* traversal pattern explanation */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            understanding level-order traversal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">0️⃣</span>
              </div>
              <h4 className="text-white font-semibold mb-2">level 0 (root)</h4>
              <p className="text-gray-300 text-sm">
                start at the root node and add it to the queue
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">1️⃣</span>
              </div>
              <h4 className="text-white font-semibold mb-2">level 1</h4>
              <p className="text-gray-300 text-sm">
                process root's direct children from left to right
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">2️⃣</span>
              </div>
              <h4 className="text-white font-semibold mb-2">level 2</h4>
              <p className="text-gray-300 text-sm">
                continue with grandchildren, maintaining left-to-right order
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h4 className="text-white font-semibold mb-2">repeat</h4>
              <p className="text-gray-300 text-sm">
                continue level by level until all nodes are visited
              </p>
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
            real-world applications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🗺️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                shortest path finding
              </h4>
              <p className="text-gray-300 text-sm">
                gps navigation, network routing, and game ai pathfinding use bfs
                for unweighted graphs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌐</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                web crawling & indexing
              </h4>
              <p className="text-gray-300 text-sm">
                search engines like google use bfs to systematically crawl
                websites level by level
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">👥</span>
              </div>
              <h4 className="text-white font-semibold mb-2">social networks</h4>
              <p className="text-gray-300 text-sm">
                finding friends-of-friends, connections within n degrees, and
                recommendation systems
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* queue operations */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            queue operations in bfs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⬅️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">enqueue</h4>
              <p className="text-gray-300 text-sm">
                add children to the rear of queue for later processing
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">👁️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">peek</h4>
              <p className="text-gray-300 text-sm">
                look at the front of queue to see next node to process
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">➡️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">dequeue</h4>
              <p className="text-gray-300 text-sm">
                remove node from front and visit it (add to result)
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔄</span>
              </div>
              <h4 className="text-white font-semibold mb-2">fifo order</h4>
              <p className="text-gray-300 text-sm">
                first in, first out ensures proper level-order traversal
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="text-center">
              <h5 className="text-white text-sm font-semibold mb-2">
                queue behavior pattern
              </h5>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
                <span className="flex items-center gap-1">
                  <span className="text-emerald-400">📥</span>
                  add root
                </span>
                <span className="text-gray-500">→</span>
                <span className="flex items-center gap-1">
                  <span className="text-blue-400">👁️</span>
                  peek front
                </span>
                <span className="text-gray-500">→</span>
                <span className="flex items-center gap-1">
                  <span className="text-purple-400">📤</span>
                  dequeue & visit
                </span>
                <span className="text-gray-500">→</span>
                <span className="flex items-center gap-1">
                  <span className="text-amber-400">⬅️</span>
                  enqueue children
                </span>
                <span className="text-gray-500">→</span>
                <span className="flex items-center gap-1">
                  <span className="text-cyan-400">🔄</span>
                  repeat
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default BfsTraversalPage;
