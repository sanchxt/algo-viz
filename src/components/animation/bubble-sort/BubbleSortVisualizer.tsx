import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import {
  bubbleSortLineMapping,
  BUBBLE_SORT_ALGORITHM_ID,
} from "@/constants/sorting/bubble-sort/bubbleSortLineMapping";
import type { AlgorithmStep, Language } from "@/types/algorithm";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import { generateBubbleSortSteps } from "@algorithms/sorting/bubbleSort";

import VisualizationCanvas from "./VisualizationCanvas";
import VisualizationLegend from "./VisualizationLegend";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";

interface BubbleSortVisualizerProps {
  initialArray?: number[];
  speed?: number;
  onStepChange?: (highlightedLines: number[], stepData?: AlgorithmStep) => void;
  selectedLanguage?: Language;
}

const DEFAULT_INITIAL_ARRAY = [64, 34, 25];
const DEFAULT_SPEED = 1000;

const BubbleSortVisualizer = ({
  initialArray = DEFAULT_INITIAL_ARRAY,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: BubbleSortVisualizerProps) => {
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [arrayForSort, setArrayForSort] = useState<number[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal speed

  // register line mapping on component mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      BUBBLE_SORT_ALGORITHM_ID,
      bubbleSortLineMapping
    );
  }, []);

  useEffect(() => {
    setArrayForSort([...initialArray]);
  }, [initialArray]);

  useEffect(() => {
    if (arrayForSort.length > 0) {
      const bubbleSortSteps = generateBubbleSortSteps(arrayForSort);
      setSteps(bubbleSortSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    }
  }, [arrayForSort]);

  // handle step changes and line highlighting
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex] && onStepChange) {
      const currentStep = steps[currentStepIndex];

      const highlightedLines = algorithmLineResolver.getHighlightedLines(
        BUBBLE_SORT_ALGORITHM_ID,
        currentStep.stepType,
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
      // if at the end restart from beginning
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

  // loading
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
            Bubble Sort Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Watch the elegant dance of comparison and swapping
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
        <VisualizationCanvas
          currentStep={currentStep}
          arrayForSort={arrayForSort}
          speed={speed}
        />

        {/* step information */}
        <StepInformation
          currentStep={currentStep}
          currentStepIndex={currentStepIndex}
          totalSteps={steps.length}
          isAutoPlaying={isAutoPlaying}
          variableConfig={[
            {
              key: "pass",
              label: "Pass",
              color: "blue",
              getValue: (vars) => (vars.outerLoop || 0) + 1,
              condition: (vars) => vars.outerLoop !== undefined,
            },
            {
              key: "totalSwaps",
              label: "Total Swaps",
              color: "emerald",
              getValue: (vars) => vars.swaps || 0,
            },
            {
              key: "swapsInPass",
              label: "Swaps in Pass",
              color: "purple",
              getValue: (vars) => vars.swapsInPass || 0,
              condition: (vars) => vars.swapsInPass !== undefined,
            },
          ]}
        />

        {/* legend */}
        <VisualizationLegend />
      </motion.div>
    </div>
  );
};

export default BubbleSortVisualizer;
