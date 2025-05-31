import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Shuffle, RotateCcw, Check } from "lucide-react";

interface ArrayInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyArray: (array: number[]) => void;
  currentArray: number[];
}

const ArrayInputModal = ({
  isOpen,
  onClose,
  onApplyArray,
  currentArray,
}: ArrayInputModalProps) => {
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // initialize input values when modal opens
  useEffect(() => {
    if (isOpen) {
      const values = currentArray.map((num) => num.toString());
      // ensure at least 3 inputs
      while (values.length < 3) {
        values.push("");
      }
      setInputValues(values);
      setErrors(new Array(values.length).fill(""));
    }
  }, [isOpen, currentArray]);

  // Handle Esc key to close modal
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

  const validateInput = (value: string, index: number) => {
    const newErrors = [...errors];

    if (value === "") {
      newErrors[index] = "";
      setErrors(newErrors);
      return true;
    }

    const num = parseInt(value);
    if (isNaN(num)) {
      newErrors[index] = "Must be a number";
      setErrors(newErrors);
      return false;
    }

    if (num < -999 || num > 999) {
      newErrors[index] = "Range: -999 to 999";
      setErrors(newErrors);
      return false;
    }

    newErrors[index] = "";
    setErrors(newErrors);
    return true;
  };

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value;
    setInputValues(newValues);
    validateInput(value, index);
  };

  const addInput = () => {
    if (inputValues.length < 8) {
      setInputValues([...inputValues, ""]);
      setErrors([...errors, ""]);
    }
  };

  const removeInput = () => {
    if (inputValues.length > 1) {
      setInputValues(inputValues.slice(0, -1));
      setErrors(errors.slice(0, -1));
    }
  };

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 3) + 3; // 3-5 elements
    const randomValues = Array.from({ length: size }, () => {
      return (Math.floor(Math.random() * 1999) - 999).toString(); // -999 to +999
    });

    setInputValues(randomValues);
    setErrors(new Array(randomValues.length).fill(""));
  };

  const resetToDefault = () => {
    const defaultValues = ["64", "34", "25"];
    setInputValues(defaultValues);
    setErrors(new Array(defaultValues.length).fill(""));
  };

  const handleApply = () => {
    // filter out empty values and convert to numbers
    const validNumbers = inputValues
      .filter((val) => val.trim() !== "")
      .map((val) => parseInt(val))
      .filter((num) => !isNaN(num) && num >= -999 && num <= 999);

    if (validNumbers.length === 0) {
      // if no valid numbers, use default
      onApplyArray([64, 34, 25]);
    } else {
      onApplyArray(validNumbers);
    }
    onClose();
  };

  const hasErrors = errors.some((error) => error !== "");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
          style={{ willChange: "opacity" }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
            style={{ willChange: "opacity" }}
          />

          {/* modal content */}
          <motion.div
            className="relative w-full max-w-md bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: "transform, opacity" }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Customize Array</h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 hover:border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            {/* input section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-white text-sm">Array Elements</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={removeInput}
                    disabled={inputValues.length <= 1}
                    className="flex items-center justify-center w-8 h-8 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="text-gray-300 text-sm">
                    {inputValues.length}/8
                  </span>
                  <button
                    onClick={addInput}
                    disabled={inputValues.length >= 8}
                    className="flex items-center justify-center w-8 h-8 border border-white/20 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* input grid */}
              <div className="grid grid-cols-2 gap-3">
                {inputValues.map((value, index) => (
                  <div key={index} className="space-y-1">
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder={`Element ${index + 1}`}
                      min="-999"
                      max="999"
                      className={`w-full px-3 py-2 bg-white/5 border ${
                        errors[index] ? "border-red-400/60" : "border-white/30"
                      } rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150`}
                    />
                    {errors[index] && (
                      <motion.p
                        className="text-red-400 text-xs"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.15 }}
                      >
                        {errors[index]}
                      </motion.p>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-gray-400 text-xs mt-3">
                Range: -999 to 999 • Leave empty to exclude • Max 8 elements
              </p>
            </div>

            {/* quick actions */}
            <div className="flex gap-2 mb-6">
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

            {/* action buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-white/0 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={hasErrors}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
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

export default ArrayInputModal;
