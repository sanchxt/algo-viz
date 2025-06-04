import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import type { AlgorithmStep, Language } from "@/types/algorithm";
import { generateBinarySearchSteps } from "@algorithms/sorting/searching/binarySearch";

import BinarySearchCanvas from "./BinarySearchCanvas";
import BinarySearchLegend from "./BinarySearchLegend";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";
import {
  BINARY_SEARCH_ALGORITHM_ID,
  binarySearchLineMapping,
} from "@constants/search/binary-search/binarySearchLineMapping";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";

interface BinarySearchVisualizerProps {
  initialArray?: number[];
  target?: number;
  speed?: number;
  onStepChange?: (highlightedLines: number[], stepData?: AlgorithmStep) => void;
  selectedLanguage?: Language;
}

const DEFAULT_INITIAL_ARRAY = [2, 5, 8, 12, 16, 23, 38, 45, 67, 78, 89, 91];
const DEFAULT_TARGET = 3;
const DEFAULT_SPEED = 1000;

const BinarySearchVisualizer = ({
  initialArray = DEFAULT_INITIAL_ARRAY,
  target = DEFAULT_TARGET,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: BinarySearchVisualizerProps) => {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal speed

  // register line mapping on component mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      BINARY_SEARCH_ALGORITHM_ID,
      binarySearchLineMapping
    );
  }, []);

  // ensure array is sorted for binary search
  useEffect(() => {
    const sorted = [...initialArray].sort((a, b) => a - b);
    setSortedArray(sorted);
  }, [initialArray]);

  // generate binary search steps when array or target changes
  useEffect(() => {
    if (sortedArray.length > 0) {
      const binarySearchSteps = generateBinarySearchSteps(sortedArray, target);
      setSteps(binarySearchSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    }
  }, [sortedArray, target]);

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
        BINARY_SEARCH_ALGORITHM_ID,
        stepKey as any,
        selectedLanguage,
        currentStep.stepContext
      );

      onStepChange(highlightedLines, currentStep);
    }
  }, [currentStepIndex, steps, selectedLanguage, onStepChange]);

  const actualSpeed = speed / playbackSpeed; // (higher playbackSpeed = faster)

  // auto-play effect
  useEffect(() => {
    if (
      !isAutoPlaying ||
      steps.length === 0 ||
      currentStepIndex >= steps.length - 1
    ) {
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1);
    }, actualSpeed);

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps, actualSpeed, isAutoPlaying]);

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
            Binary Search Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Divide and conquer your way to the target
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
          <BinarySearchCanvas
            currentStep={currentStep}
            initialArray={sortedArray}
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
              key: "searchRange",
              label: "Search Range",
              color: "blue",
              getValue: (vars) => `[${vars.left || 0}, ${vars.right || 0}]`,
              condition: (vars) =>
                vars.left !== undefined && vars.right !== undefined,
            },
            {
              key: "elementsLeft",
              label: "Elements Left",
              color: "emerald",
              getValue: (vars) => {
                if (vars.left !== undefined && vars.right !== undefined) {
                  return Math.max(0, vars.right - vars.left + 1);
                }
                return 0;
              },
              condition: (vars) =>
                vars.left !== undefined && vars.right !== undefined,
            },
            {
              key: "currentElement",
              label: "Current Element",
              color: "amber",
              getValue: (vars) => vars.current || "N/A",
              condition: (vars) => vars.current !== undefined,
            },
            {
              key: "foundStatus",
              label: "Status",
              color: "purple",
              getValue: (vars) => {
                if (vars.found === true) return "Found!";
                if (vars.found === false) return "Not Found";
                return "Searching...";
              },
            },
          ]}
        />

        {/* legend */}
        <BinarySearchLegend />
      </motion.div>
    </div>
  );
};

export default BinarySearchVisualizer;
