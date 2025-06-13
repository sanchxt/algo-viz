import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import BfsTraversalCanvas from "./BfsTraversalCanvas";
import BfsTraversalLegend from "./BfsTraversalLegend";
import TreeCustomizer from "@/components/animation/trees/TreeCustomizer";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  BFS_TRAVERSAL_ALGORITHM_ID,
  bfsTraversalLineMapping,
} from "@constants/queues/bfs-traversal/bfsTraversalLineMapping";
import {
  generateBfsTraversalSteps,
  EXAMPLE_TREES,
} from "@/algorithms/queues/bfsTraversal";

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
}

interface TreeExample {
  name: string;
  description: string;
  nodes: TreeNode[];
  root: string;
  expectedResult: number[];
}

interface BfsTraversalVisualizerProps {
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_SPEED = 1000;

const TREE_EXAMPLES: TreeExample[] = [
  {
    name: EXAMPLE_TREES.small.name,
    description: "Perfect for understanding level-by-level traversal pattern",
    nodes: EXAMPLE_TREES.small.nodes,
    root: EXAMPLE_TREES.small.root,
    expectedResult: [2, 1, 3], // level-order result for small tree
  },
  {
    name: EXAMPLE_TREES.medium.name,
    description: "Demonstrates queue operations and level completion",
    nodes: EXAMPLE_TREES.medium.nodes,
    root: EXAMPLE_TREES.medium.root,
    expectedResult: [4, 2, 6, 1, 3, 5, 7], // level-order result for medium tree
  },
  {
    name: EXAMPLE_TREES.unbalanced.name,
    description: "Shows BFS behavior with skewed tree structure",
    nodes: EXAMPLE_TREES.unbalanced.nodes,
    root: EXAMPLE_TREES.unbalanced.root,
    expectedResult: [1, 2, 3, 2.5], // level-order result for unbalanced tree
  },
];

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const BfsTraversalVisualizer = ({
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: BfsTraversalVisualizerProps) => {
  const [currentTree, setCurrentTree] = useState<TreeExample>(TREE_EXAMPLES[0]);
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedCurrentTree = useDebounce(currentTree, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      BFS_TRAVERSAL_ALGORITHM_ID,
      bfsTraversalLineMapping
    );
  }, []);

  // generate steps when debounced tree changes
  const generatedSteps = useMemo(() => {
    if (!debouncedCurrentTree || debouncedCurrentTree.nodes.length === 0) {
      return [];
    }

    // generate fresh steps each time tree changes
    return generateBfsTraversalSteps(
      debouncedCurrentTree.nodes,
      debouncedCurrentTree.root
    );
  }, [debouncedCurrentTree]);

  // update steps when generated steps change
  useEffect(() => {
    setIsGenerating(true);

    const updateSteps = () => {
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
      setIsGenerating(false);
    };

    const frameId = requestAnimationFrame(updateSteps);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [generatedSteps]);

  const currentStep = useMemo(() => {
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const highlightedLines = useMemo(() => {
    if (!currentStep) return [];

    let stepKey: string = currentStep.stepType;

    // handle specific step types that might need context
    switch (currentStep.stepType) {
      case "queue_enqueue":
      case "queue_dequeue":
      case "queue_peek":
      case "tree_traversal":
      case "level_complete":
        stepKey = currentStep.stepType;
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      BFS_TRAVERSAL_ALGORITHM_ID,
      stepKey as any,
      selectedLanguage,
      currentStep.stepContext
    );
  }, [currentStep, selectedLanguage]);

  // trigger step change callback when relevant data changes
  useEffect(() => {
    if (currentStep && onStepChange) {
      onStepChange(highlightedLines, currentStep);
    }
  }, [currentStep, highlightedLines, onStepChange]);

  // auto-play
  useEffect(() => {
    if (
      !isAutoPlaying ||
      steps.length === 0 ||
      currentStepIndex >= steps.length - 1
    ) {
      return;
    }

    const currentStepData = steps[currentStepIndex];
    const baseDuration = currentStepData?.timing?.duration || speed;
    const baseDelay = currentStepData?.timing?.delay || 0;

    const adjustedDuration = Math.max(200, baseDuration / playbackSpeed);
    const adjustedDelay = baseDelay / playbackSpeed;

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, adjustedDuration + adjustedDelay);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, speed, isAutoPlaying, playbackSpeed]);

  // control functions
  const goToPreviousStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
    setIsAutoPlaying(false);
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const toggleAutoPlay = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsAutoPlaying(true);
    } else {
      setIsAutoPlaying((prev) => !prev);
    }
  }, [currentStepIndex, steps.length]);

  const resetAnimation = useCallback(() => {
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, []);

  const handleSpeedChange = useCallback((newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
  }, []);

  const handleTreeChange = useCallback((tree: TreeExample) => {
    setCurrentTree(tree);
  }, []);

  // variable configuration for BFS
  const variableConfig = useMemo(
    () => [
      {
        key: "tree",
        label: "Tree",
        color: "blue" as const,
        getValue: () =>
          `${currentTree.name} (${currentTree.nodes.length} nodes)`,
      },
      {
        key: "currentLevel",
        label: "Current Level",
        color: "purple" as const,
        getValue: (vars: any) => `Level ${vars.currentLevel || 0}`,
        condition: (vars: any) => vars.currentLevel !== undefined,
      },
      {
        key: "queueSize",
        label: "Queue Size",
        color: "amber" as const,
        getValue: (vars: any) => `${vars.queueSize || 0} nodes`,
        condition: (vars: any) => vars.queueSize !== undefined,
      },
      {
        key: "progress",
        label: "Progress",
        color: "emerald" as const,
        getValue: (vars: any) => {
          if (vars.isComplete) return "✓ BFS Complete!";
          if (vars.frontNode) return `Processing: ${vars.frontNode}`;
          if (vars.levelProgress) return `Level: ${vars.levelProgress}`;
          if (vars.action) {
            const actionMap = {
              enqueue: "🔵 Enqueuing node",
              dequeue: "🟢 Dequeuing node",
              peek: "👁️ Peeking at queue",
            };
            return (
              actionMap[vars.action as keyof typeof actionMap] ||
              "Processing..."
            );
          }
          return "Initializing...";
        },
      },
      {
        key: "result",
        label: "Current Result",
        color: "cyan" as const,
        getValue: (vars: any) => {
          if (vars.finalResult) return `[${vars.finalResult.join(", ")}]`;
          if (vars.resultLength !== undefined)
            return `${vars.resultLength} values added`;
          return "[]";
        },
        condition: (vars: any) =>
          vars.resultLength !== undefined || vars.finalResult,
      },
      {
        key: "levelInfo",
        label: "Level Info",
        color: "red" as const,
        getValue: (vars: any) => {
          if (vars.totalLevels !== undefined)
            return `${vars.totalLevels} levels total`;
          if (vars.nodesInLevel !== undefined)
            return `${vars.nodesInLevel} nodes in level`;
          if (vars.completedLevel !== undefined)
            return `Level ${vars.completedLevel} done`;
          return "";
        },
        condition: (vars: any) =>
          vars.totalLevels !== undefined ||
          vars.nodesInLevel !== undefined ||
          vars.completedLevel !== undefined,
      },
    ],
    [currentTree]
  );

  // loading state
  const isLoading = isGenerating || steps.length === 0 || !currentStep;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* tree customizer */}
      <TreeCustomizer
        currentTree={currentTree}
        onTreeChange={handleTreeChange}
        availableTrees={TREE_EXAMPLES}
      />

      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* header */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            BFS (Level-Order) Tree Traversal Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Iterative traversal using Queue: Level by Level
          </p>
        </motion.div>

        {/* tree info display */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-cyan-500/20 border border-cyan-400/30 rounded-lg px-4 py-2">
            <span className="text-cyan-200 text-sm font-bold">
              Tree: {currentTree.name}
            </span>
          </div>
          <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <span className="text-blue-200 text-sm font-bold">
              Expected: [{currentTree.expectedResult.join(", ")}]
            </span>
          </div>
        </motion.div>

        {/* playback controls */}
        <PlaybackControls
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          playbackSpeed={playbackSpeed}
          onPreviousStep={goToPreviousStep}
          onNextStep={goToNextStep}
          onToggleAutoPlay={toggleAutoPlay}
          onReset={resetAnimation}
          onSpeedChange={handleSpeedChange}
        />

        {/* visualization canvas */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <BfsTraversalCanvas currentStep={currentStep} />
        </motion.div>

        {/* step information */}
        <StepInformation
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          variableConfig={variableConfig}
        />

        {/* legend */}
        <BfsTraversalLegend />
      </motion.div>
    </div>
  );
};

export default BfsTraversalVisualizer;
