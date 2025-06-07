import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import { generateAnagramDetectionSteps } from "@/algorithms/strings/anagramDetection";

import AnagramDetectionCanvas from "./AnagramDetectionCanvas";
import AnagramDetectionLegend from "./AnagramDetectionLegend";
import StepInformation from "@components/animation/StepInformation";
import PlaybackControls from "@components/animation/PlaybackControls";
import {
  ANAGRAM_DETECTION_ALGORITHM_ID,
  anagramDetectionLineMapping,
} from "@constants/strings/anagram-detection/anagramDetectionLineMapping";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";

interface AnagramDetectionVisualizerProps {
  initialString1?: string;
  initialString2?: string;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_STRING1 = "listen";
const DEFAULT_STRING2 = "silent";
const DEFAULT_SPEED = 1000;

const AnagramDetectionVisualizer = ({
  initialString1 = DEFAULT_STRING1,
  initialString2 = DEFAULT_STRING2,
  speed = DEFAULT_SPEED,
  onStepChange,
  selectedLanguage = "javascript",
}: AnagramDetectionVisualizerProps) => {
  const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1 = normal speed

  // register line mapping on component mount
  useEffect(() => {
    algorithmLineResolver.registerAlgorithm(
      ANAGRAM_DETECTION_ALGORITHM_ID,
      anagramDetectionLineMapping
    );
  }, []);

  // generate anagram detection steps when strings change
  useEffect(() => {
    if (initialString1 && initialString2) {
      const anagramSteps = generateAnagramDetectionSteps(
        initialString1,
        initialString2
      );
      setSteps(anagramSteps);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    } else {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsAutoPlaying(false);
    }
  }, [initialString1, initialString2]);

  // handle step changes and line highlighting
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex] && onStepChange) {
      const currentStep = steps[currentStepIndex];

      // handle context-specific line highlighting
      let stepKey: string = currentStep.stepType;

      // handle specific return cases based on found status
      if (
        currentStep.stepType === "return_found" ||
        currentStep.stepType === "return_not_found"
      ) {
        stepKey = currentStep.stepType;
      }

      const highlightedLines = algorithmLineResolver.getHighlightedLines(
        ANAGRAM_DETECTION_ALGORITHM_ID,
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
            Anagram Detection Visualization
          </h2>
          <p className="text-gray-300 text-lg font-medium">
            Compare character frequencies to detect anagrams
          </p>
        </motion.div>

        {/* input display */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
            <span className="text-blue-200 text-sm font-bold">
              String 1: "{initialString1}"
            </span>
          </div>
          <div className="text-white text-xl font-bold">vs</div>
          <div className="backdrop-blur-md bg-purple-500/20 border border-purple-400/30 rounded-lg px-4 py-2">
            <span className="text-purple-200 text-sm font-bold">
              String 2: "{initialString2}"
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
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <AnagramDetectionCanvas
            currentStep={currentStep}
            initialString1={initialString1}
            initialString2={initialString2}
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
              key: "strings",
              label: "Strings",
              color: "blue",
              getValue: (vars) =>
                `"${vars.string1 || initialString1}" vs "${
                  vars.string2 || initialString2
                }"`,
            },
            {
              key: "lengths",
              label: "Lengths",
              color: "purple",
              getValue: (vars) =>
                `${vars.string1Length || 0} vs ${vars.string2Length || 0}`,
              condition: (vars) => vars.string1Length !== undefined,
            },
            {
              key: "processing",
              label: "Processing",
              color: "amber",
              getValue: (vars) => {
                if (vars.processingString) {
                  return `String ${vars.processingString}`;
                }
                if (vars.currentChar) {
                  return `'${vars.currentChar}' at ${vars.currentIndex}`;
                }
                return "Initializing";
              },
              condition: (vars) => vars.processingString || vars.currentChar,
            },
            {
              key: "result",
              label: "Result",
              color: "emerald",
              getValue: (vars) => {
                if (vars.isAnagram === true) return "✓ Anagrams";
                if (vars.isAnagram === false) return "✗ Not anagrams";
                return "Analyzing...";
              },
            },
          ]}
        />

        {/* legend */}
        <AnagramDetectionLegend />
      </motion.div>
    </div>
  );
};

export default AnagramDetectionVisualizer;
