import { motion } from "framer-motion";
import { Coins, ArrowRight, Calculator, Target, Lightbulb } from "lucide-react";
import { memo } from "react";

const CoinChangeLegend = memo(() => {
  const dpTableStates = [
    {
      color: "bg-blue-500/30 border-blue-400/40 ring-2 ring-blue-400/50",
      label: "Current Amount",
      description: "Amount currently being processed",
    },
    {
      color: "bg-cyan-500/20 border-cyan-400/30",
      label: "Subproblem Lookup",
      description: "Checking previously computed value",
    },
    {
      color: "bg-yellow-500/30 border-yellow-400/40 ring-2 ring-yellow-400/50",
      label: "Comparison",
      description: "Comparing current vs new solution",
    },
    {
      color: "bg-purple-500/30 border-purple-400/40 ring-2 ring-purple-400/50",
      label: "Table Update",
      description: "Better solution found, updating cell",
    },
    {
      color: "bg-green-500/30 border-green-400/40 ring-2 ring-green-400/50",
      label: "Optimal Solution",
      description: "Final minimum coins found",
    },
    {
      color: "bg-red-500/30 border-red-400/40 ring-2 ring-red-400/50",
      label: "No Solution",
      description: "Cannot make this amount",
    },
    {
      color: "bg-white/10 border-white/20",
      label: "Unprocessed",
      description: "Not yet computed (∞)",
    },
  ];

  const coinStates = [
    {
      color:
        "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-400/30",
      label: "Available Coin",
      description: "Coin denomination available for use",
    },
    {
      color:
        "bg-gradient-to-r from-blue-500/30 to-blue-600/30 border-blue-400/40 ring-2 ring-blue-400/50",
      label: "Considering Coin",
      description: "Currently checking this coin",
    },
    {
      color:
        "bg-gradient-to-r from-green-500/30 to-green-600/30 border-green-400/40 ring-2 ring-green-400/50",
      label: "Optimal Coin",
      description: "Part of the optimal solution",
    },
  ];

  const processSteps = [
    {
      icon: <Target size={14} />,
      label: "Initialize",
      color: "text-blue-400",
      description: "Set dp[0] = 0, all others = ∞",
    },
    {
      icon: <ArrowRight size={14} />,
      label: "Process Amount",
      color: "text-cyan-400",
      description: "For each amount from 1 to target",
    },
    {
      icon: <Coins size={14} />,
      label: "Try Each Coin",
      color: "text-yellow-400",
      description: "Consider all available coin denominations",
    },
    {
      icon: <Calculator size={14} />,
      label: "Calculate & Compare",
      color: "text-purple-400",
      description: "dp[amount] = min(dp[amount], dp[amount-coin] + 1)",
    },
    {
      icon: <Lightbulb size={14} />,
      label: "Reconstruct Path",
      color: "text-green-400",
      description: "Trace back to find which coins to use",
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* DP table states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              DP Table States
            </h4>
            {dpTableStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-8 h-8 rounded border-2 flex-shrink-0 ${item.color}`}
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

          {/* coin states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
              Coin States
            </h4>
            {coinStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 flex-shrink-0 ${item.color}`}
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

          {/* algorithm steps */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-teal-500 rounded"></div>
              Algorithm Steps
            </h4>
            {processSteps.map((item, index) => (
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

        {/* notes */}
        <motion.div
          className="mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
              <h5 className="text-blue-200 font-semibold mb-1">
                💡 Key Insight
              </h5>
              <p className="text-gray-300 text-xs">
                Each cell dp[i] stores the minimum coins needed for amount i. We
                build solutions bottom-up using previously computed values.
              </p>
            </div>
            <div className="bg-purple-500/10 border border-purple-400/30 rounded-lg p-3">
              <h5 className="text-purple-200 font-semibold mb-1">
                ⚡ Recurrence
              </h5>
              <p className="text-gray-300 text-xs font-mono">
                dp[amount] = min(dp[amount], dp[amount-coin] + 1)
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
              <h5 className="text-green-200 font-semibold mb-1">
                🎯 Complexity
              </h5>
              <p className="text-gray-300 text-xs">
                Time: O(amount × coins)
                <br />
                Space: O(amount)
              </p>
            </div>
          </div>
        </motion.div>

        {/* DP vs Greedy comparison */}
        <motion.div
          className="mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h5 className="text-white font-semibold mb-3 text-center">
            🤔 Why Not Greedy?
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-red-500/10 border border-red-400/30 rounded-lg p-3">
              <h6 className="text-red-200 font-semibold mb-1">
                ❌ Greedy Fails
              </h6>
              <p className="text-gray-300 text-xs">
                Coins [1,3,4], Amount 6:
                <br />
                Greedy: 4+1+1 = 3 coins
                <br />
                Optimal: 3+3 = 2 coins
              </p>
            </div>
            <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-3">
              <h6 className="text-green-200 font-semibold mb-1">
                ✅ DP Succeeds
              </h6>
              <p className="text-gray-300 text-xs">
                DP considers all possibilities and finds the globally optimal
                solution by combining optimal subproblems.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

CoinChangeLegend.displayName = "CoinChangeLegend";

export default CoinChangeLegend;
