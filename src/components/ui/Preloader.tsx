import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Increased duration for the filling effect

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    initial: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  if (!isLoading) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <svg width="200" height="100" viewBox="0 0 200 100">
        {/* Define the gradient for the water effect */}
        <defs>
          <linearGradient id="waterFill" x1="0" x2="0" y1="1" y2="0">
            <motion.stop
              initial={{ offset: "100%" }}
              animate={{ offset: "0%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              stopColor="white"
            />
            <motion.stop
              initial={{ offset: "100%" }}
              animate={{ offset: "0%" }}
              transition={{
                duration: 2,
                ease: "easeInOut",
              }}
              stopColor="transparent"
            />
          </linearGradient>
          {/* Mask for the text */}
          <mask id="textMask">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              className="text-7xl font-bold"
              fill="white"
            >
              PR
            </text>
          </mask>
        </defs>

        {/* Outline text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-7xl font-bold"
          fill="none"
          stroke="white"
          strokeWidth="2"
        >
          PR
        </text>

        {/* Filling rectangle with gradient */}
        <rect
          x="0"
          y="0"
          width="200"
          height="100"
          fill="url(#waterFill)"
          mask="url(#textMask)"
        />
      </svg>
    </motion.div>
  );
};

export default Preloader; 