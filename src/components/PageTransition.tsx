import { motion } from "framer-motion";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const barsCount = 8;
  const barStaggerDelay = 0.05;
  const barAnimationDuration = 0.6;

  const contentVariants = {
    initial: {
      // for new page content before it animates in
      opacity: 0,
    },
    animate: {
      // new page content becomes visible
      opacity: 1,
      transition: {
        delay: barsCount * barStaggerDelay * 0.5 + barAnimationDuration * 0.2,
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      // old page content fades out
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  return (
    <motion.div
      className="relative"
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div variants={contentVariants}>{children}</motion.div>

      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {Array.from({ length: barsCount }).map((_, index) => {
          const barWidthPercentage = 100 / barsCount;
          return (
            <motion.div
              key={`bar-${index}`}
              className="absolute top-0 h-full bg-gradient-to-b from-[rgb(var(--color-page-transition-top))] to-[rgb(var(--color-page-transition-bottom))]"
              style={{
                left: `${index * barWidthPercentage}%`,
                width: `calc(${barWidthPercentage}% + 1px)`,
              }}
              initial={{ y: "0%" }} // subsequent page entries: bars start covering
              animate={{
                // page entry: bars retract upwards
                y: "-100%",
                transition: {
                  duration: barAnimationDuration,
                  delay: index * barStaggerDelay,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              exit={{
                // page exits: bars slide down
                y: "0%",
                transition: {
                  duration: barAnimationDuration,
                  delay: index * barStaggerDelay,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PageTransition;
