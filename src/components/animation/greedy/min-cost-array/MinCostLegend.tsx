import { motion } from "framer-motion";
import {
  Target,
  Calculator,
  TreePine,
  Crown,
  Zap,
  Lightbulb,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";

const MinCostLegend = () => {
  const elementStates = [
    {
      color: "from-green-400 via-green-500 to-green-600 border-green-300/60",
      label: "Greedy Anchor (Minimum)",
      description:
        "The smallest element - our strategic choice for optimal cost",
      icon: <Target size={14} />,
    },
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Pairing Candidate",
      description: "Element being considered for pairing with anchor",
      icon: <TreePine size={14} />,
    },
    {
      color: "from-red-400 via-red-500 to-red-600 border-red-300/60",
      label: "Being Removed",
      description: "Larger element being eliminated (optimal choice)",
      icon: <TrendingDown size={14} />,
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Final Result",
      description: "Last remaining element (algorithm complete)",
      icon: <Crown size={14} />,
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Awaiting Processing",
      description: "Element not currently involved in operation",
      icon: <div className="w-3 h-3 bg-gray-400 rounded-full" />,
    },
  ];

  const greedyPrinciples = [
    {
      color: "bg-green-500/20 border-green-400/30 text-green-200",
      label: "🎯 Greedy Choice",
      description: "Always use minimum element as cost anchor",
      detail: "Locally optimal decision that leads to global optimum",
    },
    {
      color: "bg-blue-500/20 border-blue-400/30 text-blue-200",
      label: "🌳 Decision Tree",
      description: "Visualize all possible pairings and their costs",
      detail: "Shows why greedy choice is superior to alternatives",
    },
    {
      color: "bg-purple-500/20 border-purple-400/30 text-purple-200",
      label: "📐 Formula Insight",
      description: "Total Cost = (n-1) × minimum_element",
      detail: "Mathematical proof of greedy optimality",
    },
    {
      color: "bg-amber-500/20 border-amber-400/30 text-amber-200",
      label: "⚡ Optimality Proof",
      description: "Why greedy strategy guarantees minimum cost",
      detail: "Any other approach would use larger elements as costs",
    },
  ];

  const visualizationSteps = [
    {
      icon: <Lightbulb size={14} />,
      label: "Problem Setup",
      color: "text-blue-400",
      description: "Understand the rules and objective",
    },
    {
      icon: <Zap size={14} />,
      label: "Greedy Insight",
      color: "text-emerald-400",
      description: "Discover the key strategic insight",
    },
    {
      icon: <Calculator size={14} />,
      label: "Formula Derivation",
      color: "text-purple-400",
      description: "Build the mathematical formula step by step",
    },
    {
      icon: <TreePine size={14} />,
      label: "Decision Analysis",
      color: "text-cyan-400",
      description: "Compare greedy choice with alternatives",
    },
    {
      icon: <Target size={14} />,
      label: "Strategy Application",
      color: "text-amber-400",
      description: "Apply greedy principle to each operation",
    },
    {
      icon: <CheckCircle2 size={14} />,
      label: "Optimality Proof",
      color: "text-green-400",
      description: "Verify that greedy choice was optimal",
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
          {/* element states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              Element States
            </h4>
            {elementStates.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-5 h-5 rounded bg-gradient-to-br border flex-shrink-0 flex items-center justify-center ${item.color}`}
                >
                  <div className="text-white text-xs">{item.icon}</div>
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

          {/* greedy principles */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded"></div>
              Greedy Principles
            </h4>
            {greedyPrinciples.map((item, index) => (
              <motion.div
                key={index}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`p-3 rounded-lg border flex-shrink-0 ${item.color}`}
                >
                  <div className="font-semibold text-sm mb-1">{item.label}</div>
                  <div className="text-sm mb-2">{item.description}</div>
                  <div className="text-xs opacity-80">{item.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* visualization flow */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
              Visualization Flow
            </h4>
            {visualizationSteps.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <div className={`flex-shrink-0 ${item.color}`}>
                    {item.icon}
                  </div>
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
        </div>
      </div>
    </motion.div>
  );
};

export default MinCostLegend;
