import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import { X, Shuffle, RotateCcw, Check, Plus, Minus } from "lucide-react";

interface HeapInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyInput: (array: number[], k: number) => void;
  currentArray: number[];
  currentK: number;
  title?: string;
}

const HeapInputModal = ({
  isOpen,
  onClose,
  onApplyInput,
  currentArray,
  currentK,
  title = "Customize Input",
}: HeapInputModalProps) => {
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [kValue, setKValue] = useState(3);
  const [error, setError] = useState("");
  const [arrayInput, setArrayInput] = useState("");

  // preset examples
  const presetExamples = useMemo(
    () => [
      {
        name: "Small Example",
        array: [3, 1, 4, 1, 5, 9, 2, 6],
        k: 3,
        description: "8 elements, find 3 largest",
      },
      {
        name: "Medium Example",
        array: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42],
        k: 4,
        description: "11 elements, find 4 largest",
      },
      {
        name: "Large Example",
        array: [15, 20, 8, 10, 5, 7, 6, 2, 9, 1, 25, 30, 35, 40, 45],
        k: 5,
        description: "15 elements, find 5 largest",
      },
      {
        name: "Duplicates",
        array: [5, 5, 5, 3, 3, 3, 1, 1, 1, 7, 7, 7],
        k: 4,
        description: "With duplicate values",
      },
      {
        name: "Already Sorted",
        array: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        k: 3,
        description: "Ascending order",
      },
      {
        name: "Reverse Sorted",
        array: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        k: 4,
        description: "Descending order",
      },
    ],
    []
  );

  // initialize values when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputArray([...currentArray]);
      setKValue(currentK);
      setArrayInput(currentArray.join(", "));
      setError("");
    }
  }, [isOpen, currentArray, currentK]);

  // handle Esc key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  const validateInput = (newArray: number[], newK: number): boolean => {
    if (newArray.length === 0) {
      setError("Array cannot be empty");
      return false;
    }

    if (newArray.length > 50) {
      setError("Maximum 50 elements allowed for performance");
      return false;
    }

    if (newK <= 0) {
      setError("K must be greater than 0");
      return false;
    }

    if (newK > newArray.length) {
      setError("K cannot be greater than array length");
      return false;
    }

    if (
      newArray.some(
        (val) => !Number.isInteger(val) || val < -1000 || val > 1000
      )
    ) {
      setError("Array elements must be integers between -1000 and 1000");
      return false;
    }

    setError("");
    return true;
  };

  const parseArrayInput = (input: string): number[] => {
    try {
      // handle different formats: "1,2,3" or "1 2 3" or "[1,2,3]"
      const cleaned = input.replace(/[\[\]]/g, "").trim();
      const parts = cleaned.split(/[,\s]+/).filter((part) => part.length > 0);

      const numbers = parts.map((part) => {
        const num = parseInt(part.trim(), 10);
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${part}`);
        }
        return num;
      });

      return numbers;
    } catch (e) {
      throw new Error(
        "Invalid array format. Use comma or space separated numbers."
      );
    }
  };

  const handleArrayInputChange = (value: string) => {
    setArrayInput(value);

    if (value.trim()) {
      try {
        const parsed = parseArrayInput(value);
        if (validateInput(parsed, kValue)) {
          setInputArray(parsed);
        }
      } catch (e) {
        setError((e as Error).message);
      }
    }
  };

  const handleKChange = (newK: number) => {
    setKValue(newK);
    if (inputArray.length > 0) {
      validateInput(inputArray, newK);
    }
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 8) + 8; // 8-15 elements
    const newArray = Array.from(
      { length },
      () => Math.floor(Math.random() * 100) + 1
    );
    const newK = Math.min(Math.floor(Math.random() * 4) + 3, length); // 3-6 or length

    setInputArray(newArray);
    setKValue(newK);
    setArrayInput(newArray.join(", "));
    setError("");
  };

  const resetToDefault = () => {
    const defaultArray = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];
    const defaultK = 4;

    setInputArray(defaultArray);
    setKValue(defaultK);
    setArrayInput(defaultArray.join(", "));
    setError("");
  };

  const selectPreset = (preset: (typeof presetExamples)[0]) => {
    setInputArray([...preset.array]);
    setKValue(preset.k);
    setArrayInput(preset.array.join(", "));
    setError("");
  };

  const handleApply = () => {
    if (validateInput(inputArray, kValue)) {
      onApplyInput(inputArray, kValue);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
          />

          {/* modal content */}
          <motion.div
            className="relative w-full max-w-4xl bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 hover:border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* left panel - input configuration */}
              <div className="space-y-6">
                {/* array input */}
                <div>
                  <label className="block text-white text-sm mb-2">
                    Input Array
                  </label>
                  <textarea
                    value={arrayInput}
                    onChange={(e) => handleArrayInputChange(e.target.value)}
                    placeholder="Enter numbers separated by commas: 3, 1, 4, 1, 5, 9"
                    className="w-full h-24 px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-colors duration-150 resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Supports comma or space separated format. Max 50 elements.
                  </div>
                </div>

                {/* k value input */}
                <div>
                  <label className="block text-white text-sm mb-2">
                    K Value (Number of largest elements to find)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleKChange(Math.max(1, kValue - 1))}
                      disabled={kValue <= 1}
                      className="flex items-center justify-center w-10 h-10 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <Minus size={16} />
                    </button>
                    <input
                      type="number"
                      value={kValue}
                      onChange={(e) =>
                        handleKChange(parseInt(e.target.value) || 1)
                      }
                      min="1"
                      max={inputArray.length}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-center font-mono font-bold focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-colors duration-150"
                    />
                    <button
                      onClick={() =>
                        handleKChange(Math.min(inputArray.length, kValue + 1))
                      }
                      disabled={kValue >= inputArray.length}
                      className="flex items-center justify-center w-10 h-10 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Must be between 1 and {inputArray.length || "array length"}
                  </div>
                </div>

                {/* error display */}
                {error && (
                  <motion.div
                    className="p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.15 }}
                  >
                    <p className="text-red-200 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* array preview */}
                <div>
                  <label className="block text-white text-sm mb-2">
                    Preview ({inputArray.length} elements)
                  </label>
                  <div className="h-16 p-3 bg-white/5 border border-white/30 rounded-lg overflow-x-auto">
                    <div className="flex items-center gap-1 h-full">
                      {inputArray.slice(0, 15).map((value, index) => (
                        <div
                          key={index}
                          className="min-w-[28px] flex-shrink-0 text-center font-mono text-xs py-1 px-1 rounded bg-purple-500/30 border border-purple-400/50 text-purple-200"
                        >
                          {value}
                        </div>
                      ))}
                      {inputArray.length > 15 && (
                        <div className="min-w-[28px] flex-shrink-0 text-center font-mono text-xs py-1 px-1 text-gray-400">
                          +{inputArray.length - 15}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* right panel - presets and controls */}
              <div className="space-y-6">
                {/* quick actions */}
                <div className="flex gap-2">
                  <button
                    onClick={generateRandomArray}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
                  >
                    <Shuffle size={14} />
                    Random
                  </button>
                  <button
                    onClick={resetToDefault}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
                  >
                    <RotateCcw size={14} />
                    Default
                  </button>
                </div>

                {/* preset examples */}
                <div>
                  <h3 className="text-white text-sm mb-3">Example Presets:</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {presetExamples.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => selectPreset(preset)}
                        className="w-full text-left p-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150"
                      >
                        <div className="font-medium text-sm mb-1">
                          {preset.name}
                        </div>
                        <div className="text-gray-400 text-xs mb-2">
                          {preset.description}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1 overflow-hidden">
                            {preset.array.slice(0, 8).map((val, i) => (
                              <span
                                key={i}
                                className="text-xs font-mono bg-purple-500/20 px-1 rounded"
                              >
                                {val}
                              </span>
                            ))}
                            {preset.array.length > 8 && (
                              <span className="text-xs text-gray-500">
                                +{preset.array.length - 8}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-emerald-400 font-medium ml-auto">
                            K={preset.k}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* current stats */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20 rounded-xl">
                  <h4 className="text-white text-sm font-medium mb-2">
                    Current Configuration:
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Array Length:</span>
                      <span className="text-white font-mono">
                        {inputArray.length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">K Value:</span>
                      <span className="text-emerald-400 font-mono">
                        {kValue}
                      </span>
                    </div>
                    {inputArray.length > 0 && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Min Value:</span>
                          <span className="text-white font-mono">
                            {Math.min(...inputArray)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">Max Value:</span>
                          <span className="text-white font-mono">
                            {Math.max(...inputArray)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/0 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!!error || inputArray.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply Configuration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HeapInputModal;
