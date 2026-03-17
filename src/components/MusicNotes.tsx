
import { useEffect, useState } from "react";

const MusicNotes = () => {
  const [notes, setNotes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const createRandomNote = () => {
      const id = Math.random().toString(36).substring(7);
      const size = Math.floor(Math.random() * 30) + 20;
      const left = Math.floor(Math.random() * 100);
      const animationDuration = Math.floor(Math.random() * 10) + 10;
      const delay = Math.floor(Math.random() * 5);
      
      const notesSymbols = ['♪', '♫', '♬', '♩', '♭', '♮', '♯'];
      const symbol = notesSymbols[Math.floor(Math.random() * notesSymbols.length)];
      
      return (
        <div 
          key={id}
          className="music-note"
          style={{
            fontSize: `${size}px`,
            left: `${left}%`,
            animationDuration: `${animationDuration}s`,
            animationDelay: `${delay}s`,
            opacity: 0.08
          }}
        >
          {symbol}
        </div>
      );
    };

    // Create initial notes
    const initialNotes = Array(10).fill(0).map(() => createRandomNote());
    setNotes(initialNotes);

    // Add a new note every 2 seconds
    const interval = setInterval(() => {
      setNotes(prev => [...prev.slice(-15), createRandomNote()]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {notes}
    </div>
  );
};

export default MusicNotes;
