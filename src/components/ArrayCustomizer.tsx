import { motion } from "framer-motion";
import { Settings } from "lucide-react";

interface ArrayCustomizerProps {
  currentArray: number[];
  onOpenModal: () => void;
}

const ArrayCustomizer = ({
  currentArray,
  onOpenModal,
}: ArrayCustomizerProps) => {
  return (
    <motion.section
      className="max-w-6xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Current Array
          </h3>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-300 text-[0.9rem]">Elements:</span>
            <div className="flex gap-2 flex-wrap">
              {currentArray.map((value, index) => (
                <motion.span
                  key={`${value}-${index}`}
                  className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded text-blue-200 font-mono font-semibold text-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {value}
                </motion.span>
              ))}
            </div>
            <span className="text-gray-400 text-xs">
              ({currentArray.length} element
              {currentArray.length !== 1 ? "s" : ""})
            </span>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-400/30 rounded-lg text-emerald-200 hover:from-emerald-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
        >
          <Settings size={16} />
          Customize Array
        </button>
      </div>
    </motion.section>
  );
};

export default ArrayCustomizer;
