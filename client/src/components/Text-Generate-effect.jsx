"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration ? duration : 1,
        delay: stagger(0.12),
      }
    );
  }, [scope.current]);

  const renderWords = () => {
    // Split by double newlines for paragraphs
    const paragraphs = words.split(/\n{2,}/g);
    return (
      <motion.div ref={scope}>
        {paragraphs.map((para, pIdx) => (
          <div key={pIdx} className="mb-8 min-h-[2.5em]">
            {para.split(" ").map((word, idx) => (
              <motion.span
                key={word + idx + pIdx}
                className="text-black opacity-0"
                style={{ filter: filter ? "blur(10px)" : "none" }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-normal", className)}>
      <div className="mt-6 mb-6">
        <div className="text-black text-base md:text-lg leading-relaxed tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
