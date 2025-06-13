import { motion } from "framer-motion";

const CycleDetectionLegend = () => {
  const nodeItems = [
    {
      color: "rgb(59 130 246)", // blue
      fill: "rgb(59 130 246 / 0.8)",
      label: "Current Node",
      description: "Node being processed in DFS",
    },
    {
      color: "rgb(245 158 11)", // amber
      fill: "rgb(245 158 11 / 0.8)",
      label: "Exploring Node",
      description: "Neighbor being explored",
    },
    {
      color: "rgb(34 197 94)", // green
      fill: "rgb(34 197 94 / 0.6)",
      label: "Visited Node",
      description: "Node already processed",
    },
    {
      color: "rgb(139 92 246)", // violet
      fill: "rgb(139 92 246 / 0.7)",
      label: "Path Node",
      description: "Node in current DFS path",
    },
    {
      color: "rgb(239 68 68)", // red
      fill: "rgb(239 68 68 / 0.8)",
      label: "Cycle Node",
      description: "Node part of detected cycle",
    },
    {
      color: "rgb(156 163 175)", // gray
      fill: "rgb(156 163 175 / 0.6)",
      label: "Backtrack Node",
      description: "Node during backtracking",
    },
    {
      color: "rgb(156 163 175)", // gray
      fill: "rgb(75 85 99 / 0.4)",
      label: "Unvisited Node",
      description: "Node not yet processed",
    },
  ];

  const edgeItems = [
    {
      color: "rgb(139 92 246)", // violet
      strokeWidth: "2",
      label: "Regular Edge",
      description: "Normal graph connection",
    },
    {
      color: "rgb(245 158 11)", // amber
      strokeWidth: "3",
      label: "Exploring Edge",
      description: "Edge being explored",
    },
    {
      color: "rgb(239 68 68)", // red
      strokeWidth: "4",
      label: "Cycle Edge",
      description: "Edge forming the cycle",
      animated: true,
    },
    {
      color: "rgb(168 85 247)", // purple
      strokeWidth: "6",
      strokeDasharray: "8 4",
      label: "DFS Path",
      description: "Current traversal path",
      opacity: "0.6",
    },
  ];

  const dataStructureItems = [
    {
      icon: "🔢",
      label: "Visited Set",
      description: "Set<string> tracking processed nodes",
      example: "visited.add(node)",
      color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    },
    {
      icon: "📚",
      label: "DFS Path",
      description: "Array tracking current traversal path",
      example: "path.push(node)",
      color: "bg-purple-500/20 border-purple-400/30 text-purple-200",
    },
    {
      icon: "🔗",
      label: "Parent Map",
      description: "Map<string, string> for parent tracking",
      example: "parent[node] = prev",
      color: "bg-blue-500/20 border-blue-400/30 text-blue-200",
    },
    {
      icon: "🎯",
      label: "Adjacency List",
      description: "Map<string, string[]> for graph structure",
      example: "adj[node].forEach(...)",
      color: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    },
  ];

  const algorithmSteps = [
    {
      step: "1",
      title: "Initialize",
      description: "Start DFS from unvisited nodes",
      color: "bg-blue-500/20 border-blue-400/30 text-blue-200",
    },
    {
      step: "2",
      title: "Visit Node",
      description: "Mark current node as visited",
      color: "bg-green-500/20 border-green-400/30 text-green-200",
    },
    {
      step: "3",
      title: "Explore Edges",
      description: "Check all neighboring nodes",
      color: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    },
    {
      step: "4",
      title: "Detect Cycle",
      description: "If neighbor is visited (not parent), cycle found!",
      color: "bg-red-500/20 border-red-400/30 text-red-200",
    },
    {
      step: "5",
      title: "Backtrack",
      description: "Return and continue with next node",
      color: "bg-purple-500/20 border-purple-400/30 text-purple-200",
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* node states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              Node States
            </h4>
            {nodeItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg width="20" height="20" className="flex-shrink-0">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={item.fill}
                    stroke={item.color}
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.label}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* edge types */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-1 bg-purple-400"></div>
              Edge Types
            </h4>
            {edgeItems.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg width="20" height="20" className="flex-shrink-0">
                  <line
                    x1="2"
                    y1="10"
                    x2="18"
                    y2="10"
                    stroke={item.color}
                    strokeWidth={item.strokeWidth}
                    strokeDasharray={item.strokeDasharray}
                    opacity={item.opacity || "1"}
                    className={item.animated ? "animate-pulse" : ""}
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.label}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* data structures */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded"></div>
              Data Structures
            </h4>
            {dataStructureItems.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.8rem] font-medium text-gray-200">
                      {item.label}
                    </div>
                    <div className="text-[0.7rem] text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div
                  className={`
                  px-2 py-1 rounded text-[0.65rem] font-mono border
                  ${item.color}
                `}
                >
                  {item.example}
                </div>
              </div>
            ))}
          </div>

          {/* algorithm steps */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded"></div>
              Algorithm Steps
            </h4>
            {algorithmSteps.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.title}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* visited set operations info */}
        <motion.div
          className="mt-6 pt-4 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="backdrop-blur-md bg-emerald-500/10 border border-emerald-400/30 rounded-xl p-3">
              <div className="text-emerald-200 text-sm font-medium mb-1">
                Set Operations
              </div>
              <div className="text-emerald-100 font-mono text-xs space-y-1">
                <div>visited.add(node)</div>
                <div>visited.has(node)</div>
              </div>
              <div className="text-emerald-300 text-xs mt-1">
                O(1) average time
              </div>
            </div>
            <div className="backdrop-blur-md bg-blue-500/10 border border-blue-400/30 rounded-xl p-3">
              <div className="text-blue-200 text-sm font-medium mb-1">
                Time Complexity
              </div>
              <div className="text-blue-100 font-mono text-lg font-bold">
                O(V + E)
              </div>
              <div className="text-blue-300 text-xs">
                Linear in vertices and edges
              </div>
            </div>
            <div className="backdrop-blur-md bg-purple-500/10 border border-purple-400/30 rounded-xl p-3">
              <div className="text-purple-200 text-sm font-medium mb-1">
                Space Complexity
              </div>
              <div className="text-purple-100 font-mono text-lg font-bold">
                O(V)
              </div>
              <div className="text-purple-300 text-xs">
                For visited set and recursion
              </div>
            </div>
            <div className="backdrop-blur-md bg-orange-500/10 border border-orange-400/30 rounded-xl p-3">
              <div className="text-orange-200 text-sm font-medium mb-1">
                Graph Type
              </div>
              <div className="text-orange-100 font-mono text-lg font-bold">
                Undirected
              </div>
              <div className="text-orange-300 text-xs">
                DFS with parent tracking
              </div>
            </div>
          </div>
        </motion.div>

        {/* key insight about visited set */}
        <motion.div
          className="mt-4 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <h5 className="text-cyan-200 font-semibold text-sm mb-1">
                Key Insight: Visited Set
              </h5>
              <p className="text-gray-300 text-xs leading-relaxed">
                The visited set is crucial for cycle detection. When we
                encounter a neighbor that's already visited (and it's not our
                parent), we've found a "back edge" that creates a cycle. The set
                gives us O(1) lookup time to check if a node was previously
                visited.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CycleDetectionLegend;
