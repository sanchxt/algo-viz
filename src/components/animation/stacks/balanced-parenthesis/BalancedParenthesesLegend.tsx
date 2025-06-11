import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Eye, Check, X, Layers } from "lucide-react";

const BalancedParenthesesLegend = () => {
  const characterStates = [
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Current Character",
      description: "Character being processed right now",
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Valid Match",
      description: "Character matched successfully with stack top",
    },
    {
      color: "from-red-400 via-red-500 to-red-600 border-red-300/60",
      label: "Invalid/Error",
      description: "Character caused a mismatch or validation error",
    },
    {
      color: "from-gray-500 via-gray-600 to-gray-700 border-gray-400/50",
      label: "Processed",
      description: "Character already processed successfully",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/30",
      label: "Unprocessed",
      description: "Character not yet reached",
    },
  ];

  const stackStates = [
    {
      color: "from-amber-400 via-amber-500 to-amber-600 border-amber-300/60",
      label: "Stack Top",
      description: "Top element being peeked or compared",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Pushed Element",
      description: "Opening bracket pushed onto stack",
    },
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Processing",
      description: "Element being actively processed",
    },
    {
      color: "from-red-400 via-red-500 to-red-600 border-red-300/60",
      label: "Invalid Element",
      description: "Element involved in mismatch error",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Waiting",
      description: "Element waiting in stack",
    },
  ];

  const bracketTypes = [
    {
      symbols: ["(", ")"],
      color: "text-blue-200",
      label: "Parentheses",
      description: "Round brackets for grouping",
    },
    {
      symbols: ["[", "]"],
      color: "text-emerald-200",
      label: "Square Brackets",
      description: "Square brackets for arrays/indexing",
    },
    {
      symbols: ["{", "}"],
      color: "text-purple-200",
      label: "Curly Braces",
      description: "Curly braces for objects/blocks",
    },
  ];

  const operationStates = [
    {
      icon: <ArrowDown size={14} />,
      label: "Push Operation",
      color: "text-purple-400",
      description: "Opening bracket pushed to stack",
    },
    {
      icon: <ArrowUp size={14} />,
      label: "Pop Operation",
      color: "text-emerald-400",
      description: "Matching bracket popped from stack",
    },
    {
      icon: <Eye size={14} />,
      label: "Peek Operation",
      color: "text-amber-400",
      description: "Check top of stack without removing",
    },
    {
      icon: <Check size={14} />,
      label: "Valid Match",
      color: "text-emerald-400",
      description: "Opening and closing brackets match",
    },
    {
      icon: <X size={14} />,
      label: "Mismatch Error",
      color: "text-red-400",
      description: "Brackets don't match or stack is empty",
    },
    {
      icon: <Layers size={14} />,
      label: "Stack Depth",
      color: "text-cyan-400",
      description: "Number shows position in stack",
    },
  ];

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* character states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              Character States
            </h4>
            {characterStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-4 h-4 rounded bg-gradient-to-br border flex-shrink-0 ${item.color}`}
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* stack states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
              Stack States
            </h4>
            {stackStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-4 h-4 rounded bg-gradient-to-br border flex-shrink-0 ${item.color}`}
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* bracket types */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded"></div>
              Bracket Types
            </h4>
            {bracketTypes.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center gap-1 flex-shrink-0">
                  {item.symbols.map((symbol, symbolIndex) => (
                    <div
                      key={symbolIndex}
                      className={`w-4 h-4 rounded border border-white/20 bg-gray-700 flex items-center justify-center text-xs font-mono ${item.color}`}
                    >
                      {symbol}
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* operation indicators */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded"></div>
              Operations
            </h4>
            {operationStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`flex-shrink-0 ${item.color}`}>{item.icon}</div>
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* algorithm overview */}
        <motion.div
          className="mt-8 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4">
              <h5 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
                📚 Stack (LIFO)
              </h5>
              <p className="text-gray-300 text-sm">
                Last In, First Out data structure. Push opening brackets, pop
                when finding matching closing brackets. Empty stack at end =
                balanced.
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-4">
              <h5 className="text-emerald-200 font-semibold mb-2 flex items-center gap-2">
                🔍 Matching Logic
              </h5>
              <p className="text-gray-300 text-sm">
                Each opening bracket type must match its corresponding closing
                bracket. Proper nesting means last opened is first closed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* validation flow */}
        <motion.div
          className="mt-6 bg-purple-500/10 border border-purple-400/30 rounded-lg p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h5 className="text-purple-200 font-semibold mb-3 text-center">
            🔄 Validation Process
          </h5>
          <div className="flex items-center justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300">Read Character</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300">Push/Pop Stack</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-gray-300">Check Match</span>
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300">Final Validation</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BalancedParenthesesLegend;
