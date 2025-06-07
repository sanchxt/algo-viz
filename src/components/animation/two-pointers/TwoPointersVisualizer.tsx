import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import { generateTwoSumSteps } from "@/algorithms/two-pointers/twoSum";

import TwoPointersCanvas from "./TwoPointersCanvas";
import TwoPointersLegend from "./TwoPointersLegend";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";
import {
  TWO_SUM_ALGORITHM_ID,
  twoSumLineMapping,
} from "@constants/two-pointers/twoSumLineMapping";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";

interface TwoPointersVisualizerProps {
  initialArray?: number[];
  target?: number;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_INITIAL_ARRAY = [2, 3, 6, 7, 8, 11, 15, 17];
const DEFAULT_TARGET = 9;
const DEFAULT_SPEED = 1000;

const TwoPointersVisualizer = ({
  initialArray = DEFAULT_INITIAL_ARRAY,
  target = DEFAULT_TARGET,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: TwoPointersVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [sortedArray, setSortedArray] = useState<number[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal speed

  // register line mapping on component mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      TWO_SUM_ALGORITHM_ID,
      twoSumLineMapping
    );
  }, []);

  // ensure array is sorted for two pointers approach
  useEffect(() => {
    const sorted = [...initialArray].sort((a, b) => a - b);
    setSortedArray(sorted);
  }, [initialArray]);

  // generate two sum steps when sorted array or target changes
  useEffect(() => {
    if (sortedArray.length > 0) {
      const twoSumSteps = generateTwoSumSteps(sortedArray, target);
      setSteps(twoSumSteps);
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
        TWO_SUM_ALGORITHM_ID,
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
            Two Pointers Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Find two numbers that add up to the target sum
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
          <TwoPointersCanvas
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
              key: "pointers",
              label: "Pointers [L,R]",
              color: "blue",
              getValue: (vars) => `[${vars.left || 0}, ${vars.right || 0}]`,
              condition: (vars) => vars.currentSum !== undefined,
            },
            {
              key: "target",
              label: "Target",
              color: "purple",
              getValue: (vars) => vars.target,
            },
            {
              key: "status",
              label: "Status",
              color: "emerald",
              getValue: (vars) => {
                if (vars.found === true) return "Found!";
                if (vars.found === false) return "Not Found";
                return "Searching...";
              },
            },
          ]}
        />

        {/* legend */}
        <TwoPointersLegend />
      </motion.div>
    </div>
  );
};

export default TwoPointersVisualizer;
