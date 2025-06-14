import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface HeapData {
  elements: number[];
  size: number;
  capacity: number;
  inputArray: number[];
  currentInputIndex: number;
  kValue: number;
  result: number[];
}

interface KLargestElementsCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialArray: number[];
  initialK: number;
}

// layout constants
const MOBILE_BREAKPOINT = 768;

// heap visualization component
const HeapVisualization = ({
  heap,
  highlights,
  isMobile,
}: {
  heap: number[];
  highlights: { [key: string]: number[] };
  isMobile: boolean;
}) => {
  const nodeRadius = isMobile ? 18 : 22;
  const levelHeight = isMobile ? 60 : 80;
  const nodeSpacing = isMobile ? 45 : 60;

  // calculate node positions for tree layout
  const getNodePosition = useCallback(
    (index: number, totalNodes: number) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const nodesInLevel = Math.pow(2, level);

      // calculate horizontal spacing based on level
      const levelWidth = Math.min(nodesInLevel * nodeSpacing, 400);
      const startX = (400 - levelWidth) / 2;
      const nodeSpacingInLevel = levelWidth / (nodesInLevel + 1);

      const x = startX + (positionInLevel + 1) * nodeSpacingInLevel;
      const y = 40 + level * levelHeight;

      return { x, y };
    },
    [levelHeight, nodeSpacing]
  );

  // get edge path between parent and child
  const getEdgePath = useCallback(
    (parentIndex: number, childIndex: number) => {
      const parentPos = getNodePosition(parentIndex, heap.length);
      const childPos = getNodePosition(childIndex, heap.length);

      // offset by radius to connect edge of circles
      const dx = childPos.x - parentPos.x;
      const dy = childPos.y - parentPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return "";

      const unitX = dx / distance;
      const unitY = dy / distance;

      const startX = parentPos.x + unitX * nodeRadius;
      const startY = parentPos.y + unitY * nodeRadius;
      const endX = childPos.x - unitX * nodeRadius;
      const endY = childPos.y - unitY * nodeRadius;

      return `M ${startX} ${startY} L ${endX} ${endY}`;
    },
    [getNodePosition, heap.length, nodeRadius]
  );

  // get node style based on highlights
  const getNodeStyle = useCallback(
    (index: number, value: number) => {
      if (highlights.heap_top?.includes(index)) {
        return {
          fill: "rgb(239 68 68 / 0.8)", // red for heap top/min
          stroke: "rgb(239 68 68)",
          strokeWidth: "3",
          textColor: "text-red-100",
          class: "animate-pulse",
        };
      }
      if (highlights.heap_highlight?.includes(index)) {
        return {
          fill: "rgb(59 130 246 / 0.8)", // blue for highlighted
          stroke: "rgb(59 130 246)",
          strokeWidth: "3",
          textColor: "text-blue-100",
          class: "",
        };
      }
      if (highlights.heap_compare?.includes(index)) {
        return {
          fill: "rgb(245 158 11 / 0.8)", // amber for comparison
          stroke: "rgb(245 158 11)",
          strokeWidth: "3",
          textColor: "text-amber-100",
          class: "",
        };
      }
      return {
        fill: "rgb(34 197 94 / 0.6)", // green default
        stroke: "rgb(34 197 94)",
        strokeWidth: "2",
        textColor: "text-green-100",
        class: "",
      };
    },
    [highlights]
  );

  const canvasHeight = Math.max(
    200,
    40 + (Math.floor(Math.log2(heap.length || 1)) + 1) * levelHeight + 40
  );

  return (
    <div className="relative">
      <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-400 rounded"></div>
        Min-Heap Tree View
      </h4>

      <div className="bg-gray-900/40 rounded-xl p-4 border border-white/10">
        {heap.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-sm">Heap is empty</div>
            </div>
          </div>
        ) : (
          <svg
            width="100%"
            height={canvasHeight}
            viewBox={`0 0 400 ${canvasHeight}`}
            className="overflow-visible"
          >
            {/* render edges first */}
            <AnimatePresence>
              {heap.map((_, index) => {
                const leftChild = 2 * index + 1;
                const rightChild = 2 * index + 2;

                return (
                  <g key={`edges-${index}`}>
                    {leftChild < heap.length && (
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        d={getEdgePath(index, leftChild)}
                        stroke="rgb(156 163 175)"
                        strokeWidth="2"
                        fill="none"
                      />
                    )}
                    {rightChild < heap.length && (
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        d={getEdgePath(index, rightChild)}
                        stroke="rgb(156 163 175)"
                        strokeWidth="2"
                        fill="none"
                      />
                    )}
                  </g>
                );
              })}
            </AnimatePresence>

            {/* render nodes */}
            <AnimatePresence>
              {heap.map((value, index) => {
                const position = getNodePosition(index, heap.length);
                const style = getNodeStyle(index, value);

                return (
                  <motion.g
                    key={`node-${index}-${value}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                      delay: index * 0.1,
                    }}
                  >
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r={nodeRadius}
                      fill={style.fill}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      className={style.class}
                    />
                    <text
                      x={position.x}
                      y={position.y + 4}
                      textAnchor="middle"
                      fontSize={isMobile ? "12" : "14"}
                      fontWeight="bold"
                      fill="white"
                      className="select-none"
                    >
                      {value}
                    </text>
                    {/* index label */}
                    <text
                      x={position.x}
                      y={position.y - nodeRadius - 8}
                      textAnchor="middle"
                      fontSize="10"
                      fill="rgb(156 163 175)"
                      className="select-none"
                    >
                      [{index}]
                    </text>
                  </motion.g>
                );
              })}
            </AnimatePresence>
          </svg>
        )}
      </div>
    </div>
  );
};

// heap array visualization component
const HeapArrayVisualization = ({
  heap,
  highlights,
  capacity,
}: {
  heap: number[];
  highlights: { [key: string]: number[] };
  capacity: number;
}) => {
  const getElementStyle = useCallback(
    (index: number) => {
      if (highlights.heap_top?.includes(index)) {
        return "bg-red-500/30 border-red-400/40 text-red-200 scale-105";
      }
      if (highlights.heap_highlight?.includes(index)) {
        return "bg-blue-500/30 border-blue-400/40 text-blue-200 scale-105";
      }
      if (highlights.heap_compare?.includes(index)) {
        return "bg-amber-500/30 border-amber-400/40 text-amber-200 scale-105";
      }
      return "bg-emerald-500/30 border-emerald-400/40 text-emerald-200";
    },
    [highlights]
  );

  return (
    <div className="relative">
      <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
        <div className="w-3 h-3 bg-purple-400 rounded"></div>
        Min-Heap Array View (Size: {heap.length}/{capacity})
      </h4>

      <div className="bg-gray-900/40 rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {/* heap elements */}
          {heap.map((value, index) => (
            <motion.div
              key={`heap-${index}`}
              className={`min-w-[40px] flex-shrink-0 text-center font-mono font-semibold text-sm py-2 px-1 rounded-lg border transition-all duration-300 ${getElementStyle(
                index
              )}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              {value}
            </motion.div>
          ))}

          {/* empty slots */}
          {Array.from({ length: capacity - heap.length }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="min-w-[40px] flex-shrink-0 text-center font-mono text-sm py-2 px-1 rounded-lg border border-dashed border-gray-500/30 text-gray-500"
            >
              —
            </div>
          ))}
        </div>

        {/* array indices */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto">
          {Array.from({ length: capacity }, (_, index) => (
            <div
              key={`index-${index}`}
              className="min-w-[40px] flex-shrink-0 text-center text-xs text-gray-400 font-mono"
            >
              [{index}]
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KLargestElementsCanvas = ({
  currentStep,
  initialArray,
  initialK,
}: KLargestElementsCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // responsive handler
  const updateDimensions = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // extract heap data from current step
  const heapData: HeapData = useMemo(() => {
    return (
      currentStep.dataStructures.heap?.data || {
        elements: [],
        size: 0,
        capacity: initialK,
        inputArray: initialArray,
        currentInputIndex: -1,
        kValue: initialK,
        result: [],
      }
    );
  }, [currentStep.dataStructures.heap?.data, initialArray, initialK]);

  const inputArrayData = useMemo(() => {
    return currentStep.dataStructures.inputArray?.data || initialArray;
  }, [currentStep.dataStructures.inputArray?.data, initialArray]);

  // extract highlights
  const highlights = useMemo(() => {
    const heapHighlights = currentStep.highlights.heap || [];
    const inputHighlights = currentStep.highlights.inputArray || [];

    const getHighlightByStyle = (highlights: any[], style: string) =>
      highlights.find((h) => h.style === style)?.values || [];

    return {
      // heap highlights
      heap_top: getHighlightByStyle(heapHighlights, "heap_top"),
      heap_highlight: getHighlightByStyle(heapHighlights, "heap_highlight"),
      heap_compare: getHighlightByStyle(heapHighlights, "heap_compare"),

      // input highlights
      input_current: getHighlightByStyle(inputHighlights, "input_current"),
      processing: getHighlightByStyle(inputHighlights, "processing"),
      mismatch: getHighlightByStyle(inputHighlights, "mismatch"),
    };
  }, [currentStep.highlights]);

  const { elements: heap, currentInputIndex, kValue, result } = heapData;

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-x-auto overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
          } gap-6`}
        >
          {/* input array section */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              Input Array
              {currentInputIndex >= 0 && (
                <span className="text-purple-200 text-xs px-2 py-1 bg-purple-500/20 rounded-lg">
                  Processing: {inputArrayData[currentInputIndex]} at index{" "}
                  {currentInputIndex}
                </span>
              )}
            </h4>

            <div className="bg-gray-900/40 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {inputArrayData.map((value: number, index: number) => {
                  const isCurrent = highlights.input_current.includes(index);
                  const isProcessing = highlights.processing.includes(index);
                  const isMismatch = highlights.mismatch.includes(index);
                  const isProcessed = index < currentInputIndex;

                  let bgColor = "bg-white/10";
                  let textColor = "text-white";
                  let borderColor = "border-white/20";
                  let scale = "scale-100";

                  if (isCurrent) {
                    bgColor = "bg-blue-500/30";
                    textColor = "text-blue-200";
                    borderColor = "border-blue-400/40";
                    scale = "scale-110";
                  } else if (isProcessing) {
                    bgColor = "bg-emerald-500/30";
                    textColor = "text-emerald-200";
                    borderColor = "border-emerald-400/40";
                    scale = "scale-105";
                  } else if (isMismatch) {
                    bgColor = "bg-red-500/30";
                    textColor = "text-red-200";
                    borderColor = "border-red-400/40";
                  } else if (isProcessed) {
                    bgColor = "bg-gray-500/20";
                    textColor = "text-gray-300";
                    borderColor = "border-gray-400/30";
                  }

                  return (
                    <motion.div
                      key={`input-${index}`}
                      className={`min-w-[32px] flex-shrink-0 text-center font-mono font-semibold text-xs py-2 px-1 rounded-lg border transition-all duration-300 ${bgColor} ${textColor} ${borderColor} ${scale}`}
                      animate={{ scale: isCurrent ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {value}
                    </motion.div>
                  );
                })}
              </div>

              {/* indices */}
              <div className="flex items-center gap-1 mt-2 overflow-x-auto">
                {inputArrayData.map((_: number, index: number) => (
                  <div
                    key={`index-${index}`}
                    className="min-w-[32px] flex-shrink-0 text-center text-xs text-gray-400 font-mono"
                  >
                    [{index}]
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* heap visualizations */}
          <div className="space-y-6">
            {/* heap array view */}
            <HeapArrayVisualization
              heap={heap}
              highlights={highlights}
              capacity={kValue}
            />

            {/* heap tree view */}
            <HeapVisualization
              heap={heap}
              highlights={highlights}
              isMobile={isMobile}
            />
          </div>
        </div>

        {/* result section */}
        {result.length > 0 && (
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="text-white font-semibold text-lg mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              Result: {kValue} Largest Elements
            </h4>

            <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-xl p-6">
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {result.map((value, index) => (
                  <motion.div
                    key={`result-${index}`}
                    className="min-w-[48px] text-center font-mono font-bold text-lg py-3 px-2 rounded-lg bg-emerald-500/30 border border-emerald-400/40 text-emerald-200"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-4 text-emerald-300 text-sm">
                Sorted in descending order: [{result.join(", ")}]
              </div>
            </div>
          </motion.div>
        )}

        {/* algorithm stats */}
        <motion.div
          className="mt-6 backdrop-blur-md bg-black/20 rounded-lg p-4 text-white text-sm space-y-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Input Size</span>
              <span className="font-mono">{inputArrayData.length}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs text-gray-300">K Value</span>
              <span className="font-mono">{kValue}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Heap Size</span>
              <span className="font-mono">
                {heap.length}/{kValue}
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-xs text-gray-300">Progress</span>
              <span className="font-mono">
                {currentInputIndex >= 0 ? currentInputIndex + 1 : 0}/
                {inputArrayData.length}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* step explanation */}
      <motion.div
        className="mt-4 text-center text-gray-300 w-full max-w-4xl"
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-wide leading-relaxed">
          {currentStep.explanation}
        </p>
      </motion.div>
    </div>
  );
};

export default KLargestElementsCanvas;
