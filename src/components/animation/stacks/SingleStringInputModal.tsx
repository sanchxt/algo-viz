import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle, RotateCcw, Check, BookOpen } from "lucide-react";

interface StringInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyString: (input: string) => void;
  currentInput: string;
  title?: string;
  placeholder?: string;
  maxLength?: number;
  validationPattern?: RegExp;
  validationMessage?: string;
}

const SingleStringInputModal = ({
  isOpen,
  onClose,
  onApplyString,
  currentInput,
  title = "Customize Input String",
  placeholder = "Enter your input...",
  maxLength = 20,
  validationPattern = /^[()[\]{}]*$/,
  validationMessage = "Only brackets allowed: ( ) [ ] { }",
}: StringInputModalProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  // init input value when modal opens
  useEffect(() => {
    if (isOpen) {
      setInputValue(currentInput);
      setError("");
    }
  }, [isOpen, currentInput]);

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

  const validateInput = (value: string) => {
    if (value.length > maxLength) {
      setError(`Maximum length is ${maxLength} characters`);
      return false;
    }

    if (!validationPattern.test(value)) {
      setError(validationMessage);
      return false;
    }

    setError("");
    return true;
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    validateInput(value);
  };

  const generateRandomString = () => {
    const brackets = ["(", ")", "[", "]", "{", "}"];
    const length = Math.floor(Math.random() * 8) + 4; // 4-11 characters
    let result = "";

    for (let i = 0; i < length; i++) {
      result += brackets[Math.floor(Math.random() * brackets.length)];
    }

    setInputValue(result);
    validateInput(result);
  };

  const resetToDefault = () => {
    const defaultValue = "()[]{}";
    setInputValue(defaultValue);
    validateInput(defaultValue);
  };

  const handleApply = () => {
    if (validateInput(inputValue)) {
      onApplyString(inputValue);
      onClose();
    }
  };

  const hasError = error !== "";

  // preset examples
  const presetExamples = [
    { input: "()", label: "Simple", valid: true },
    { input: "()[]", label: "Mixed", valid: true },
    { input: "()[]{}", label: "All Types", valid: true },
    { input: "([{}])", label: "Nested", valid: true },
    { input: "((()))", label: "Deep", valid: true },
    { input: "([)]", label: "Invalid", valid: false },
    { input: "(()", label: "Unmatched", valid: false },
    { input: "())", label: "Extra Close", valid: false },
  ];

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
            className="relative w-full max-w-lg bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: "transform, opacity" }}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen size={20} />
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 hover:border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            {/* input section */}
            <div className="mb-6">
              <label className="text-white text-sm mb-3 block">
                Input String
              </label>

              <div className="space-y-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    hasError ? "border-red-400/60" : "border-white/30"
                  } rounded-lg text-white text-lg font-mono placeholder-gray-400 focus:outline-none focus:border-purple-400/60 focus:ring-2 focus:ring-purple-400/20 transition-colors duration-150 resize-none`}
                />

                {/* character count */}
                <div className="flex justify-between items-center text-sm">
                  <span
                    className={`${hasError ? "text-red-400" : "text-gray-400"}`}
                  >
                    {inputValue.length}/{maxLength} characters
                  </span>
                  {hasError && (
                    <span className="text-red-400 text-xs">{error}</span>
                  )}
                </div>

                {/* visual preview */}
                {inputValue.length > 0 && (
                  <div className="p-3 bg-gray-800/50 rounded-lg border border-white/10">
                    <div className="text-gray-300 text-xs mb-2">Preview:</div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {inputValue.split("").map((char, index) => (
                        <span
                          key={index}
                          className={`font-mono text-sm font-bold px-2 py-1 rounded border ${
                            ["(", ")"].includes(char)
                              ? "text-blue-200 border-blue-400/30 bg-blue-500/20"
                              : ["[", "]"].includes(char)
                              ? "text-emerald-200 border-emerald-400/30 bg-emerald-500/20"
                              : ["{", "}"].includes(char)
                              ? "text-purple-200 border-purple-400/30 bg-purple-500/20"
                              : "text-red-200 border-red-400/30 bg-red-500/20"
                          }`}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* quick actions */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={generateRandomString}
                className="flex items-center gap-2 px-3 py-2 bg-amber-600/10 border border-amber-400/40 rounded-lg text-amber-200 hover:bg-amber-600/20 transition-colors duration-150 font-medium text-sm flex-1"
              >
                <Shuffle size={14} />
                Random
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/20 transition-colors duration-150 font-medium text-sm flex-1"
              >
                <RotateCcw size={14} />
                Default
              </button>
            </div>

            {/* preset examples */}
            <div className="mb-6">
              <div className="text-white text-sm mb-3">Quick Examples:</div>
              <div className="grid grid-cols-2 gap-2">
                {presetExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInputValue(example.input);
                      validateInput(example.input);
                    }}
                    className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all duration-150 ${
                      inputValue === example.input
                        ? "bg-purple-500/30 border-purple-400/50 text-purple-200"
                        : example.valid
                        ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200 hover:bg-emerald-500/20"
                        : "bg-red-500/10 border-red-400/30 text-red-200 hover:bg-red-500/20"
                    }`}
                    title={`${example.label} - ${
                      example.valid ? "Valid" : "Invalid"
                    }`}
                  >
                    "{example.input}"
                  </button>
                ))}
              </div>
            </div>

            {/* validation info */}
            <div className="mb-6 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <div className="text-blue-200 text-sm font-medium mb-1">
                Input Requirements:
              </div>
              <ul className="text-blue-200 text-xs space-y-1">
                <li>• Only bracket characters: ( ) [ ] {}</li>
                <li>• Maximum length: {maxLength} characters</li>
                <li>• Can include both valid and invalid patterns</li>
              </ul>
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
                disabled={hasError}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply Input
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SingleStringInputModal;
