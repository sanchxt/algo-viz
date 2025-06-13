import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X, Shuffle, RotateCcw, Check, Plus, Minus, Coins } from "lucide-react";

interface CoinChangeInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyValues: (coins: number[], amount: number) => void;
  currentCoins: number[];
  currentAmount: number;
  title?: string;
}

const CoinChangeInputModal = ({
  isOpen,
  onClose,
  onApplyValues,
  currentCoins,
  currentAmount,
  title = "Customize Coin Change Problem",
}: CoinChangeInputModalProps) => {
  const [coins, setCoins] = useState<number[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [coinInput, setCoinInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [error, setError] = useState("");

  // example problems
  const exampleProblems = [
    { coins: [1, 3, 4], amount: 6, description: "Classic DP example" },
    {
      coins: [2, 5, 10],
      amount: 12,
      description: "Currency-like denominations",
    },
    { coins: [1, 4, 5], amount: 8, description: "Multiple optimal paths" },
    { coins: [3, 5], amount: 7, description: "Greedy fails here" },
    { coins: [1, 2, 5], amount: 11, description: "Standard coins" },
    { coins: [1, 7, 10], amount: 14, description: "Large coin gap" },
  ];

  // initialize when modal opens
  useEffect(() => {
    if (isOpen) {
      setCoins([...currentCoins]);
      setAmount(currentAmount);
      setAmountInput(currentAmount.toString());
      setCoinInput("");
      setError("");
    }
  }, [isOpen, currentCoins, currentAmount]);

  // handle esc key
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
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  const validateInputs = (newCoins: number[], newAmount: number): boolean => {
    if (newCoins.length === 0) {
      setError("At least one coin denomination is required");
      return false;
    }

    if (newCoins.length > 8) {
      setError("Maximum 8 coin denominations allowed");
      return false;
    }

    if (newCoins.some((coin) => coin <= 0 || coin > 100)) {
      setError("Coin values must be between 1 and 100");
      return false;
    }

    if (newAmount <= 0 || newAmount > 100) {
      setError("Amount must be between 1 and 100");
      return false;
    }

    // check for duplicates
    const uniqueCoins = new Set(newCoins);
    if (uniqueCoins.size !== newCoins.length) {
      setError("Duplicate coin denominations not allowed");
      return false;
    }

    setError("");
    return true;
  };

  const addCoin = () => {
    const coinValue = parseInt(coinInput.trim());
    if (isNaN(coinValue)) {
      setError("Please enter a valid coin value");
      return;
    }

    const newCoins = [...coins, coinValue].sort((a, b) => a - b);
    if (validateInputs(newCoins, amount)) {
      setCoins(newCoins);
      setCoinInput("");
    }
  };

  const removeCoin = (index: number) => {
    const newCoins = coins.filter((_, i) => i !== index);
    if (validateInputs(newCoins, amount)) {
      setCoins(newCoins);
    }
  };

  const updateCoin = (index: number, newValue: string) => {
    const coinValue = parseInt(newValue.trim());
    if (isNaN(coinValue)) return;

    const newCoins = [...coins];
    newCoins[index] = coinValue;
    newCoins.sort((a, b) => a - b);
    setCoins(newCoins);
    validateInputs(newCoins, amount);
  };

  const updateAmount = (newValue: string) => {
    setAmountInput(newValue);
    const amountValue = parseInt(newValue.trim());
    if (!isNaN(amountValue)) {
      setAmount(amountValue);
      validateInputs(coins, amountValue);
    }
  };

  const generateRandomProblem = () => {
    const randomExample =
      exampleProblems[Math.floor(Math.random() * exampleProblems.length)];
    setCoins([...randomExample.coins]);
    setAmount(randomExample.amount);
    setAmountInput(randomExample.amount.toString());
    setError("");
  };

  const resetToDefault = () => {
    setCoins([1, 3, 4]);
    setAmount(6);
    setAmountInput("6");
    setError("");
  };

  const selectExample = (example: (typeof exampleProblems)[0]) => {
    setCoins([...example.coins]);
    setAmount(example.amount);
    setAmountInput(example.amount.toString());
    setError("");
  };

  const handleApply = () => {
    if (validateInputs(coins, amount)) {
      onApplyValues(coins, amount);
      onClose();
    }
  };

  const handleCoinInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addCoin();
    }
  };

  const handleAmountInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApply();
    }
  };

  const hasError = error !== "";
  const isEmpty = coins.length === 0 || amount <= 0;

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
            className="relative w-full max-w-2xl bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Coins className="text-yellow-400" size={20} />
                {title}
              </h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 hover:border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* coin denominations */}
              <div>
                <label className="block text-white text-sm mb-3">
                  Coin Denominations ({coins.length}/8)
                </label>
                <div className="min-h-[100px] p-4 bg-white/5 border border-white/30 rounded-lg mb-4">
                  {coins.length === 0 ? (
                    <div className="text-gray-400 text-center italic">
                      No coin denominations
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {coins.map((coin, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-1 bg-yellow-500/20 border border-yellow-400/30 rounded-lg px-3 py-1"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <input
                            type="number"
                            value={coin}
                            onChange={(e) => updateCoin(index, e.target.value)}
                            className="w-12 bg-transparent text-yellow-200 text-center text-sm font-mono focus:outline-none"
                            min="1"
                            max="100"
                          />
                          <button
                            onClick={() => removeCoin(index)}
                            className="text-red-400 hover:text-red-300 transition-colors duration-150"
                          >
                            <Minus size={12} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* add coin */}
                <div className="flex gap-2 mb-4">
                  <input
                    type="number"
                    value={coinInput}
                    onChange={(e) => setCoinInput(e.target.value)}
                    onKeyPress={handleCoinInputKeyPress}
                    placeholder="Add coin value..."
                    min="1"
                    max="100"
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-400/20 transition-colors duration-150"
                  />
                  <button
                    onClick={addCoin}
                    disabled={!coinInput.trim() || coins.length >= 8}
                    className="flex items-center justify-center w-10 h-10 bg-yellow-600/30 border border-yellow-400/40 rounded-lg text-yellow-200 hover:bg-yellow-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <p className="text-gray-400 text-xs">
                  Values between 1 and 100 • Max 8 denominations
                </p>
              </div>

              {/* target amount */}
              <div>
                <label className="block text-white text-sm mb-3">
                  Target Amount
                </label>
                <div className="mb-4">
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => updateAmount(e.target.value)}
                    onKeyPress={handleAmountInputKeyPress}
                    placeholder="Enter target amount..."
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150 text-center font-mono text-lg"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Amount between 1 and 100
                  </p>
                </div>

                {/* preview */}
                <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg">
                  <h4 className="text-white text-sm mb-2">Problem Preview:</h4>
                  <div className="text-blue-200 text-sm font-mono">
                    Coins: [{coins.join(", ") || "none"}]
                  </div>
                  <div className="text-purple-200 text-sm font-mono">
                    Target: {amount || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* error display */}
            {hasError && (
              <motion.div
                className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-lg"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.15 }}
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {/* quick actions */}
            <div className="flex gap-2 mt-6 mb-6">
              <button
                onClick={generateRandomProblem}
                className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <Shuffle size={14} />
                Random Problem
              </button>
              <button
                onClick={resetToDefault}
                className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
              >
                <RotateCcw size={14} />
                Default
              </button>
            </div>

            {/* example problems */}
            <div className="mb-6">
              <h3 className="text-white text-sm mb-3">Example Problems:</h3>
              <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                {exampleProblems.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => selectExample(example)}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-xs"
                  >
                    <div className="flex flex-col items-start">
                      <div className="font-mono">
                        [{example.coins.join(",")}] → {example.amount}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {example.description}
                      </div>
                    </div>
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
                Apply Problem
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CoinChangeInputModal;
