import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle, RotateCcw, Check } from "lucide-react";

interface StringInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyStrings: (string1: string, string2: string) => void;
  currentString1: string;
  currentString2: string;
  title?: string;
}

const StringInputModal = ({
  isOpen,
  onClose,
  onApplyStrings,
  currentString1,
  currentString2,
  title = "Customize Strings",
}: StringInputModalProps) => {
  const [string1, setString1] = useState("");
  const [string2, setString2] = useState("");
  const [errors, setErrors] = useState({ string1: "", string2: "" });

  // example pairs
  const examplePairs = [
    { string1: "listen", string2: "silent" },
    { string1: "evil", string2: "vile" },
    { string1: "a gentleman", string2: "elegant man" },
    { string1: "conversation", string2: "voices rant on" },
    { string1: "astronomer", string2: "moon starer" },
    { string1: "the eyes", string2: "they see" },
  ];

  // initialize input values when modal opens
  useEffect(() => {
    if (isOpen) {
      setString1(currentString1);
      setString2(currentString2);
      setErrors({ string1: "", string2: "" });
    }
  }, [isOpen, currentString1, currentString2]);

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

  const validateInput = (value: string, field: "string1" | "string2") => {
    const newErrors = { ...errors };

    if (value.trim() === "") {
      newErrors[field] = "String cannot be empty";
      setErrors(newErrors);
      return false;
    }

    if (value.length > 50) {
      newErrors[field] = "String too long (max 50 characters)";
      setErrors(newErrors);
      return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(value)) {
      newErrors[field] = "Only letters and spaces allowed";
      setErrors(newErrors);
      return false;
    }

    newErrors[field] = "";
    setErrors(newErrors);
    return true;
  };

  const handleString1Change = (value: string) => {
    setString1(value);
    validateInput(value, "string1");
  };

  const handleString2Change = (value: string) => {
    setString2(value);
    validateInput(value, "string2");
  };

  const generateRandomPair = () => {
    const randomPair =
      examplePairs[Math.floor(Math.random() * examplePairs.length)];
    setString1(randomPair.string1);
    setString2(randomPair.string2);
    setErrors({ string1: "", string2: "" });
  };

  const resetToDefault = () => {
    setString1("listen");
    setString2("silent");
    setErrors({ string1: "", string2: "" });
  };

  const selectExamplePair = (pair: { string1: string; string2: string }) => {
    setString1(pair.string1);
    setString2(pair.string2);
    setErrors({ string1: "", string2: "" });
  };

  const handleApply = () => {
    const isString1Valid = validateInput(string1, "string1");
    const isString2Valid = validateInput(string2, "string2");

    if (isString1Valid && isString2Valid) {
      onApplyStrings(string1.trim(), string2.trim());
      onClose();
    }
  };

  const hasErrors = errors.string1 !== "" || errors.string2 !== "";
  const isEmpty = string1.trim() === "" || string2.trim() === "";

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
            className="relative w-full max-w-lg bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl"
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

            {/* input section */}
            <div className="space-y-4 mb-6">
              {/* string 1 input */}
              <div>
                <label className="block text-white text-sm mb-2">
                  First String
                </label>
                <input
                  type="text"
                  value={string1}
                  onChange={(e) => handleString1Change(e.target.value)}
                  placeholder="Enter first string..."
                  maxLength={50}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.string1 ? "border-red-400/60" : "border-white/30"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150`}
                />
                {errors.string1 && (
                  <motion.p
                    className="text-red-400 text-xs mt-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.15 }}
                  >
                    {errors.string1}
                  </motion.p>
                )}
              </div>

              {/* string 2 input */}
              <div>
                <label className="block text-white text-sm mb-2">
                  Second String
                </label>
                <input
                  type="text"
                  value={string2}
                  onChange={(e) => handleString2Change(e.target.value)}
                  placeholder="Enter second string..."
                  maxLength={50}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.string2 ? "border-red-400/60" : "border-white/30"
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150`}
                />
                {errors.string2 && (
                  <motion.p
                    className="text-red-400 text-xs mt-1"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.15 }}
                  >
                    {errors.string2}
                  </motion.p>
                )}
              </div>

              <p className="text-gray-400 text-xs">
                Letters and spaces only • Max 50 characters each
              </p>
            </div>

            {/* quick actions */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={generateRandomPair}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <Shuffle size={14} />
                Random Pair
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <RotateCcw size={14} />
                Default
              </button>
            </div>

            {/* example pairs */}
            <div className="mb-6">
              <h3 className="text-white text-sm mb-3">Example Pairs:</h3>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {examplePairs.map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => selectExamplePair(pair)}
                    className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-xs"
                  >
                    <span>
                      "{pair.string1}" ↔ "{pair.string2}"
                    </span>
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
                disabled={hasErrors || isEmpty}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply Strings
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StringInputModal;
