"use client";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export function GoogleGeminiEffectDemo({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.8, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.75, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.7, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.65, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0.6, 1.2]);

  return (
    <div
      className="h-[350vh] bg-black w-full dark:border dark:border-white/[0.1] rounded-md relative overflow-clip"
      ref={ref}
      style={{
        height: "300vh",
        backgroundColor: "#000000",
        width: "100%",
        borderRadius: "0.375rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <GoogleGeminiEffect
        title={title}
        description={description}
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}
