import { useState, useRef, useCallback, useEffect } from "react";

export function useNarration() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPage, setCurrentPage] = useState(-1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentPage(-1);
    utteranceRef.current = null;
  }, []);

  const speak = useCallback((text: string, pageIndex: number) => {
    stop();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    // Pick a good voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && v.name.includes("Google")
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      setIsPlaying(true);
      setCurrentPage(pageIndex);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentPage(-1);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setCurrentPage(-1);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [stop]);

  const toggleNarration = useCallback(
    (text: string, pageIndex: number) => {
      if (isPlaying && currentPage === pageIndex) {
        stop();
      } else {
        speak(text, pageIndex);
      }
    },
    [isPlaying, currentPage, stop, speak]
  );

  // Clean up on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { isPlaying, currentPage, toggleNarration, stop };
}
