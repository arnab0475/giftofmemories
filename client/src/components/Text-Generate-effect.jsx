"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "../lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  containerClassName,
  filter = true,
  duration = 0.5,
  appearingColor = "var(--color-slate-gray)",
  finalColor = "var(--color-charcoal-black)",
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  useEffect(() => {
    const enterAnimation = async () => {
      await animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
          color: appearingColor,
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.12),
        }
      );
      await animate(
        "span",
        {
          color: finalColor,
        },
        { duration: 1 }
      );
    };

    enterAnimation();
  }, [scope.current]);

  const renderWords = () => {
    const paragraphs = words.split(/\n{2,}/g);
    return (
      <motion.div ref={scope}>
        {paragraphs.map((para, pIdx) => (
          <div key={pIdx} className="mb-8 min-h-[2.5em]">
            {para.split(" ").map((word, idx) => (
              <motion.span
                key={word + idx + pIdx}
                className="opacity-0"
                style={{
                  filter: filter ? "blur(10px)" : "none",
                  color: appearingColor,
                }}
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
      <div className={cn("mt-6 mb-6", containerClassName)}>
        <div className="text-base md:text-lg leading-relaxed tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
