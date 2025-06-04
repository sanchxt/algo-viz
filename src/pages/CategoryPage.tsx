import { motion } from "framer-motion";
import { Link, useParams, Navigate } from "react-router-dom";

import type { Algorithm } from "@/types/algorithm";
import { getCategoryById } from "@constants/algorithmCategories";

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();

  if (!categoryId) {
    return <Navigate to="/" replace />;
  }

  const category = getCategoryById(categoryId);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  const getDifficultyColor = (difficulty: Algorithm["difficulty"]) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  return (
    <>
      {/* navigation */}
      <motion.nav
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300 font-medium text-sm"
        >
          <motion.span
            whileHover={{ x: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            ←
          </motion.span>
          Back to Categories
        </Link>
      </motion.nav>

      {/* header */}
      <motion.header
        className="text-center mb-16"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center justify-center gap-4 mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="text-6xl">{category.icon}</div>
          <motion.h1
            className="text-6xl font-bold bg-gradient-to-r from-[rgb(var(--color-text-white))] via-blue-100 to-purple-100 bg-clip-text text-transparent"
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
            {category.name}
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {category.description}
        </motion.p>

        <motion.div
          className={`inline-flex items-center gap-2 mt-6 px-4 py-2 bg-gradient-to-r ${category.color.gradient} border ${category.color.border} rounded-full`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <span className={`text-sm font-medium ${category.color.text}`}>
            {category.algorithms.length} Algorithm
            {category.algorithms.length !== 1 ? "s" : ""} Available
          </span>
        </motion.div>
      </motion.header>

      {/* algorithms showcase */}
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="max-w-5xl mx-auto">
          {category.algorithms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.algorithms.map((algorithm, index) => (
                <motion.div
                  key={algorithm.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Link to={`/categories/${categoryId}/${algorithm.id}`}>
                    <div
                      className={`backdrop-blur-xl bg-gradient-to-br ${category.color.gradient} border ${category.color.border} rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 shadow-xl h-full`}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-white">
                          {algorithm.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                            algorithm.difficulty
                          )}`}
                        >
                          {algorithm.difficulty}
                        </span>
                      </div>

                      <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                        {algorithm.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 font-medium">
                          {category.name} Algorithm
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
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="text-6xl mb-6 grayscale opacity-50">⏳</div>
              <h3 className="text-2xl font-semibold text-gray-400 mb-4">
                Algorithms Coming Soon
              </h3>
              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
                We're working hard to bring you interactive visualizations for{" "}
                {category.name.toLowerCase()} algorithms. Check back soon to
                explore this exciting category!
              </p>
            </motion.div>
          )}
        </div>
      </motion.main>

      {/* category info */}
      {category.algorithms.length > 0 && (
        <motion.section
          className="mt-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div
            className={`backdrop-blur-xl bg-gradient-to-r ${category.color.gradient} border ${category.color.border} rounded-2xl p-8`}
          >
            <h3 className="text-2xl font-semibold text-white mb-4 text-center">
              What You'll Learn
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold text-white mb-2">Core Concepts</h4>
                <p className="text-sm text-gray-300">
                  Understand the fundamental principles behind{" "}
                  {category.name.toLowerCase()} algorithms
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">⚡</div>
                <h4 className="font-semibold text-white mb-2">Performance</h4>
                <p className="text-sm text-gray-300">
                  Learn about time and space complexity through visual analysis
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-3">🔧</div>
                <h4 className="font-semibold text-white mb-2">
                  Implementation
                </h4>
                <p className="text-sm text-gray-300">
                  See step-by-step code execution in multiple programming
                  languages
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      )}
    </>
  );
};

export default CategoryPage;
