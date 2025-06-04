import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { algorithmCategories } from "@/constants/algorithmCategories";

const HomePage = () => {
  return (
    <>
      {/* header */}
      <motion.header
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-7xl font-bold mb-6 bg-gradient-to-r from-[rgb(var(--color-text-white))] via-blue-100 to-purple-100 bg-clip-text text-transparent"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            backgroundSize: "400% 400%",
          }}
        >
          AlgoViz
        </motion.h1>
        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Master algorithms through
          <span className="text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))] bg-clip-text font-semibold">
            {" "}
            interactive visualizations
          </span>
          <br />
          Explore algorithm categories and watch them come to life
        </motion.p>

        {/* floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-500))] rounded-full opacity-60"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </motion.header>

      {/* algorithm categories showcase */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Choose an Algorithm Category
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {algorithmCategories.map((category, index) => {
              const hasAlgorithms = category.algorithms.length > 0;
              const isClickable = hasAlgorithms;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                  whileHover={isClickable ? { scale: 1.02, y: -5 } : {}}
                  className="group"
                >
                  {isClickable ? (
                    <Link to={`/categories/${category.id}`}>
                      <div
                        className={`backdrop-blur-xl bg-gradient-to-br ${category.color.gradient} border ${category.color.border} rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl h-full`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-3xl">{category.icon}</div>
                          <div
                            className={`px-2 py-1 bg-white/10 ${category.color.text} rounded-full text-xs font-medium border border-white/20`}
                          >
                            {category.algorithms.length} algorithm
                            {category.algorithms.length !== 1 ? "s" : ""}
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-3">
                          {category.name}
                        </h3>

                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                          {category.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-medium">
                            Ready to explore
                          </span>
                          <motion.div
                            className="text-white group-hover:translate-x-1 transition-transform"
                            whileHover={{ x: 4 }}
                          >
                            →
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 cursor-not-allowed h-full">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl grayscale">
                          {category.icon}
                        </div>
                        <div className="px-2 py-1 bg-white/5 text-gray-500 rounded-full text-xs font-medium border border-white/10">
                          Coming Soon
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-400 mb-3">
                        {category.name}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 font-medium">
                          Under development
                        </span>
                        <span className="text-gray-500">⏳</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* additional info section */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">
                Interactive Algorithm Learning
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Each category contains carefully curated algorithms with
                step-by-step visualizations, multi-language code examples, and
                detailed explanations. Click on available categories to explore
                the algorithms and watch them come to life through interactive
                animations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-2xl mb-2">🎯</div>
                  <h4 className="font-semibold text-white mb-1">
                    Step-by-Step
                  </h4>
                  <p className="text-sm text-gray-400">
                    Watch algorithms execute one step at a time
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💻</div>
                  <h4 className="font-semibold text-white mb-1">
                    Multi-Language
                  </h4>
                  <p className="text-sm text-gray-400">
                    Code examples in 7+ programming languages
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-semibold text-white mb-1">Interactive</h4>
                  <p className="text-sm text-gray-400">
                    Customize inputs and control playback speed
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* footer */}
      <motion.footer
        className="text-center mt-16 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
          <p className="text-sm font-medium">
            Built with React, TypeScript, and Framer Motion
          </p>
          <div className="w-1 h-1 bg-gray-400 rounded-full" />
        </div>
        <p className="text-xs text-gray-500">
          Making algorithms beautiful, one visualization at a time
        </p>
      </motion.footer>
    </>
  );
};

export default HomePage;
