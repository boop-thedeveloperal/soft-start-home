import { useEffect, useState } from "react";
import { NurturingButton } from "../ui/button-variants";

interface AffirmationProps {
  onComplete: () => void;
}

const affirmations = [
  "You did it. You faced the hard moment with care.",
  "You're safe. You came back to yourself.",
  "You chose to care for yourself. That's beautiful.",
  "You're learning to be gentle with yourself.",
  "This moment of care matters."
];

const Affirmation = ({ onComplete }: AffirmationProps) => {
  const [affirmation] = useState(
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger gentle celebration animation
    setTimeout(() => setShowConfetti(true), 300);
  }, []);

  return (
    <div className="w-full max-w-lg space-y-6 animate-gentle-fade-in">
      <div className={`bg-card p-8 rounded-3xl shadow-xl space-y-8 ${showConfetti ? 'glow-soft' : ''}`}>
        <div className="text-center space-y-6">
          <div className="text-7xl mb-4 animate-bounce">✨</div>
          
          <h2 className="text-3xl font-bold leading-relaxed">
            {affirmation}
          </h2>
          
          <p className="text-xl text-muted-foreground">
            You're allowed to feel proud of yourself 💗
          </p>
        </div>

        <div className="flex justify-center gap-4 text-4xl animate-pulse">
          <span>🌸</span>
          <span>🌿</span>
          <span>💗</span>
        </div>

        <NurturingButton onClick={onComplete} className="w-full">
          Thank you 🌿
        </NurturingButton>
      </div>
    </div>
  );
};

export default Affirmation;
