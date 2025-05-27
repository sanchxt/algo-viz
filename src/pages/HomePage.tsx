import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
          Experience the beauty of algorithms through
          <span className="text-transparent bg-gradient-to-r from-[rgb(var(--color-primary-400))] to-[rgb(var(--color-primary-600))] bg-clip-text font-semibold">
            {" "}
            interactive visualizations
          </span>
          <br />
          Watch, learn, and understand step-by-step
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

      {/* algorithms showcase */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            Choose an Algorithm to Visualize
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* bubble Sort Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <Link to="/algorithms/bubble-sort">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Bubble Sort
                    </h3>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium border border-green-400/30">
                      Beginner
                    </span>
                  </div>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    A simple comparison-based sorting algorithm that repeatedly
                    steps through the list and swaps adjacent elements.
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-medium">
                      Sorting Algorithm
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
            </motion.div>

            {/* placeholder cards for future algorithms */}
            {[
              {
                name: "Selection Sort",
                category: "Sorting",
                difficulty: "Beginner",
              },
              {
                name: "Merge Sort",
                category: "Sorting",
                difficulty: "Intermediate",
              },
              {
                name: "Quick Sort",
                category: "Sorting",
                difficulty: "Advanced",
              },
              {
                name: "Linear Search",
                category: "Searching",
                difficulty: "Beginner",
              },
              {
                name: "Binary Search",
                category: "Searching",
                difficulty: "Intermediate",
              },
            ].map((algorithm, index) => (
              <motion.div
                key={algorithm.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (index + 1) * 0.1, duration: 0.6 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50 cursor-not-allowed"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-400">
                    {algorithm.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium border ${
                      algorithm.difficulty === "Beginner"
                        ? "bg-green-500/10 text-green-400 border-green-400/20"
                        : algorithm.difficulty === "Intermediate"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/20"
                        : "bg-red-500/10 text-red-400 border-red-400/20"
                    }`}
                  >
                    {algorithm.difficulty}
                  </span>
                </div>
                <p className="text-gray-500 mb-4 leading-relaxed">
                  Coming soon! This algorithm visualization is under
                  development.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-medium">
                    {algorithm.category} Algorithm
                  </span>
                  <span className="text-gray-500">⏳</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.main>

      {/* footer */}
      <motion.footer
        className="text-center mt-16 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.6 }}
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
