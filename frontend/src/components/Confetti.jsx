import { useEffect, useState } from "react";
import "./Confetti.css";

function Confetti({ active, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (active) {
      // Create 50 confetti pieces
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        animationDelay: Math.random() * 0.3,
        backgroundColor: getRandomColor(),
      }));
      setPieces(newPieces);

      // Clear confetti after animation
      const timer = setTimeout(() => {
        setPieces([]);
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  function getRandomColor() {
    const colors = [
      "#C85C4C", // terracotta
      "#8BA888", // sage
      "#E8DCC4", // beige
      "#d4a88a", // peach
      "#e8d4a0", // yellow
      "#a8bcc4", // blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.animationDelay}s`,
            backgroundColor: piece.backgroundColor,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
