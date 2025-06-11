import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface StackElement {
  value: string;
  id: string;
  addedAtStep: number;
}

interface BalancedParenthesesCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  speed?: number;
}

const MOBILE_BREAKPOINT = 768;
const STACK_WIDTH = 280;

const BalancedParenthesesCanvas = ({
  currentStep,
}: BalancedParenthesesCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  // extract data from current step
  const stackData: StackElement[] = useMemo(() => {
    return currentStep.dataStructures.stack?.data || [];
  }, [currentStep.dataStructures.stack?.data]);

  const stringData: string[] = useMemo(() => {
    return currentStep.dataStructures.inputString?.data || [];
  }, [currentStep.dataStructures.inputString?.data]);

  // extract highlights
  const highlights = useMemo(() => {
    const stackHighlights = currentStep.highlights.stack || [];
    const stringHighlights = currentStep.highlights.inputString || [];

    const getHighlightStyle = (highlights: any[], style: string) =>
      highlights.find((h) => h.style === style)?.values || [];

    return {
      // stack highlights
      highlightedElements: getHighlightStyle(stackHighlights, "highlight"),
      invalidElements: getHighlightStyle(stackHighlights, "invalid"),
      processingElements: getHighlightStyle(stackHighlights, "processing"),
      stackTop: getHighlightStyle(stackHighlights, "stack_top"),

      // string highlights
      currentChar: getHighlightStyle(stringHighlights, "current"),
      validChars: getHighlightStyle(stringHighlights, "valid"),
      invalidChars: getHighlightStyle(stringHighlights, "invalid"),
      processingChars: getHighlightStyle(stringHighlights, "processing"),
      mismatchChars: getHighlightStyle(stringHighlights, "mismatch"),
    };
  }, [currentStep.highlights]);

  // get current character index from step context
  const currentCharIndex = currentStep.stepContext?.characterIndex ?? -1;

  // character styling function
  const getCharacterStyle = useCallback(
    (index: number) => {
      if (
        highlights.invalidChars.includes(index) ||
        highlights.mismatchChars.includes(index)
      ) {
        return "from-red-400 via-red-500 to-red-600 border-red-300/70 ring-2 ring-red-300/50";
      }
      if (highlights.validChars.includes(index)) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70 ring-2 ring-emerald-300/50";
      }
      if (
        highlights.currentChar.includes(index) ||
        highlights.processingChars.includes(index)
      ) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-2 ring-blue-300/50";
      }
      if (index < currentCharIndex) {
        return "from-gray-500 via-gray-600 to-gray-700 border-gray-400/50";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/30";
    },
    [highlights, currentCharIndex]
  );

  // stack element styling function
  const getStackElementStyle = useCallback(
    (elementId: string) => {
      if (highlights.invalidElements.some((id: string) => id === elementId)) {
        return "from-red-400 via-red-500 to-red-600 border-red-300/70 ring-2 ring-red-300/50";
      }
      if (highlights.stackTop.some((id: string) => id === elementId)) {
        return "from-amber-400 via-amber-500 to-amber-600 border-amber-300/70 ring-2 ring-amber-300/50";
      }
      if (
        highlights.highlightedElements.some((id: string) => id === elementId)
      ) {
        return "from-purple-400 via-purple-500 to-purple-600 border-purple-300/70 ring-2 ring-purple-300/50";
      }
      if (
        highlights.processingElements.some((id: string) => id === elementId)
      ) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-2 ring-blue-300/50";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50";
    },
    [highlights]
  );

  // get bracket type icon
  const getBracketIcon = (char: string): string => {
    const icons: { [key: string]: string } = {
      "(": "(",
      ")": ")",
      "[": "[",
      "]": "]",
      "{": "{",
      "}": "}",
    };
    return icons[char] || char;
  };

  // get bracket type for coloring
  const getBracketTypeColor = (char: string): string => {
    if (["(", ")"].includes(char)) return "text-blue-200";
    if (["[", "]"].includes(char)) return "text-emerald-200";
    if (["{", "}"].includes(char)) return "text-purple-200";
    return "text-gray-200";
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          ref={containerRef}
          className="relative bg-gray-900/30 rounded-xl p-6 border border-white/10 mx-auto"
          style={{
            width: isMobile ? "100%" : "900px",
            minHeight: "500px",
          }}
        >
          {isMobile ? (
            // mobile layout: stacked vertically
            <div className="flex flex-col gap-8">
              {/* input string */}
              <div className="w-full">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Input String
                </h3>
                <div className="bg-gray-800/30 rounded-lg p-4">
                  {/* character indices */}
                  <div className="flex gap-1 mb-2 overflow-x-auto justify-center">
                    {stringData.map((_, index) => (
                      <div
                        key={`index-${index}`}
                        className="min-w-[40px] flex-shrink-0 text-center text-xs text-gray-400 font-mono py-1"
                      >
                        {index}
                      </div>
                    ))}
                  </div>

                  {/* character boxes */}
                  <div className="flex gap-1 overflow-x-auto justify-center pb-2">
                    {stringData.map((char, index) => (
                      <motion.div
                        key={`char-${index}-${char}`}
                        className={`min-w-[40px] flex-shrink-0 text-center font-mono font-bold text-lg py-3 px-2 rounded-lg border-2 bg-gradient-to-br transition-all duration-300 ${getCharacterStyle(
                          index
                        )} ${getBracketTypeColor(char)}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: highlights.currentChar.includes(index)
                            ? 1.1
                            : 1,
                          y: highlights.currentChar.includes(index) ? -4 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {getBracketIcon(char)}
                      </motion.div>
                    ))}
                  </div>

                  {/* current position indicator */}
                  {currentCharIndex >= 0 &&
                    currentCharIndex < stringData.length && (
                      <motion.div
                        className="flex justify-center mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className="flex justify-center"
                          style={{
                            transform: `translateX(${
                              (currentCharIndex -
                                Math.floor(stringData.length / 2)) *
                              41
                            }px)`,
                          }}
                        >
                          <motion.div
                            className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-transparent border-b-cyan-400"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>
                    )}
                </div>
              </div>

              {/* stack */}
              <div className="w-full">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Stack
                </h3>
                <div className="bg-gray-800/30 rounded-lg p-4 min-h-64 flex flex-col justify-end items-center">
                  {stackData.length === 0 ? (
                    <div className="text-gray-400 text-center">
                      <div className="text-4xl mb-2">📚</div>
                      <div className="text-sm">Stack is empty</div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 items-center">
                      {/* stack base */}
                      <div className="w-24 h-2 bg-gray-600 rounded-full mb-2"></div>
                      <div className="text-gray-400 text-xs mb-2">
                        Stack Base
                      </div>

                      <AnimatePresence>
                        {stackData
                          .slice()
                          .reverse()
                          .map((element, visualIndex) => {
                            const actualIndex =
                              stackData.length - 1 - visualIndex;
                            return (
                              <motion.div
                                key={element.id}
                                layoutId={`stack-element-${element.id}`}
                                className={`relative p-4 rounded-lg border-2 bg-gradient-to-br text-white font-bold shadow-lg min-w-[80px] text-center ${getStackElementStyle(
                                  element.id
                                )} ${getBracketTypeColor(element.value)}`}
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{
                                  opacity: 1,
                                  scale: highlights.stackTop.some(
                                    (id: string) => id === element.id
                                  )
                                    ? 1.05
                                    : 1,
                                  y: 0,
                                }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                  delay: visualIndex * 0.05,
                                }}
                              >
                                <div className="text-xl font-mono">
                                  {getBracketIcon(element.value)}
                                </div>
                                {/* stack level indicator */}
                                <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                                  {actualIndex}
                                </div>
                                {/* top indicator - show only for the topmost element */}
                                {visualIndex === 0 && (
                                  <motion.div
                                    className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-amber-400 text-xs font-bold"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    TOP
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // desktop layout: side by side
            <div className="flex gap-8 h-full">
              {/* input string - left side */}
              <div className="flex-1">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Input String
                </h3>
                <div className="bg-gray-800/30 rounded-lg p-4 h-full min-h-96">
                  {/* character indices */}
                  <div className="flex gap-1 mb-2 overflow-x-auto justify-center">
                    {stringData.map((_, index) => (
                      <div
                        key={`index-${index}`}
                        className="min-w-[50px] flex-shrink-0 text-center text-xs text-gray-400 font-mono py-1"
                      >
                        {index}
                      </div>
                    ))}
                  </div>

                  {/* character boxes */}
                  <div className="flex gap-1 overflow-x-auto justify-center pb-4">
                    {stringData.map((char, index) => (
                      <motion.div
                        key={`char-${index}-${char}`}
                        className={`min-w-[50px] flex-shrink-0 text-center font-mono font-bold text-xl py-4 px-3 rounded-lg border-2 bg-gradient-to-br transition-all duration-300 ${getCharacterStyle(
                          index
                        )} ${getBracketTypeColor(char)}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: 1,
                          scale: highlights.currentChar.includes(index)
                            ? 1.15
                            : 1,
                          y: highlights.currentChar.includes(index) ? -6 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {getBracketIcon(char)}
                      </motion.div>
                    ))}
                  </div>

                  {/* current position indicator */}
                  {currentCharIndex >= 0 &&
                    currentCharIndex < stringData.length && (
                      <motion.div
                        className="flex justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div
                          className="flex justify-center"
                          style={{
                            transform: `translateX(${
                              (currentCharIndex -
                                Math.floor(stringData.length / 2)) *
                              51
                            }px)`,
                          }}
                        >
                          <motion.div
                            className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-transparent border-b-cyan-400"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        </div>
                      </motion.div>
                    )}

                  {/* processing status */}
                  <div className="mt-6 text-center">
                    <div className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-lg">
                      <span className="text-cyan-200 text-sm font-medium">
                        {currentCharIndex === -1
                          ? "Ready to start"
                          : currentCharIndex >= stringData.length
                          ? "Processing complete"
                          : `Processing character ${currentCharIndex + 1} of ${
                              stringData.length
                            }`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* stack - right side */}
              <div className="flex-shrink-0" style={{ width: STACK_WIDTH }}>
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Stack
                </h3>
                <div className="bg-gray-800/30 rounded-lg p-4 h-full min-h-96 flex flex-col justify-end items-center">
                  {stackData.length === 0 ? (
                    <div className="text-gray-400 text-center">
                      <div className="text-6xl mb-4">📚</div>
                      <div className="text-lg font-medium">Stack is empty</div>
                      <div className="text-sm mt-1">
                        Push opening brackets here
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3 items-center w-full">
                      {/* stack base */}
                      <div className="w-32 h-3 bg-gray-600 rounded-full mb-4"></div>
                      <div className="text-gray-400 text-sm mb-2">
                        Stack Base
                      </div>

                      <AnimatePresence>
                        {stackData
                          .slice()
                          .reverse()
                          .map((element, visualIndex) => {
                            const actualIndex =
                              stackData.length - 1 - visualIndex;
                            return (
                              <motion.div
                                key={element.id}
                                layoutId={`stack-element-${element.id}`}
                                className={`relative p-4 rounded-lg border-2 bg-gradient-to-br text-white font-bold shadow-lg w-20 h-20 flex items-center justify-center ${getStackElementStyle(
                                  element.id
                                )} ${getBracketTypeColor(element.value)}`}
                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                animate={{
                                  opacity: 1,
                                  scale: highlights.stackTop.some(
                                    (id: string) => id === element.id
                                  )
                                    ? 1.1
                                    : 1,
                                  y: 0,
                                  rotate: highlights.stackTop.some(
                                    (id: string) => id === element.id
                                  )
                                    ? [0, -2, 2, 0]
                                    : 0,
                                }}
                                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 300,
                                  damping: 20,
                                  delay: visualIndex * 0.05,
                                }}
                              >
                                <div className="text-2xl font-mono">
                                  {getBracketIcon(element.value)}
                                </div>
                                {/* stack level indicator */}
                                <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 text-sm text-gray-400 font-mono">
                                  {actualIndex}
                                </div>
                                {/* top indicator */}
                                {visualIndex === 0 && (
                                  <motion.div
                                    className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-amber-400 text-xs font-bold"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                  >
                                    TOP
                                  </motion.div>
                                )}
                              </motion.div>
                            );
                          })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* explanation */}
      <motion.div
        className="mt-4 text-center text-gray-300 w-full max-w-2xl"
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-wide">
          {currentStep.explanation}
        </p>
      </motion.div>
    </div>
  );
};

export default BalancedParenthesesCanvas;
