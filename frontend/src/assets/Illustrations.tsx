import { motion, type Variants } from "framer-motion";

export const SquigglyWave = () => {
  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 0.8,
      transition: {
        pathLength: {
          delay: i * 0.3,
          type: "spring",
          duration: 3,
          bounce: 0,
        },
        opacity: { delay: i * 0.3, duration: 0.8 },
      },
    }),
  };

  return (
    <svg
      viewBox="0 0 1200 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{
        pointerEvents: "none",
        width: "100%",
        height: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <motion.path
        d="M-100,200 
           C 100,200 200,50 350,300 
           C 550,650 50,700 200,400 
           C 350,150 650,150 850,300 
           C 1050,650 550,700 750,400 
           C 850,200 1100,200 1350,150"
        stroke="#e8e5df"
        strokeWidth="30"
        strokeLinecap="round"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        opacity={0.125}
      />
    </svg>
  );
};
