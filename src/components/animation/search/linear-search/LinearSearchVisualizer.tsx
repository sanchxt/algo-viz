import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import { generateLinearSearchSteps } from "@/algorithms/searching/linearSearch";

import LinearSearchCanvas from "./LinearSearchCanvas";
import LinearSearchLegend from "./LinearSearchLegend";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";
import {
  LINEAR_SEARCH_ALGORITHM_ID,
  linearSearchLineMapping,
} from "@constants/search/linear-search/linearSearchLineMapping";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";

interface LinearSearchVisualizerProps {
  initialArray?: number[];
  target?: number;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_INITIAL_ARRAY = [64, 34, 25, 12, 22, 11, 90];
const DEFAULT_TARGET = 22;
const DEFAULT_SPEED = 1000;

const LinearSearchVisualizer = ({
  initialArray = DEFAULT_INITIAL_ARRAY,
  target = DEFAULT_TARGET,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: LinearSearchVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal speed

  // register line mapping on component mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      LINEAR_SEARCH_ALGORITHM_ID,
      linearSearchLineMapping
    );
  }, []);

  // generate linear search steps when array or target changes
  useEffect(() => {
    if (initialArray.length > 0) {
      const linearSearchSteps = generateLinearSearchSteps(initialArray, target);
      setSteps(linearSearchSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    }
  }, [initialArray, target]);

  // handle step changes and line highlighting
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex] && onStepChange) {
      const currentStep = steps[currentStepIndex];

      // handle context-specific line highlighting
      let stepKey: string = currentStep.stepType;

      // handle specific return cases based on found status
      if (currentStep.stepType === "return" && currentStep.variables) {
        if (currentStep.variables.found === true) {
          stepKey = "return_found";
        } else if (currentStep.variables.found === false) {
          stepKey = "return_not_found";
        }
      }

      const highlightedLines = algorithmLineResolver.getHighlightedLines(
        LINEAR_SEARCH_ALGORITHM_ID,
        stepKey as any,
        selectedLanguage,
        currentStep.stepContext
      );

      onStepChange(highlightedLines, currentStep);
    }
  }, [currentStepIndex, steps, selectedLanguage, onStepChange]);

  // auto-play
  useEffect(() => {
    if (
      !isAutoPlaying ||
      steps.length === 0 ||
      currentStepIndex >= steps.length - 1
    ) {
      return;
    }

    // use timing from the current step if available, but apply playback speed multiplier
    const currentStep = steps[currentStepIndex];
    const baseDuration = currentStep.timing?.duration || speed;
    const baseDelay = currentStep.timing?.delay || 0;

    // apply playback speed: higher playbackSpeed = faster
    const adjustedDuration = baseDuration / playbackSpeed;
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
      // if at the end, restart from beginning
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

  const handleSpeedChange = (newSpeed: number) => {
    setPlaybackSpeed(newSpeed);
  };

  // loading state
  if (steps.length === 0 || !steps[currentStepIndex]) {
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

  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* header */}
        <motion.div
          className="text-center mb-8 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-3">
            Linear Search Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Check each element sequentially until target is found
          </p>
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
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <LinearSearchCanvas
            currentStep={currentStep}
            initialArray={initialArray}
            target={target}
          />
        </motion.div>

        {/* step information */}
        <StepInformation
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          variableConfig={[
            {
              key: "currentIndex",
              label: "Current Index",
              color: "blue",
              getValue: (vars) => vars.currentIndex ?? "N/A",
              condition: (vars) => vars.currentIndex !== undefined,
            },
            {
              key: "elementsChecked",
              label: "Elements Checked",
              color: "emerald",
              getValue: (vars) => Math.max(0, (vars.currentIndex ?? 0) + 1),
              condition: (vars) =>
                vars.currentIndex !== undefined && vars.currentIndex >= 0,
            },
            {
              key: "elementsRemaining",
              label: "Elements Remaining",
              color: "amber",
              getValue: (vars) => {
                const totalLength = vars.length ?? 0;
                const currentIdx = vars.currentIndex ?? -1;
                return Math.max(0, totalLength - currentIdx - 1);
              },
              condition: (vars) =>
                vars.currentIndex !== undefined && vars.length !== undefined,
            },
            {
              key: "currentElement",
              label: "Current Element",
              color: "purple",
              getValue: (vars) => vars.currentElement ?? "N/A",
              condition: (vars) => vars.currentElement !== undefined,
            },
            {
              key: "foundStatus",
              label: "Status",
              color: "cyan",
              getValue: (vars) => {
                if (vars.found === true) return "Found!";
                if (vars.found === false) return "Not Found";
                return "Searching...";
              },
            },
          ]}
        />

        {/* legend */}
        <LinearSearchLegend />
      </motion.div>
    </div>
  );
};

export default LinearSearchVisualizer;
