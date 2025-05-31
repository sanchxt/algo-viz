import { Lightbulb, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AlgorithmIntuition as AlgorithmIntuitionType } from "../types/algorithm";

interface IntuitionProps {
  isOpen: boolean;
  onClose: () => void;
  intuitionData: AlgorithmIntuitionType;
}

const Intuition = ({ isOpen, onClose, intuitionData }: IntuitionProps) => {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUpStagger {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .intuition-overlay {
          animation: fadeInScale 0.25s ease-out;
        }

        .intuition-content {
          animation: fadeInUp 0.3s ease-out 0.1s both;
        }

        .intuition-item {
          animation: fadeInUpStagger 0.2s ease-out both;
        }

        .intuition-item:nth-child(1) { animation-delay: 0.15s; }
        .intuition-item:nth-child(2) { animation-delay: 0.2s; }
        .intuition-item:nth-child(3) { animation-delay: 0.25s; }
        .intuition-item:nth-child(4) { animation-delay: 0.3s; }
      `}</style>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* background overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="lg:hidden absolute inset-0 bg-black/30 z-40"
              onClick={onClose}
            />

            {/* intuition card */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 lg:inset-4 z-50"
            >
              <div className="intuition-overlay h-full bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-400/30">
                      <Lightbulb size={20} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Algorithm Intuition
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {intuitionData.title}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-10 h-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* content */}
                <div
                  className="overflow-y-auto"
                  style={{ height: "calc(100% - 80px)" }}
                >
                  <div className="intuition-content p-6 space-y-8">
                    {/* description */}
                    <div className="intuition-item backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5">
                      <p className="text-gray-300 leading-relaxed">
                        {intuitionData.description}
                      </p>
                    </div>

                    {/* core intuition */}
                    <div className="intuition-item space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-white">
                          {intuitionData.intuition.title}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {intuitionData.intuition.content.map(
                          (paragraph, index) => (
                            <p
                              key={index}
                              className="text-gray-300 leading-relaxed pl-4 border-l-2 border-blue-400/30"
                            >
                              {paragraph}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* real world analogy */}
                    <div className="intuition-item backdrop-blur-md bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-white">
                          {intuitionData.realWorldAnalogy.title}
                        </h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {intuitionData.realWorldAnalogy.content}
                      </p>
                    </div>

                    {/* when to use */}
                    <div className="intuition-item space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <h4 className="text-lg font-semibold text-white">
                          {intuitionData.whenToUse.title}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* use cases */}
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-emerald-400 uppercase tracking-wide">
                            Best Use Cases
                          </h5>
                          <div className="space-y-2">
                            {intuitionData.whenToUse.content.map(
                              (useCase, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-lg"
                                >
                                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-300 text-sm leading-relaxed">
                                    {useCase}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>

                        {/* examples */}
                        <div className="space-y-3">
                          <h5 className="text-sm font-medium text-amber-400 uppercase tracking-wide">
                            Practical Examples
                          </h5>
                          <div className="space-y-2">
                            {intuitionData.whenToUse.examples.map(
                              (example, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 backdrop-blur-md bg-amber-500/10 border border-amber-400/20 rounded-lg"
                                >
                                  <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <p className="text-gray-300 text-sm leading-relaxed">
                                    {example}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Intuition;
