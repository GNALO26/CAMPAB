"use client";
import { useEffect, useState } from "react";

interface Props {
  words: string[];
  className?: string;
  typingSpeed?: number;
  pause?: number;
}

export default function AnimatedText({
  words, className = "", typingSpeed = 80, pause = 1800,
}: Props) {
  const [index, setIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[index % words.length];
    let timeout: NodeJS.Timeout;

    if (!deleting && display === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && display === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setDisplay((prev) =>
            deleting ? current.substring(0, prev.length - 1) : current.substring(0, prev.length + 1)
          );
        },
        deleting ? typingSpeed / 2 : typingSpeed
      );
    }
    return () => clearTimeout(timeout);
  }, [display, deleting, index, words, typingSpeed, pause]);

  return (
    <span className={className}>
      {display}
      <span className="inline-block w-[2px] h-[1em] bg-olive align-middle ml-1 animate-blink" />
    </span>
  );
}
