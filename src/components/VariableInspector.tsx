import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { AlgorithmStep } from "../types/algorithm";

interface VariableInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: AlgorithmStep;
  previousStep?: AlgorithmStep;
  className?: string;
}

interface ExpandedSections {
  variables: boolean;
  array: boolean;
}

const VariableInspector = ({
  isOpen,
  onClose,
  currentStep,
  previousStep,
  className = "",
}: VariableInspectorProps) => {
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    variables: true,
    array: true,
  });

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Helper functions
  const variables = currentStep?.variables || {};
  const previousVariables = previousStep?.variables || {};

  const hasVariableChanged = (key: string): boolean => {
    return variables[key] !== previousVariables[key];
  };

  const hasArrayChanged = (): boolean => {
    if (!previousStep || !currentStep) return false;
    return (
      JSON.stringify(currentStep.arrayState) !==
      JSON.stringify(previousStep.arrayState)
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Variable Inspector Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: window.innerWidth >= 1024 ? 30 : 0,
              y: window.innerWidth < 1024 ? 50 : 0,
              scale: window.innerWidth < 1024 ? 0.95 : 1,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: window.innerWidth >= 1024 ? 30 : 0,
              y: window.innerWidth < 1024 ? 50 : 0,
              scale: window.innerWidth < 1024 ? 0.95 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              ${className}
              lg:relative lg:z-auto lg:inset-auto lg:bg-transparent lg:border-0 lg:rounded-none lg:shadow-none lg:backdrop-blur-none
              fixed top-4 left-4 right-4 bottom-4 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden
            `}
          >
            {/* Mobile Close Button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Variable Inspector
              </h3>
              <motion.button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={16} />
              </motion.button>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Variable Inspector
              </h3>
              {currentStep && (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-200 text-sm font-medium">
                    Step {currentStep.id + 1}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ height: "500px" }}>
              {currentStep ? (
                <div className="space-y-6">
                  {/* Variables Section */}
                  <div>
                    <motion.button
                      onClick={() => toggleSection("variables")}
                      className="flex items-center justify-between w-full mb-4 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-semibold">Variables</span>
                        {Object.keys(variables).some(hasVariableChanged) && (
                          <motion.div
                            className="w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedSections.variables ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {expandedSections.variables ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </motion.div>
                    </motion.button>

                    {expandedSections.variables && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {Object.entries(variables).map(([key, value]) => {
                          const isChanged = hasVariableChanged(key);
                          return (
                            <motion.div
                              key={key}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                                isChanged
                                  ? "bg-yellow-500/20 border-yellow-400/30 shadow-lg shadow-yellow-400/10"
                                  : "bg-white/5 border-white/10"
                              }`}
                              animate={isChanged ? { scale: [1, 1.02, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    isChanged ? "bg-yellow-400" : "bg-gray-500"
                                  }`}
                                />
                                <span className="text-gray-300 font-mono text-sm">
                                  {key}
                                </span>
                              </div>
                              <motion.span
                                className={`font-mono font-semibold ${
                                  isChanged ? "text-yellow-200" : "text-white"
                                }`}
                                animate={
                                  isChanged ? { scale: [1, 1.1, 1] } : {}
                                }
                                transition={{ duration: 0.3 }}
                              >
                                {String(value)}
                              </motion.span>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>

                  {/* Array Section */}
                  <div>
                    <motion.button
                      onClick={() => toggleSection("array")}
                      className="flex items-center justify-between w-full mb-4 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="font-semibold">Array State</span>
                        {hasArrayChanged() && (
                          <motion.div
                            className="w-2 h-2 bg-yellow-400 rounded-full"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <motion.div
                        animate={{
                          rotate: expandedSections.array ? 180 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {expandedSections.array ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </motion.div>
                    </motion.button>

                    {expandedSections.array && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          hasArrayChanged()
                            ? "bg-purple-500/20 border-purple-400/30 shadow-lg shadow-purple-400/10"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-gray-300 text-sm font-medium">
                            Length: {currentStep.arrayState.length}
                          </span>
                          {hasArrayChanged() && (
                            <motion.span
                              className="text-yellow-200 text-xs px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-400/30"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              Modified
                            </motion.span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          {/* Array indices */}
                          <div className="flex gap-1 mb-1 overflow-x-auto">
                            {currentStep.arrayState.map((_, index) => (
                              <div
                                key={`index-${index}`}
                                className="min-w-[40px] flex-shrink-0 text-center text-xs text-gray-400 font-mono py-1"
                              >
                                [{index}]
                              </div>
                            ))}
                          </div>

                          {/* Array values */}
                          <div className="flex gap-1 overflow-x-auto pb-2">
                            {currentStep.arrayState.map((value, index) => {
                              const isHighlighted =
                                currentStep.highlightedIndices?.includes(index);
                              const isComparing =
                                currentStep.compareIndices?.includes(index);
                              const isSwapping =
                                currentStep.swapIndices?.includes(index);

                              let bgColor = "bg-white/10";
                              let textColor = "text-white";
                              let borderColor = "border-white/20";

                              if (isSwapping) {
                                bgColor = "bg-red-500/30";
                                textColor = "text-red-200";
                                borderColor = "border-red-400/40";
                              } else if (isComparing) {
                                bgColor = "bg-yellow-500/30";
                                textColor = "text-yellow-200";
                                borderColor = "border-yellow-400/40";
                              } else if (isHighlighted) {
                                bgColor = "bg-green-500/30";
                                textColor = "text-green-200";
                                borderColor = "border-green-400/40";
                              }

                              return (
                                <motion.div
                                  key={`value-${index}-${value}`}
                                  className={`min-w-[40px] flex-shrink-0 text-center font-mono font-semibold text-sm py-2 px-1 rounded-lg border ${bgColor} ${textColor} ${borderColor}`}
                                  animate={
                                    isSwapping || isComparing
                                      ? { scale: [1, 1.1, 1] }
                                      : isHighlighted
                                      ? { scale: [1, 1.05, 1] }
                                      : {}
                                  }
                                  transition={{ duration: 0.3 }}
                                >
                                  {value}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Array status indicators */}
                        <div className="flex flex-wrap gap-2 mt-4 text-xs">
                          {currentStep.compareIndices &&
                            currentStep.compareIndices.length > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
                                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                <span className="text-yellow-200">
                                  Comparing:{" "}
                                  {currentStep.compareIndices.join(", ")}
                                </span>
                              </div>
                            )}
                          {currentStep.swapIndices &&
                            currentStep.swapIndices.length > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 rounded-lg border border-red-400/30">
                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                <span className="text-red-200">
                                  Swapping: {currentStep.swapIndices.join(", ")}
                                </span>
                              </div>
                            )}
                          {currentStep.highlightedIndices &&
                            currentStep.highlightedIndices.length > 0 && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg border border-green-400/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-green-200">
                                  Sorted:{" "}
                                  {currentStep.highlightedIndices.join(", ")}
                                </span>
                              </div>
                            )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    className="text-gray-400 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Eye size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No step data available</p>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VariableInspector;
