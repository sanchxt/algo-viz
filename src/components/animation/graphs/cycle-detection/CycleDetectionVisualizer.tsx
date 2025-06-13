import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import CycleDetectionCanvas from "./CycleDetectionCanvas";
import CycleDetectionLegend from "./CycleDetectionLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  CYCLE_DETECTION_ALGORITHM_ID,
  cycleDetectionLineMapping,
} from "@constants/graphs/cycle-detection/cycleDetectionLineMapping";
import { generateCycleDetectionSteps } from "@/algorithms/graphs/cycleDetection";

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

interface CycleDetectionVisualizerProps {
  initialNodes?: GraphNode[];
  initialEdges?: GraphEdge[];
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

// default graph with a cycle for demonstration
const DEFAULT_NODES: GraphNode[] = [
  { id: "A", label: "A", position: { x: 100, y: 100 } },
  { id: "B", label: "B", position: { x: 300, y: 100 } },
  { id: "C", label: "C", position: { x: 500, y: 100 } },
  { id: "D", label: "D", position: { x: 200, y: 250 } },
  { id: "E", label: "E", position: { x: 400, y: 250 } },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { id: "AB", from: "A", to: "B" },
  { id: "BC", from: "B", to: "C" },
  { id: "BD", from: "B", to: "D" },
  { id: "DE", from: "D", to: "E" },
  { id: "CE", from: "C", to: "E" }, // this creates a cycle: B-C-E-D-B
];

const DEFAULT_SPEED = 1000;

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

const CycleDetectionVisualizer = ({
  initialNodes = DEFAULT_NODES,
  initialEdges = DEFAULT_EDGES,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: CycleDetectionVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedNodes = useDebounce(initialNodes, 300);
  const debouncedEdges = useDebounce(initialEdges, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      CYCLE_DETECTION_ALGORITHM_ID,
      cycleDetectionLineMapping
    );
  }, []);

  // generate steps when debounced inputs change
  const generatedSteps = useMemo(() => {
    if (!debouncedNodes || debouncedNodes.length === 0) {
      return [];
    }

    // generate fresh steps each time input changes
    return generateCycleDetectionSteps(debouncedNodes, debouncedEdges);
  }, [debouncedNodes, debouncedEdges]);

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
      case "graph_node_visit":
      case "graph_edge_explore":
      case "graph_cycle_detected":
      case "graph_backtrack":
        stepKey = currentStep.stepType;
        break;
      case "loop_condition":
      case "recursive_call":
        stepKey = currentStep.stepType;
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      CYCLE_DETECTION_ALGORITHM_ID,
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

  // variable configuration
  const variableConfig = useMemo(
    () => [
      {
        key: "graph",
        label: "Graph",
        color: "blue" as const,
        getValue: () =>
          `${debouncedNodes.length} nodes, ${debouncedEdges.length} edges`,
      },
      {
        key: "currentNode",
        label: "Current Node",
        color: "purple" as const,
        getValue: (vars: any) => vars.currentNode || "None",
        condition: (vars: any) => vars.currentNode !== undefined,
      },
      {
        key: "parent",
        label: "Parent Node",
        color: "amber" as const,
        getValue: (vars: any) => vars.parent || "None",
        condition: (vars: any) => vars.parent !== undefined,
      },
      {
        key: "component",
        label: "Component",
        color: "cyan" as const,
        getValue: (vars: any) => `${vars.component || 1}`,
        condition: (vars: any) => vars.component !== undefined,
      },
      {
        key: "result",
        label: "Status",
        color: "emerald" as const,
        getValue: (vars: any) => {
          if (vars.cycleDetected) return "🔴 Cycle Found!";
          if (vars.result === "NO_CYCLE") return "✅ No Cycle";
          if (vars.currentNode) return `Exploring ${vars.currentNode}`;
          return "Searching...";
        },
      },
    ],
    [debouncedNodes.length, debouncedEdges.length]
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
              className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full"
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
            Cycle Detection Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            DFS-based algorithm to detect cycles in undirected graphs
          </p>
        </motion.div>

        {/* graph info display */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-orange-500/20 border border-orange-400/30 rounded-lg px-4 py-2">
            <span className="text-orange-200 text-sm font-bold">
              Graph: {debouncedNodes.length} nodes, {debouncedEdges.length}{" "}
              edges
            </span>
          </div>
          {currentStep?.variables?.cycleDetected && (
            <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2 animate-pulse">
              <span className="text-red-200 text-sm font-bold">
                🔴 Cycle Detected!
              </span>
            </div>
          )}
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
          <CycleDetectionCanvas
            currentStep={currentStep}
            initialNodes={debouncedNodes}
            initialEdges={debouncedEdges}
          />
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
        <CycleDetectionLegend />
      </motion.div>
    </div>
  );
};

export default CycleDetectionVisualizer;
