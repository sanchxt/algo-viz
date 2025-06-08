import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";

import ReverseLinkedListCanvas from "./ReverseLinkedListCanvas";
import ReverseLinkedListLegend from "./ReverseLinkedListLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  REVERSE_LINKED_LIST_ALGORITHM_ID,
  reverseLinkedListLineMapping,
} from "@constants/linked-lists/reverse-linked-lists/reverseLinkedListLineMapping";
import { generateReverseLinkedListSteps } from "@/algorithms/linked-lists/reverseLinkedList";

interface ReverseLinkedListVisualizerProps {
  initialValues?: number[];
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_VALUES = [1, 2, 3, 4, 5];
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

const ReverseLinkedListVisualizer = ({
  initialValues = DEFAULT_VALUES,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: ReverseLinkedListVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  const debouncedInitialValues = useDebounce(initialValues, 300);

  // register line mapping once on mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      REVERSE_LINKED_LIST_ALGORITHM_ID,
      reverseLinkedListLineMapping
    );
  }, []);

  // generate steps when debounced values change
  const generatedSteps = useMemo(() => {
    if (!debouncedInitialValues || debouncedInitialValues.length === 0) {
      return [];
    }

    // generate fresh steps each time input changes
    return generateReverseLinkedListSteps(debouncedInitialValues);
  }, [debouncedInitialValues]);

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
      case "pointer_initialization":
      case "pointer_update":
      case "link_reversal":
      case "node_traversal":
        stepKey = currentStep.stepType;
        break;
    }

    return algorithmLineResolver.getHighlightedLines(
      REVERSE_LINKED_LIST_ALGORITHM_ID,
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
        key: "list",
        label: "Original List",
        color: "blue" as const,
        getValue: () => `[${debouncedInitialValues.join(" → ")}]`,
      },
      {
        key: "pointers",
        label: "Pointers",
        color: "purple" as const,
        getValue: (vars: any) =>
          `prev: ${vars.prev || "null"}, current: ${
            vars.current || "null"
          }, next: ${vars.next || "null"}`,
        condition: (vars: any) =>
          vars.prev !== undefined || vars.current !== undefined,
      },
      {
        key: "iteration",
        label: "Iteration",
        color: "amber" as const,
        getValue: (vars: any) => `${vars.iteration || 0}`,
        condition: (vars: any) => vars.iteration !== undefined,
      },
      {
        key: "result",
        label: "Status",
        color: "emerald" as const,
        getValue: (vars: any) => {
          if (vars.newHead) return `✓ Reversed! New head: ${vars.newHead}`;
          if (vars.currentValue) return `Processing node: ${vars.currentValue}`;
          return "Initializing...";
        },
      },
    ],
    [debouncedInitialValues]
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
              className="w-3 h-3 bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-500))] rounded-full"
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
            Reverse Linked List Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Use three pointers to reverse links iteratively
          </p>
        </motion.div>

        {/* input display - memoized to prevent recreation */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <span className="text-blue-200 text-sm font-bold">
              List: [{debouncedInitialValues.join(" → ")}]
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
          <ReverseLinkedListCanvas
            currentStep={currentStep}
            initialValues={debouncedInitialValues}
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
        <ReverseLinkedListLegend />
      </motion.div>
    </div>
  );
};

export default ReverseLinkedListVisualizer;
