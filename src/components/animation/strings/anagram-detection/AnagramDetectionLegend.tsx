import { motion } from "framer-motion";

const AnagramDetectionLegend = () => {
  const legendItems = [
    {
      color: "from-blue-400 to-blue-600",
      label: "String 1",
      icon: "📝",
      description: "First input string",
    },
    {
      color: "from-purple-400 to-purple-600",
      label: "String 2",
      icon: "📄",
      description: "Second input string",
    },
    {
      color: "from-yellow-400 to-yellow-600",
      label: "Current Character",
      icon: "👆",
      description: "Character being processed",
    },
    {
      color: "from-blue-400 to-blue-600",
      label: "Frequency Update",
      icon: "📊",
      description: "Character count updated",
    },
    {
      color: "from-emerald-400 to-emerald-600",
      label: "Match",
      icon: "✅",
      description: "Frequencies match",
    },
    {
      color: "from-red-400 to-red-600",
      label: "Mismatch",
      icon: "❌",
      description: "Frequencies differ",
    },
    {
      color: "from-gray-400 to-gray-600",
      label: "Processed",
      icon: "⚪",
      description: "Already processed",
    },
    {
      color: "from-amber-400 to-amber-600",
      label: "Frequency Maps",
      icon: "🗂️",
      description: "Character counts",
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
        <motion.div
          key={item.label}
          className="flex items-center text-xs gap-2.5 px-3.5 py-1.5 backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 hover:scale-105 transition-all duration-150 group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div
            className={`w-4 h-4 bg-gradient-to-br ${item.color} rounded-md shadow flex items-center justify-center text-white text-xs`}
          >
            {item.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-gray-200 font-medium">{item.label}</span>
            <span className="text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute mt-6 bg-gray-900 px-2 py-1 rounded border border-gray-700 whitespace-nowrap z-20">
              {item.description}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnagramDetectionLegend;
