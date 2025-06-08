import { motion } from "framer-motion";

const ReverseLinkedListLegend = () => {
  const legendItems = [
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Head Node",
    },
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Current Node",
    },
    {
      color: "from-amber-400 via-amber-500 to-amber-600 border-amber-300/60",
      label: "Active Node",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Processed Node",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Unprocessed Node",
    },
  ];

  const arrowItems = [
    {
      color: "bg-gray-400",
      label: "Forward Link",
    },
    {
      color: "bg-emerald-500",
      label: "Reversed Link",
    },
  ];

  const pointerItems = [
    {
      color: "bg-purple-500",
      label: "prev",
      description: "Points to previous node",
    },
    {
      color: "bg-blue-500",
      label: "current",
      description: "Points to current node",
    },
    {
      color: "bg-amber-500",
      label: "next",
      description: "Stores next node",
    },
  ];

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {/* node states */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white mb-2">
              Node States
            </h4>
            {legendItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full bg-gradient-to-br border flex-shrink-0 ${item.color}`}
                />
                <span className="text-[0.8rem] text-gray-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* link & pointer types */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white mb-2">
              Link Types
            </h4>
            {arrowItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-3">
                  <div className={`w-2 h-0.5 ${item.color}`} />
                  <div
                    className={`w-0 h-0 border-l-2 ${
                      item.color === "bg-gray-400"
                        ? "border-l-gray-400"
                        : "border-l-emerald-500"
                    } border-t-2 border-t-transparent border-b-2 border-b-transparent`}
                  />
                </div>
                <span className="text-[0.8rem] text-gray-300">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-base font-semibold text-white mb-2">
              Pointers
            </h4>
            {pointerItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className={`px-1.5 py-0.5 rounded text-white text-[10px] font-bold ${item.color}`}
                >
                  {item.label}
                </div>
                <span className="text-[0.8rem] text-gray-300">
                  {item.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReverseLinkedListLegend;
