import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface TargetCustomizerProps {
  currentTarget: number;
  onOpenModal: () => void;
}

const TargetCustomizer = ({
  currentTarget,
  onOpenModal,
}: TargetCustomizerProps) => {
  return (
    <motion.section
      className="max-w-6xl mx-auto mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Search Target
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-gray-300 text-[0.9rem]">Looking for:</span>
            <motion.span
              className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-lg text-red-100 font-mono font-bold text-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentTarget}
            </motion.span>
          </div>
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-3 py-2 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-red-500/15 to-pink-500/15 border border-red-400/30 rounded-lg text-red-100 font-semibold hover:from-red-500/25 hover:to-pink-500/25 hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Target size={16} />
          Customize Search
        </button>
      </div>
    </motion.section>
  );
};

export default TargetCustomizer;
