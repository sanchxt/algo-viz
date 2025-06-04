import { motion } from "framer-motion";

const BinarySearchLegend = () => {
  const legendItems = [
    {
      color: "from-blue-400 to-blue-600",
      label: "Left Boundary",
      icon: "◀",
    },
    {
      color: "from-purple-400 to-purple-600",
      label: "Right Boundary",
      icon: "▶",
    },
    {
      color:
        "from-[rgb(var(--color-warning-400))] to-[rgb(var(--color-warning-600))]",
      label: "Search Range",
      icon: "🔍",
    },
    {
      color:
        "from-[rgb(var(--color-danger-400))] to-[rgb(var(--color-danger-600))]",
      label: "Middle Element",
      icon: "🎯",
    },
    {
      color:
        "from-[rgb(var(--color-accent-400))] to-[rgb(var(--color-accent-600))]",
      label: "Target Found",
      icon: "⭐",
    },
    {
      color: "from-gray-400 to-gray-600",
      label: "Out of Range",
      icon: "⚫",
    },
  ];

  return (
    <motion.div
      className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {legendItems.map((item) => (
        <div
          key={item.label}
          className="flex items-center text-xs gap-2.5 px-3.5 py-1.5 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 hover:scale-105 transition-all duration-150"
        >
          <div
            className={`w-4 h-4 bg-gradient-to-br ${item.color} rounded-md shadow flex items-center justify-center text-white text-xs`}
          >
            {item.icon}
          </div>
          <span className="text-gray-200 font-medium">{item.label}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default BinarySearchLegend;
