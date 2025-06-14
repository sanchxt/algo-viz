import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, Shuffle, RotateCcw, Check, Plus, Minus } from "lucide-react";

interface MinCostInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyArray: (values: number[]) => void;
  currentArray: number[];
  title?: string;
}

const MinCostInputModal = ({
  isOpen,
  onClose,
  onApplyArray,
  currentArray,
  title = "Customize Array for Greedy Algorithm",
}: MinCostInputModalProps) => {
  const [values, setValues] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // example arrays for different scenarios
  const exampleArrays = [
    [3, 1, 4, 2],
    [10, 5, 8],
    [1, 2, 3, 4, 5, 6],
    [50, 20, 30, 10],
    [7, 3, 9, 1, 5, 2],
    [15, 8, 12, 6, 10],
    [100, 1, 50],
    [25],
  ];

  // initialize input values when modal opens
  useEffect(() => {
    if (isOpen) {
      setValues([...currentArray]);
      setInputValue("");
      setError("");
    }
  }, [isOpen, currentArray]);

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

  const validateValues = (newValues: number[]): boolean => {
    if (newValues.length === 0) {
      setError("Array cannot be empty");
      return false;
    }

    if (newValues.length === 1) {
      setError("Array must have at least 2 elements for meaningful operations");
      return false;
    }

    if (newValues.length > 12) {
      setError("Maximum 12 elements allowed for visualization clarity");
      return false;
    }

    if (newValues.some((val) => val < 1 || val > 999)) {
      setError("Values must be positive integers between 1 and 999");
      return false;
    }

    setError("");
    return true;
  };

  const addValue = () => {
    const num = parseInt(inputValue.trim());
    if (isNaN(num) || num < 1) {
      setError("Please enter a positive integer");
      return;
    }

    const newValues = [...values, num];
    if (validateValues(newValues)) {
      setValues(newValues);
      setInputValue("");
    }
  };

  const removeValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    if (validateValues(newValues)) {
      setValues(newValues);
    }
  };

  const updateValue = (index: number, newValue: string) => {
    const num = parseInt(newValue.trim());
    if (isNaN(num) || num < 1) return;

    const newValues = [...values];
    newValues[index] = num;
    setValues(newValues);
    validateValues(newValues);
  };

  const generateRandomArray = () => {
    const length = Math.floor(Math.random() * 6) + 3; // 3-8 elements
    const newValues = Array.from(
      { length },
      () => Math.floor(Math.random() * 50) + 1 // 1-50
    );
    setValues(newValues);
    setError("");
  };

  const resetToDefault = () => {
    setValues([3, 1, 4, 2]);
    setError("");
  };

  const selectExampleArray = (array: number[]) => {
    setValues([...array]);
    setError("");
  };

  const handleApply = () => {
    if (validateValues(values)) {
      onApplyArray(values);
      onClose();
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addValue();
    }
  };

  const hasError = error !== "";
  const isEmpty = values.length === 0;
  const minElement = values.length > 0 ? Math.min(...values) : 0;
  const expectedCost = values.length > 1 ? (values.length - 1) * minElement : 0;

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
            className="relative w-full max-w-lg bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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

            {/* current values display */}
            <div className="mb-6">
              <label className="block text-white text-sm mb-3">
                Current Array ({values.length} element
                {values.length !== 1 ? "s" : ""})
              </label>
              <div className="min-h-[80px] p-4 bg-white/5 border border-white/30 rounded-lg">
                {values.length === 0 ? (
                  <div className="text-gray-400 text-center italic">
                    No elements in array
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {values.map((value, index) => {
                      const isMinElement = value === minElement;

                      return (
                        <motion.div
                          key={index}
                          className={`relative flex items-center gap-1 rounded-lg px-3 py-2 border ${
                            isMinElement
                              ? "bg-green-500/20 border-green-400/30"
                              : "bg-violet-500/20 border-violet-400/30"
                          }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="number"
                            value={value}
                            onChange={(e) => updateValue(index, e.target.value)}
                            className="w-12 bg-transparent text-center text-sm font-mono focus:outline-none"
                            style={{
                              color: isMinElement ? "#86efac" : "#c4b5fd",
                            }}
                            min="1"
                            max="999"
                          />
                          {isMinElement && (
                            <div className="absolute -top-1 -right-1 px-1 py-0.5 bg-green-600 rounded text-xs font-bold text-white">
                              MIN
                            </div>
                          )}
                          <button
                            onClick={() => removeValue(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150 ml-1"
                          >
                            <Minus size={12} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
              {hasError && (
                <motion.p
                  className="text-red-400 text-xs mt-2"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.15 }}
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* add new value */}
            <div className="mb-6">
              <label className="block text-white text-sm mb-2">
                Add New Element
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Enter positive integer..."
                  min="1"
                  max="999"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20 transition-colors duration-150"
                />
                <button
                  onClick={addValue}
                  disabled={!inputValue.trim() || values.length >= 12}
                  className="flex items-center justify-center w-12 h-12 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Positive integers 1-999 • Max 12 elements • Min 2 elements
              </p>
            </div>

            {/* strategy preview */}
            {values.length > 1 && (
              <div className="mb-6 p-3 bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-400/30 rounded-lg">
                <div className="text-green-200 text-sm font-semibold mb-1">
                  Greedy Strategy Preview
                </div>
                <div className="text-xs text-gray-300">
                  Min element:{" "}
                  <span className="text-green-400 font-mono">{minElement}</span>{" "}
                  • Operations:{" "}
                  <span className="text-cyan-400 font-mono">
                    {values.length - 1}
                  </span>{" "}
                  • Expected cost:{" "}
                  <span className="text-purple-400 font-mono">
                    {expectedCost}
                  </span>
                </div>
              </div>
            )}

            {/* quick actions */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={generateRandomArray}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <Shuffle size={14} />
                Random Array
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <RotateCcw size={14} />
                Default
              </button>
            </div>

            {/* example arrays */}
            <div className="mb-6">
              <h3 className="text-white text-sm mb-3">Example Arrays:</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {exampleArrays.map((array, index) => {
                  const arrayMin = Math.min(...array);
                  const arrayCost =
                    array.length > 1 ? (array.length - 1) * arrayMin : 0;

                  return (
                    <button
                      key={index}
                      onClick={() => selectExampleArray(array)}
                      className="flex flex-col items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-xs"
                    >
                      <div className="font-mono">[{array.join(", ")}]</div>
                      <div className="text-gray-400 text-[10px] mt-1">
                        Cost: {arrayCost}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/0 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={hasError || isEmpty || values.length < 2}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply Array
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MinCostInputModal;
