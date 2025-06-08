import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, Shuffle, RotateCcw, Check, Plus, Minus } from "lucide-react";

interface LinkedListInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyValues: (values: number[]) => void;
  currentValues: number[];
  title?: string;
}

const LinkedListInputModal = ({
  isOpen,
  onClose,
  onApplyValues,
  currentValues,
  title = "Customize Linked List",
}: LinkedListInputModalProps) => {
  const [values, setValues] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  // example lists
  const exampleLists = [
    [1, 2, 3, 4, 5],
    [10, 20, 30],
    [5, 1, 8, 3, 7, 2],
    [100, 200],
    [9, 8, 7, 6, 5, 4, 3, 2, 1],
    [42],
  ];

  // initialize input values when modal opens
  useEffect(() => {
    if (isOpen) {
      setValues([...currentValues]);
      setInputValue("");
      setError("");
    }
  }, [isOpen, currentValues]);

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
      setError("List cannot be empty");
      return false;
    }

    if (newValues.length > 10) {
      setError("Maximum 10 nodes allowed");
      return false;
    }

    if (newValues.some((val) => val < -999 || val > 999)) {
      setError("Values must be between -999 and 999");
      return false;
    }

    setError("");
    return true;
  };

  const addValue = () => {
    const num = parseInt(inputValue.trim());
    if (isNaN(num)) {
      setError("Please enter a valid number");
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
    if (isNaN(num)) return;

    const newValues = [...values];
    newValues[index] = num;
    setValues(newValues);
    validateValues(newValues);
  };

  const generateRandomList = () => {
    const length = Math.floor(Math.random() * 6) + 3; // 3-8 nodes
    const newValues = Array.from(
      { length },
      () => Math.floor(Math.random() * 100) + 1
    );
    setValues(newValues);
    setError("");
  };

  const resetToDefault = () => {
    setValues([1, 2, 3, 4, 5]);
    setError("");
  };

  const selectExampleList = (list: number[]) => {
    setValues([...list]);
    setError("");
  };

  const handleApply = () => {
    if (validateValues(values)) {
      onApplyValues(values);
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
                Current List ({values.length} node
                {values.length !== 1 ? "s" : ""})
              </label>
              <div className="min-h-[60px] p-4 bg-white/5 border border-white/30 rounded-lg">
                {values.length === 0 ? (
                  <div className="text-gray-400 text-center italic">
                    No nodes in list
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {values.map((value, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-1 bg-blue-500/20 border border-blue-400/30 rounded-lg px-3 py-1"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => updateValue(index, e.target.value)}
                          className="w-12 bg-transparent text-blue-200 text-center text-sm font-mono focus:outline-none"
                          min="-999"
                          max="999"
                        />
                        <button
                          onClick={() => removeValue(index)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-150"
                        >
                          <Minus size={12} />
                        </button>
                      </motion.div>
                    ))}
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
                Add New Node
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleInputKeyPress}
                  placeholder="Enter value..."
                  min="-999"
                  max="999"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150"
                />
                <button
                  onClick={addValue}
                  disabled={!inputValue.trim() || values.length >= 10}
                  className="flex items-center justify-center w-12 h-12 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Values between -999 and 999 • Max 10 nodes
              </p>
            </div>

            {/* quick actions */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={generateRandomList}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <Shuffle size={14} />
                Random List
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <RotateCcw size={14} />
                Default
              </button>
            </div>

            {/* example lists */}
            <div className="mb-6">
              <h3 className="text-white text-sm mb-3">Example Lists:</h3>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {exampleLists.map((list, index) => (
                  <button
                    key={index}
                    onClick={() => selectExampleList(list)}
                    className="flex items-center justify-center p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-xs"
                  >
                    [{list.join(", ")}]
                  </button>
                ))}
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
                disabled={hasError || isEmpty}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply List
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LinkedListInputModal;
