import { motion } from "framer-motion";
import { useState, useEffect, useCallback, useMemo, memo } from "react";

import CoinChangeCanvas from "./CoinChangeCanvas";
import CoinChangeLegend from "./CoinChangeLegend";
import StepInformation from "@components/animation/StepInformation";
import { algorithmLineResolver } from "@utils/AlgorithmLineResolver";
import PlaybackControls from "@components/animation/PlaybackControls";
import type { EnhancedAlgorithmStep, Language } from "@/types/algorithm";
import {
  COIN_CHANGE_ALGORITHM_ID,
  coinChangeLineMapping,
} from "@constants/dp/coin-change/coinChangeLineMapping";
import { generateCoinChangeSteps } from "@/algorithms/dp/coinChange";

interface CoinChangeVisualizerProps {
  initialCoins?: number[];
  initialAmount?: number;
  speed?: number;
  onStepChange?: (
    highlightedLines: number[],
    stepData?: EnhancedAlgorithmStep
  ) => void;
  selectedLanguage?: Language;
}

const DEFAULT_COINS = [1, 3, 4];
const DEFAULT_AMOUNT = 6;
const DEFAULT_SPEED = 1500;

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

const CoinChangeVisualizer = memo(
  ({
    initialCoins = DEFAULT_COINS,
    initialAmount = DEFAULT_AMOUNT,
    speed = DEFAULT_SPEED,
    onStepChange,
    selectedLanguage = "javascript",
  }: CoinChangeVisualizerProps) => {
    const [steps, setSteps] = useState<EnhancedAlgorithmStep[]>([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);

    const debouncedCoins = useDebounce(initialCoins, 300);
    const debouncedAmount = useDebounce(initialAmount, 300);

    // register line mapping once on mount
    useEffect(() => {
      algorithmLineResolver.registerAlgorithm(
        COIN_CHANGE_ALGORITHM_ID,
        coinChangeLineMapping
      );
    }, []);

    // generate steps when debounced inputs change
    const generatedSteps = useMemo(() => {
      if (
        debouncedCoins.length === 0 ||
        debouncedAmount <= 0 ||
        debouncedAmount > 100
      ) {
        return [];
      }

      // validate coins
      if (debouncedCoins.some((coin) => coin <= 0 || coin > 100)) {
        return [];
      }

      // generate fresh steps each time inputs change
      return generateCoinChangeSteps(debouncedCoins, debouncedAmount);
    }, [debouncedCoins, debouncedAmount]);

    // update steps when generated steps change
    useEffect(() => {
      setIsGenerating(true);

      const updateSteps = () => {
        setSteps(generatedSteps);
        setCurrentStepIndex(0);
        setIsAutoPlaying(false);
        setIsGenerating(false);
      };

      // use RAF for smooth transition
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
        case "dp_table_initialization":
        case "dp_amount_processing":
        case "dp_coin_consideration":
        case "dp_subproblem_lookup":
        case "dp_comparison":
        case "dp_table_update":
        case "dp_optimal_solution_found":
        case "dp_no_solution":
        case "dp_path_reconstruction":
          stepKey = currentStep.stepType;
          break;
      }

      return algorithmLineResolver.getHighlightedLines(
        COIN_CHANGE_ALGORITHM_ID,
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

    // auto-play functionality
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

    // variable configuration for the step information panel
    const variableConfig = useMemo(
      () => [
        {
          key: "problem",
          label: "Problem",
          color: "blue" as const,
          getValue: () =>
            `Coins[${debouncedCoins.join(",")}] → ${debouncedAmount}`,
        },
        {
          key: "currentAmount",
          label: "Current Amount",
          color: "cyan" as const,
          getValue: (vars: any) => `Processing: ${vars.currentAmount || "—"}`,
          condition: (vars: any) => vars.currentAmount !== undefined,
        },
        {
          key: "currentCoin",
          label: "Current Coin",
          color: "amber" as const,
          getValue: (vars: any) => `Trying coin: ${vars.currentCoin || "—"}`,
          condition: (vars: any) => vars.currentCoin !== undefined,
        },
        {
          key: "comparison",
          label: "Comparison",
          color: "purple" as const,
          getValue: (vars: any) => {
            if (vars.currentMin !== undefined && vars.newOption !== undefined) {
              return `${vars.currentMin} vs ${vars.newOption}`;
            }
            if (vars.calculation) return vars.calculation;
            return "—";
          },
          condition: (vars: any) =>
            vars.currentMin !== undefined ||
            vars.newOption !== undefined ||
            vars.calculation,
        },
        {
          key: "result",
          label: "Status",
          color: "emerald" as const,
          getValue: (vars: any) => {
            if (vars.finalResult !== undefined)
              return `✓ Min coins: ${vars.finalResult}`;
            if (vars.solutionFound === false) return "❌ No solution";
            if (vars.newValue !== undefined) return `Updated: ${vars.newValue}`;
            if (vars.canUseCoin === false) return "Cannot use coin";
            if (vars.willUpdate === true) return "Better solution found!";
            if (vars.willUpdate === false) return "No improvement";
            return "Processing...";
          },
        },
        {
          key: "pathInfo",
          label: "Path",
          color: "amber" as const,
          getValue: (vars: any) => {
            if (vars.optimalCoins) return `Coins: [${vars.optimalCoins}]`;
            if (vars.coinUsed !== undefined)
              return `Used coin: ${vars.coinUsed}`;
            if (vars.pathSoFar) return `Path: [${vars.pathSoFar}]`;
            return "—";
          },
          condition: (vars: any) =>
            vars.optimalCoins || vars.coinUsed !== undefined || vars.pathSoFar,
        },
      ],
      [debouncedCoins, debouncedAmount]
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
                className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
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
              Coin Change Dynamic Programming
            </h2>
            <p className="text-gray-300 text-lg font-medium">
              Watch the DP table build optimal solutions step by step
            </p>
          </motion.div>

          {/* problem display */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="backdrop-blur-md bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg px-4 py-2">
              <span className="text-yellow-200 text-sm font-bold">
                Coins: [{debouncedCoins.join(", ")}]
              </span>
            </div>
            <div className="text-gray-400 text-lg">→</div>
            <div className="backdrop-blur-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-4 py-2">
              <span className="text-blue-200 text-sm font-bold">
                Target: {debouncedAmount}
              </span>
            </div>
            {currentStep.variables?.finalResult !== undefined && (
              <motion.div
                className="backdrop-blur-md bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg px-4 py-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-emerald-200 text-sm font-bold">
                  Result:{" "}
                  {currentStep.variables.finalResult === -1
                    ? "No solution"
                    : `${currentStep.variables.finalResult} coins`}
                </span>
              </motion.div>
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
            <CoinChangeCanvas
              currentStep={currentStep}
              coins={debouncedCoins}
              targetAmount={debouncedAmount}
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
          <CoinChangeLegend />
        </motion.div>
      </div>
    );
  }
);

CoinChangeVisualizer.displayName = "CoinChangeVisualizer";

export default CoinChangeVisualizer;
