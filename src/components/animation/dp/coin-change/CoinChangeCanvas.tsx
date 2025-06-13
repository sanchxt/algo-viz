import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback, memo } from "react";
import { Eye, EyeOff } from "lucide-react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface CoinChangeCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  coins: number[];
  targetAmount: number;
  speed?: number;
}

const MOBILE_BREAKPOINT = 768;
const CELL_SIZE = 50;
const CELL_GAP = 2;

const CoinChangeCanvas = memo(
  ({ currentStep, coins }: CoinChangeCanvasProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [showPathTable, setShowPathTable] = useState(false);

    // handle responsive layout
    const updateDimensions = useCallback(() => {
      const screenWidth = window.innerWidth;
      setIsMobile(screenWidth < MOBILE_BREAKPOINT);
    }, []);

    useEffect(() => {
      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, [updateDimensions]);

    // extract data from current step with memoization
    const dpTableData = useMemo(() => {
      return currentStep.dataStructures.dpTable?.data || [];
    }, [currentStep.dataStructures.dpTable?.data]);

    const pathTableData = useMemo(() => {
      return currentStep.dataStructures.pathTable?.data || [];
    }, [currentStep.dataStructures.pathTable?.data]);

    const coinsData = useMemo(() => {
      return currentStep.dataStructures.coins?.data || coins;
    }, [currentStep.dataStructures.coins?.data, coins]);

    // extract highlights with memoization
    const highlights = useMemo(() => {
      const dpHighlights = currentStep.highlights.dpTable || [];
      const coinHighlights = currentStep.highlights.coins || [];
      const pathHighlights = currentStep.highlights.pathTable || [];

      const getHighlightStyle = (highlights: any[], style: string) =>
        highlights.find((h) => h.style === style)?.values || [];

      return {
        // DP table highlights
        activeIndices: getHighlightStyle(dpHighlights, "active"),
        highlightIndices: getHighlightStyle(dpHighlights, "highlight"),
        compareIndices: getHighlightStyle(dpHighlights, "compare"),
        swapIndices: getHighlightStyle(dpHighlights, "swap"),
        matchIndices: getHighlightStyle(dpHighlights, "match"),
        mismatchIndices: getHighlightStyle(dpHighlights, "mismatch"),

        // Coin highlights
        activeCoinIndices: getHighlightStyle(coinHighlights, "highlight"),
        matchCoinIndices: getHighlightStyle(coinHighlights, "match"),

        // Path table highlights
        activePathIndices: getHighlightStyle(pathHighlights, "highlight"),
        swapPathIndices: getHighlightStyle(pathHighlights, "swap"),
      };
    }, [currentStep.highlights]);

    // get cell styling based on highlights
    const getCellStyle = useCallback(
      (index: number, isPath: boolean = false) => {
        const activeIndices = isPath
          ? highlights.activePathIndices
          : highlights.activeIndices;
        const highlightIndices = isPath
          ? highlights.activePathIndices
          : highlights.highlightIndices;
        const compareIndices = highlights.compareIndices;
        const swapIndices = isPath
          ? highlights.swapPathIndices
          : highlights.swapIndices;
        const matchIndices = highlights.matchIndices;
        const mismatchIndices = highlights.mismatchIndices;

        let bgColor = "bg-white/10";
        let textColor = "text-white";
        let borderColor = "border-white/20";
        let scale = "scale-100";
        let ring = "";

        // priority order: mismatch > match > swap > compare > active > highlight
        if (mismatchIndices.includes(index)) {
          bgColor = "bg-red-500/30";
          textColor = "text-red-200";
          borderColor = "border-red-400/40";
          scale = "scale-105";
          ring = "ring-2 ring-red-400/50";
        } else if (matchIndices.includes(index)) {
          bgColor = "bg-green-500/30";
          textColor = "text-green-200";
          borderColor = "border-green-400/40";
          scale = "scale-105";
          ring = "ring-2 ring-green-400/50";
        } else if (swapIndices.includes(index)) {
          bgColor = "bg-purple-500/30";
          textColor = "text-purple-200";
          borderColor = "border-purple-400/40";
          scale = "scale-110";
          ring = "ring-2 ring-purple-400/50";
        } else if (compareIndices.includes(index)) {
          bgColor = "bg-yellow-500/30";
          textColor = "text-yellow-200";
          borderColor = "border-yellow-400/40";
          scale = "scale-105";
          ring = "ring-2 ring-yellow-400/50";
        } else if (activeIndices.includes(index)) {
          bgColor = "bg-blue-500/30";
          textColor = "text-blue-200";
          borderColor = "border-blue-400/40";
          scale = "scale-105";
          ring = "ring-2 ring-blue-400/50";
        } else if (highlightIndices.includes(index)) {
          bgColor = "bg-cyan-500/20";
          textColor = "text-cyan-200";
          borderColor = "border-cyan-400/30";
          scale = "scale-102";
        }

        return `${bgColor} ${textColor} ${borderColor} ${scale} ${ring}`;
      },
      [highlights]
    );

    // get coin styling
    const getCoinStyle = useCallback(
      (index: number) => {
        let bgColor = "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20";
        let borderColor = "border-yellow-400/30";
        let scale = "scale-100";
        let ring = "";

        if (highlights.matchCoinIndices.includes(index)) {
          bgColor = "bg-gradient-to-r from-green-500/30 to-green-600/30";
          borderColor = "border-green-400/40";
          scale = "scale-110";
          ring = "ring-2 ring-green-400/50";
        } else if (highlights.activeCoinIndices.includes(index)) {
          bgColor = "bg-gradient-to-r from-blue-500/30 to-blue-600/30";
          borderColor = "border-blue-400/40";
          scale = "scale-105";
          ring = "ring-2 ring-blue-400/50";
        }

        return `${bgColor} ${borderColor} ${scale} ${ring}`;
      },
      [highlights]
    );

    // format cell value display
    const formatCellValue = useCallback(
      (value: any, isPath: boolean = false) => {
        if (value === Infinity) return "∞";
        if (value === -1 && isPath) return "—";
        return String(value);
      },
      []
    );

    const cellSize = isMobile ? 40 : CELL_SIZE;
    const gap = isMobile ? 1 : CELL_GAP;

    return (
      <div className="flex flex-col items-center p-4">
        <div className="w-full max-w-full overflow-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <div
            ref={containerRef}
            className="relative bg-gray-900/30 rounded-xl p-6 border border-white/10 mx-auto min-w-fit"
          >
            {/* available coins section */}
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">
                Available Coins
              </h3>
              <div className="flex justify-center gap-3 flex-wrap">
                <AnimatePresence>
                  {coinsData.map((coin: number, index: number) => (
                    <motion.div
                      key={`coin-${coin}-${index}`}
                      className={`flex items-center justify-center rounded-full border-2 font-bold text-white shadow-lg transition-all duration-300 ${getCoinStyle(
                        index
                      )}`}
                      style={{
                        width: cellSize + 10,
                        height: cellSize + 10,
                      }}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: highlights.activeCoinIndices.includes(index)
                          ? 1.1
                          : highlights.matchCoinIndices.includes(index)
                          ? 1.15
                          : 1,
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        delay: index * 0.05,
                      }}
                    >
                      <span className="font-mono font-bold">{coin}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* DP table section */}
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-4 text-center">
                DP Table (Minimum Coins Needed)
              </h3>

              {/* amount labels */}
              <div className="flex justify-center mb-2">
                <div className="flex gap-px" style={{ gap: `${gap}px` }}>
                  {dpTableData.map((_: any, index: number) => (
                    <div
                      key={`amount-label-${index}`}
                      className="flex items-center justify-center text-gray-400 text-xs font-mono"
                      style={{
                        width: cellSize,
                        height: 20,
                      }}
                    >
                      {index}
                    </div>
                  ))}
                </div>
              </div>

              {/* DP values */}
              <div className="flex justify-center">
                <div className="flex gap-px" style={{ gap: `${gap}px` }}>
                  <AnimatePresence>
                    {dpTableData.map((value: any, index: number) => (
                      <motion.div
                        key={`dp-cell-${index}`}
                        className={`flex items-center justify-center border-2 rounded-lg font-bold shadow-lg transition-all duration-300 ${getCellStyle(
                          index,
                          value
                        )}`}
                        style={{
                          width: cellSize,
                          height: cellSize,
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale:
                            highlights.activeIndices.includes(index) ||
                            highlights.compareIndices.includes(index) ||
                            highlights.swapIndices.includes(index)
                              ? 1.1
                              : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.02,
                        }}
                      >
                        <span className="font-mono text-sm font-bold">
                          {formatCellValue(value)}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* dp[i] label */}
              <div className="flex justify-center mt-2">
                <div className="text-gray-400 text-xs font-mono">
                  dp[amount] = minimum coins needed
                </div>
              </div>
            </div>

            {/* path table toggle */}
            {pathTableData.length > 0 && (
              <div className="mb-4 flex justify-center">
                <button
                  onClick={() => setShowPathTable(!showPathTable)}
                  className="flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-colors duration-150 text-sm"
                >
                  {showPathTable ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showPathTable ? "Hide" : "Show"} Path Reconstruction
                </button>
              </div>
            )}

            {/* path reconstruction table */}
            <AnimatePresence>
              {showPathTable && pathTableData.length > 0 && (
                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-white text-lg font-semibold mb-4 text-center">
                    Path Reconstruction (Which Coin Used)
                  </h3>

                  {/* amount labels */}
                  <div className="flex justify-center mb-2">
                    <div className="flex gap-px" style={{ gap: `${gap}px` }}>
                      {pathTableData.map((_: any, index: number) => (
                        <div
                          key={`path-amount-label-${index}`}
                          className="flex items-center justify-center text-gray-400 text-xs font-mono"
                          style={{
                            width: cellSize,
                            height: 20,
                          }}
                        >
                          {index}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* path values */}
                  <div className="flex justify-center">
                    <div className="flex gap-px" style={{ gap: `${gap}px` }}>
                      <AnimatePresence>
                        {pathTableData.map((value: any, index: number) => (
                          <motion.div
                            key={`path-cell-${index}`}
                            className={`flex items-center justify-center border-2 rounded-lg font-bold shadow-lg transition-all duration-300 ${getCellStyle(
                              index,
                              true
                            )}`}
                            style={{
                              width: cellSize,
                              height: cellSize,
                            }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{
                              opacity: 1,
                              scale:
                                highlights.activePathIndices.includes(index) ||
                                highlights.swapPathIndices.includes(index)
                                  ? 1.1
                                  : 1,
                            }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                              delay: index * 0.02,
                            }}
                          >
                            <span className="font-mono text-sm font-bold">
                              {formatCellValue(value, true)}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* path[i] label */}
                  <div className="flex justify-center mt-2">
                    <div className="text-gray-400 text-xs font-mono">
                      path[amount] = coin used to achieve optimal solution
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
  }
);

CoinChangeCanvas.displayName = "CoinChangeCanvas";

export default CoinChangeCanvas;
