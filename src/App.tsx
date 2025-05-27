import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgb(var(--color-bg-primary))] via-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-primary))] relative overflow-hidden">
      {/* background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[rgb(var(--color-primary-400)/0.2)] to-[rgb(var(--color-primary-600)/0.2)] rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-[rgb(var(--color-secondary-400)/0.2)] to-[rgb(var(--color-secondary-600)/0.2)] rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
