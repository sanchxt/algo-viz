import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import CodeDisplay from "@components/CodeDisplay";
import { getCategoryById } from "@constants/algorithmCategories";
import { usePersistedLanguage } from "@hooks/usePersistedLanguage";
import type { Language, EnhancedAlgorithmStep } from "@/types/algorithm";
import GraphCustomizer from "@components/animation/graphs/GraphCustomizer";
import GraphInputModal from "@components/animation/graphs/GraphInputModal";
import { cycleDetectionCodes } from "@constants/graphs/cycle-detection/cycleDetectionCode";
import { cycleDetectionIntuition } from "@constants/graphs/cycle-detection/cycleDetectionIntuition";
import CycleDetectionVisualizer from "@components/animation/graphs/cycle-detection/CycleDetectionVisualizer";

interface GraphNode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

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

const CycleDetectionPage = () => {
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

  if (algorithmId !== "cycle-detection") {
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

  // default graph with a cycle for demonstration
  const [currentNodes, setCurrentNodes] = useState<GraphNode[]>([
    { id: "A", label: "A", position: { x: 100, y: 100 } },
    { id: "B", label: "B", position: { x: 300, y: 100 } },
    { id: "C", label: "C", position: { x: 500, y: 100 } },
    { id: "D", label: "D", position: { x: 200, y: 250 } },
    { id: "E", label: "E", position: { x: 400, y: 250 } },
  ]);

  const [currentEdges, setCurrentEdges] = useState<GraphEdge[]>([
    { id: "AB", from: "A", to: "B" },
    { id: "BC", from: "B", to: "C" },
    { id: "BD", from: "B", to: "D" },
    { id: "DE", from: "D", to: "E" },
    { id: "CE", from: "C", to: "E" }, // this creates a cycle: B-C-E-D-B
  ]);

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

  const handleGraphUpdate = (newNodes: GraphNode[], newEdges: GraphEdge[]) => {
    // ensure we have valid arrays
    if (newNodes && newNodes.length > 0) {
      setCurrentNodes([...newNodes]);
      setCurrentEdges([...newEdges]);
    }
  };

  return (
    <>
      {/* graph input modal */}
      <GraphInputModal
        isOpen={showInputModal}
        onClose={() => setShowInputModal(false)}
        onApplyGraph={handleGraphUpdate}
        currentNodes={currentNodes}
        currentEdges={currentEdges}
        title="Customize Graph Structure"
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
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-orange-100 to-red-100 bg-clip-text text-transparent"
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

      {/* graph customizer */}
      <GraphCustomizer
        currentNodes={currentNodes}
        currentEdges={currentEdges}
        onOpenModal={handleOpenInputModal}
      />

      {/* algorithm visualization */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <CycleDetectionVisualizer
          key={`${currentNodes.map((n) => n.id).join(",")}-${currentEdges
            .map((e) => e.id)
            .join(",")}`} // re-render when graph changes
          initialNodes={currentNodes}
          initialEdges={currentEdges}
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
          title="Cycle Detection Implementation"
          language={selectedLanguage}
          code={cycleDetectionCodes[selectedLanguage]}
          highlightedLines={currentHighlightedLines}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          availableLanguages={availableLanguages}
          languageLabels={languageLabels}
          showVariableViewer={showVariableViewer}
          onToggleVariableViewer={toggleVariableViewer}
          currentStep={currentStep}
          previousStep={previousStep}
          intuitionData={cycleDetectionIntuition}
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
                <span className="text-orange-400 mt-1">•</span>
                Start DFS from any unvisited node in the graph
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Mark current node as visited and explore all neighbors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 mt-1">•</span>
                If a neighbor is visited and not the parent, cycle detected!
              </li>
              <li className="flex items-center gap-2">
                <span className="text-orange-400 mt-1">•</span>
                Handle multiple components by checking all unvisited nodes
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
                <div className="text-white font-mono">O(V + E)</div>
                <div className="text-gray-400 text-xs">
                  Where V = vertices, E = edges
                </div>
              </div>
              <div>
                <span className="text-gray-400">Space Complexity:</span>
                <div className="text-white font-mono">O(V)</div>
                <div className="text-gray-400 text-xs">
                  For visited set and recursion stack
                </div>
              </div>
              <div>
                <span className="text-gray-400">Algorithm:</span>
                <div className="text-orange-400">Depth-First Search</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* when to use cycle detection */}
      <motion.section
        className="mt-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8">
          <h3 className="text-xl font-semibold text-white mb-6 text-center">
            When to Use Cycle Detection
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🔍</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Network Analysis
              </h4>
              <p className="text-gray-300 text-sm">
                Detect circular dependencies, routing loops, or infinite cycles
                in network topologies
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚠️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">
                Deadlock Detection
              </h4>
              <p className="text-gray-300 text-sm">
                Find circular wait conditions in resource allocation or process
                dependency graphs
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <span className="text-white font-bold text-lg">🌲</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Tree Validation</h4>
              <p className="text-gray-300 text-sm">
                Verify that a graph structure is acyclic and forms a valid tree
                or forest
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
                Social Networks
              </h4>
              <p className="text-gray-300 text-xs">
                Detect circular friend relationships or recommendation loops
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-400/20 rounded-xl p-4">
              <h4 className="text-green-200 font-semibold mb-2 text-sm">
                Build Systems
              </h4>
              <p className="text-gray-300 text-xs">
                Find circular dependencies in project builds and imports
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-400/20 rounded-xl p-4">
              <h4 className="text-purple-200 font-semibold mb-2 text-sm">
                Database Design
              </h4>
              <p className="text-gray-300 text-xs">
                Validate foreign key relationships and prevent infinite loops
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-400/20 rounded-xl p-4">
              <h4 className="text-orange-200 font-semibold mb-2 text-sm">
                Game Development
              </h4>
              <p className="text-gray-300 text-xs">
                Detect invalid paths or infinite loops in game map design
              </p>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default CycleDetectionPage;
