import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useCallback } from "react";
import { Target, Calculator, TreePine, Crown, Zap } from "lucide-react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface MinCostCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialArray: number[];
}

const MinCostCanvas = ({ currentStep, initialArray }: MinCostCanvasProps) => {
  // extract array data from current step
  const arrayData: number[] = useMemo(() => {
    return currentStep.dataStructures.array?.data || initialArray;
  }, [currentStep.dataStructures.array?.data, initialArray]);

  // extract highlights from current step
  const highlights = useMemo(() => {
    const arrayHighlights = currentStep.highlights.array || [];

    const getHighlightsByStyle = (style: string) =>
      arrayHighlights.find((h) => h.style === style)?.values || [];

    return {
      highlighted: getHighlightsByStyle("highlight"),
      compare: getHighlightsByStyle("compare"),
      active: getHighlightsByStyle("active"),
      match: getHighlightsByStyle("match"),
    };
  }, [currentStep.highlights]);

  // get styling for array elements
  const getElementStyle = useCallback(
    (value: number, index: number) => {
      const isMinElement = highlights.highlighted.includes(index);
      const isInComparison = highlights.compare.includes(index);
      const isActive = highlights.active.includes(index);
      const isCompleted = highlights.match.includes(index);

      if (isCompleted) {
        return {
          gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
          border: "border-emerald-300/70",
          ring: "ring-2 ring-emerald-300/50",
          glow: "shadow-lg shadow-emerald-400/20",
          scale: "scale-110",
        };
      } else if (isMinElement) {
        return {
          gradient: "from-green-400 via-green-500 to-green-600",
          border: "border-green-300/70",
          ring: "ring-2 ring-green-300/50",
          glow: "shadow-lg shadow-green-400/20",
          scale: "scale-105",
        };
      } else if (isInComparison) {
        return {
          gradient: "from-blue-400 via-blue-500 to-blue-600",
          border: "border-blue-300/70",
          ring: "ring-2 ring-blue-300/50",
          glow: "shadow-lg shadow-blue-400/20",
          scale: "scale-105",
        };
      } else if (isActive) {
        return {
          gradient: "from-red-400 via-red-500 to-red-600",
          border: "border-red-300/70",
          ring: "ring-2 ring-red-300/50",
          glow: "shadow-lg shadow-red-400/20",
          scale: "scale-105",
        };
      }

      return {
        gradient: "from-gray-400 via-gray-500 to-gray-600",
        border: "border-gray-300/50",
        ring: "",
        glow: "",
        scale: "scale-100",
      };
    },
    [highlights]
  );

  // get element label based on step context
  const getElementLabel = useCallback(
    (value: number, index: number) => {
      const isMinElement = highlights.highlighted.includes(index);
      const variables = currentStep.variables || {};

      if (isMinElement && variables.minElement === value) {
        return { text: "MIN", color: "bg-green-600" };
      }
      if (highlights.compare.includes(index)) {
        return { text: "PAIR", color: "bg-blue-600" };
      }
      if (highlights.active.includes(index)) {
        return { text: "REMOVE", color: "bg-red-600" };
      }
      if (highlights.match.includes(index)) {
        return { text: "FINAL", color: "bg-emerald-600" };
      }
      return null;
    },
    [highlights, currentStep.variables]
  );

  // extract step-specific info
  const stepInfo = useMemo(() => {
    const variables = currentStep.variables || {};
    return {
      stepType: currentStep.stepType,
      minElement: variables.minElement,
      totalCost: variables.totalCost !== undefined ? variables.totalCost : 0,
      operationCost: variables.operationCost,
      operationNumber: variables.operationNumber,
      formula: variables.formula,
      calculation: variables.calculation,
      keyInsight: variables.keyInsight,
      whyOptimal: variables.whyOptimal,
      currentPair: variables.currentPair,
      chosenCost: variables.chosenCost,
      alternativeCosts: variables.alternativeCosts,
      isComplete: variables.isComplete || false,
      greedyPrinciple: variables.greedyPrinciple,
      optimalityReason: variables.optimalityReason,
    };
  }, [currentStep.variables, currentStep.stepType]);

  // render formula visualization
  const renderFormulaVisualization = () => {
    if (stepInfo.stepType !== "formula_derivation" || !stepInfo.formula)
      return null;

    const variables = currentStep.variables || {};

    return (
      <motion.div
        className="mt-8 p-6 backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/30 rounded-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="text-purple-400" size={20} />
            <h4 className="text-xl font-bold text-purple-200">
              Formula Derivation
            </h4>
          </div>

          {/* step by step formula building */}
          <div className="space-y-3">
            <motion.div
              className="text-lg font-mono text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              Total Cost ={" "}
              <span className="text-yellow-300">Operations Needed</span> ×{" "}
              <span className="text-green-300">Cost Per Operation</span>
            </motion.div>

            <motion.div
              className="text-lg font-mono text-white"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              Total Cost ={" "}
              <span className="text-yellow-300">
                ({variables.arrayLength} - 1)
              </span>{" "}
              × <span className="text-green-300">{variables.minElement}</span>
            </motion.div>

            <motion.div
              className="text-xl font-mono font-bold text-purple-200 bg-purple-900/30 px-4 py-2 rounded-lg border border-purple-400/30"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.3, type: "spring", stiffness: 400 }}
            >
              Total Cost ={" "}
              <span className="text-yellow-300">
                {variables.operationsNeeded}
              </span>{" "}
              × <span className="text-green-300">{variables.minElement}</span> ={" "}
              <span className="text-pink-300">{variables.predictedCost}</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // render decision tree visualization
  const renderDecisionTree = () => {
    if (stepInfo.stepType !== "decision_tree" || !stepInfo.currentPair)
      return null;

    const variables = currentStep.variables || {};
    const [minEl, otherEl] = stepInfo.currentPair;

    return (
      <motion.div
        className="mt-8 p-6 backdrop-blur-md bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-400/30 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TreePine className="text-blue-400" size={20} />
            <h4 className="text-xl font-bold text-blue-200">
              Decision Analysis
            </h4>
          </div>

          {/* current decision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              className="p-4 bg-green-500/20 border border-green-400/40 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-green-200 font-semibold mb-2">
                ✓ Our Choice
              </div>
              <div className="text-white font-mono">
                Pair: ({minEl}, {otherEl})
              </div>
              <div className="text-green-300 font-bold">
                Cost: {stepInfo.chosenCost}
              </div>
              <div className="text-green-400 text-sm mt-1">Optimal!</div>
            </motion.div>

            <motion.div
              className="p-4 bg-amber-500/20 border border-amber-400/40 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="text-amber-200 font-semibold mb-2">
                ⚠ Alternative
              </div>
              <div className="text-white font-mono">Other pairings</div>
              <div className="text-amber-300 font-bold">
                Cost:{" "}
                {Math.max(
                  ...(stepInfo.alternativeCosts || [stepInfo.chosenCost])
                )}
              </div>
              <div className="text-amber-400 text-sm mt-1">More expensive</div>
            </motion.div>

            <motion.div
              className="p-4 bg-purple-500/20 border border-purple-400/40 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="text-purple-200 font-semibold mb-2">
                🎯 Result
              </div>
              <div className="text-white font-mono">
                Remove: {variables.elementToRemove}
              </div>
              <div className="text-purple-300 font-bold">
                Savings:{" "}
                {Math.max(
                  ...(stepInfo.alternativeCosts || [stepInfo.chosenCost])
                ) - stepInfo.chosenCost}
              </div>
              <div className="text-purple-400 text-sm mt-1">Per operation</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // render greedy insight panel
  const renderGreedyInsight = () => {
    if (stepInfo.stepType !== "greedy_insight") return null;

    return (
      <motion.div
        className="mt-8 p-6 backdrop-blur-md bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-400/30 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="text-emerald-400" size={24} />
            <h4 className="text-2xl font-bold text-emerald-200">
              💡 Greedy Insight
            </h4>
          </div>

          <motion.div
            className="text-lg text-emerald-100 font-semibold bg-emerald-900/30 px-6 py-4 rounded-lg border border-emerald-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 400 }}
          >
            {stepInfo.keyInsight}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <motion.div
              className="p-4 bg-green-500/20 border border-green-400/40 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
            >
              <div className="text-green-200 font-semibold mb-2">
                🎯 Strategy
              </div>
              <div className="text-white text-sm">
                Always use element {stepInfo.minElement} as cost anchor
              </div>
            </motion.div>

            <motion.div
              className="p-4 bg-blue-500/20 border border-blue-400/40 rounded-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-blue-200 font-semibold mb-2">
                ⚡ Why Optimal
              </div>
              <div className="text-white text-sm">{stepInfo.whyOptimal}</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  // render optimality proof
  const renderOptimalityProof = () => {
    if (stepInfo.stepType !== "optimality_proof") return null;

    return (
      <motion.div
        className="mt-8 p-6 backdrop-blur-md bg-gradient-to-r from-gold-500/10 to-yellow-500/10 border border-yellow-400/30 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="text-yellow-400" size={24} />
            <h4 className="text-2xl font-bold text-yellow-200">
              🏆 Optimality Proof
            </h4>
          </div>

          <motion.div
            className="text-lg text-yellow-100 font-semibold bg-yellow-900/30 px-6 py-4 rounded-lg border border-yellow-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            {stepInfo.greedyPrinciple}
          </motion.div>

          <div className="text-yellow-200">
            <div className="text-sm opacity-90">
              {stepInfo.optimalityReason}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* main array visualization */}
      <div className="w-full max-w-4xl">
        <div className="flex flex-col items-center gap-6">
          {/* array title with step context */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-white text-xl font-semibold mb-2">
              {currentStep.dataStructures.array?.metadata?.label ||
                "Current Array"}
            </h3>

            {stepInfo.stepType === "greedy_insight" && (
              <motion.div
                className="flex items-center justify-center gap-2 text-emerald-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Target size={16} />
                <span className="text-sm font-medium">
                  Identifying optimal strategy...
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* array elements */}
          <div className="flex flex-wrap justify-center gap-4 min-h-[100px]">
            <AnimatePresence mode="wait">
              {arrayData.map((value, index) => {
                const elementStyle = getElementStyle(value, index);
                const elementLabel = getElementLabel(value, index);

                return (
                  <motion.div
                    key={`${value}-${index}-${currentStep.id}`}
                    className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 bg-gradient-to-br text-white font-bold ${elementStyle.gradient} ${elementStyle.border} ${elementStyle.ring} ${elementStyle.glow} ${elementStyle.scale}`}
                    initial={{ opacity: 0, scale: 0.8, y: -20 }}
                    animate={{
                      opacity: 1,
                      scale:
                        elementStyle.scale === "scale-110"
                          ? 1.1
                          : elementStyle.scale === "scale-105"
                          ? 1.05
                          : 1,
                      y: 0,
                      rotate: highlights.compare.includes(index)
                        ? [0, -3, 3, 0]
                        : 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      y: 20,
                      transition: { duration: 0.5 },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      rotate: {
                        duration: 0.6,
                        repeat: highlights.compare.includes(index) ? 2 : 0,
                      },
                    }}
                    whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  >
                    {/* element value */}
                    <span className="text-lg font-mono">{value}</span>

                    {/* element label */}
                    {elementLabel && (
                      <motion.div
                        className={`absolute -top-3 -right-3 px-2 py-1 ${elementLabel.color} rounded-full text-xs font-bold text-white`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        {elementLabel.text}
                      </motion.div>
                    )}

                    {/* index indicator */}
                    <div className="absolute -bottom-8 text-gray-400 text-xs font-mono">
                      [{index}]
                    </div>

                    {/* greedy anchor indicator */}
                    {highlights.highlighted.includes(index) &&
                      stepInfo.stepType !== "initialization" && (
                        <motion.div
                          className="absolute -bottom-12 text-green-400 text-xs font-semibold"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          ⚓ ANCHOR
                        </motion.div>
                      )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* operation info */}
          <motion.div
            className="flex flex-col items-center gap-4 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* current operation status */}
            {stepInfo.operationNumber && (
              <motion.div
                className="backdrop-blur-md bg-blue-500/20 border border-blue-400/30 rounded-lg px-6 py-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-blue-200 text-sm font-semibold">
                  Operation {stepInfo.operationNumber}
                  {currentStep.variables?.elementToRemove && (
                    <span className="ml-2 text-red-300">
                      → Removing {currentStep.variables.elementToRemove}
                    </span>
                  )}
                </span>
              </motion.div>
            )}

            {/* cost breakdown */}
            <div className="flex flex-wrap justify-center gap-4">
              {stepInfo.minElement !== undefined && (
                <motion.div
                  className="backdrop-blur-md bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center">
                    <div className="text-green-200 text-xs">Greedy Anchor</div>
                    <div className="text-green-100 font-bold text-lg">
                      {stepInfo.minElement}
                    </div>
                  </div>
                </motion.div>
              )}

              {stepInfo.operationCost !== undefined && (
                <motion.div
                  className="backdrop-blur-md bg-amber-500/20 border border-amber-400/30 rounded-lg px-4 py-3"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="text-center">
                    <div className="text-amber-200 text-xs">Operation Cost</div>
                    <div className="text-amber-100 font-bold text-lg">
                      {stepInfo.operationCost}
                    </div>
                  </div>
                </motion.div>
              )}

              <motion.div
                className={`backdrop-blur-md border rounded-lg px-4 py-3 ${
                  stepInfo.isComplete
                    ? "bg-emerald-500/20 border-emerald-400/30"
                    : "bg-purple-500/20 border-purple-400/30"
                }`}
                animate={{
                  scale: stepInfo.isComplete ? [1, 1.05, 1] : 1,
                }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="text-center">
                  <div
                    className={`text-xs ${
                      stepInfo.isComplete
                        ? "text-emerald-200"
                        : "text-purple-200"
                    }`}
                  >
                    Total Cost
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      stepInfo.isComplete
                        ? "text-emerald-100"
                        : "text-purple-100"
                    }`}
                  >
                    {/* Always show total cost from variables, fallback to stepInfo.totalCost */}
                    {currentStep.variables?.totalCost !== undefined
                      ? currentStep.variables.totalCost
                      : stepInfo.totalCost}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* completion celebration */}
            {stepInfo.isComplete && arrayData.length === 1 && (
              <motion.div
                className="backdrop-blur-md bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg px-8 py-4 text-center"
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
              >
                <div className="text-emerald-200 font-bold text-lg">
                  🎉 Greedy Algorithm Complete!
                </div>
                <div className="text-emerald-300 text-sm mt-2">
                  Final element: {arrayData[0]} | Optimal cost:{" "}
                  {stepInfo.totalCost}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* step explanation */}
      <motion.div
        className="mt-8 text-center text-gray-300 max-w-3xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-wide leading-relaxed">
          {currentStep.explanation}
        </p>
      </motion.div>

      {/* step-specific visualizations */}
      {renderGreedyInsight()}
      {renderFormulaVisualization()}
      {renderDecisionTree()}
      {renderOptimalityProof()}

      {/* greedy strategy reminder */}
      {stepInfo.minElement !== undefined &&
        !stepInfo.isComplete &&
        stepInfo.stepType !== "greedy_insight" && (
          <motion.div
            className="mt-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg px-6 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <div className="text-center text-sm text-gray-400">
              <span className="text-green-400 font-semibold">
                Greedy Strategy:
              </span>{" "}
              Always use minimum element ({stepInfo.minElement}) → guaranteed
              optimal cost
            </div>
          </motion.div>
        )}
    </div>
  );
};

export default MinCostCanvas;
