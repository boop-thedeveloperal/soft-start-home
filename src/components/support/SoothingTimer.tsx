import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";

interface SoothingTimerProps {
  action: string;
  onComplete: () => void;
  duration?: number; // in seconds, default 90
}

const SoothingTimer = ({ action, onComplete, duration = 90 }: SoothingTimerProps) => {
  const [seconds, setSeconds] = useState(duration);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (seconds === 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setSeconds(s => s - 1);
      setProgress(((duration - seconds + 1) / duration) * 100);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, duration, onComplete]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg space-y-6 animate-gentle-fade-in">
      <div className="bg-card p-8 rounded-3xl shadow-xl space-y-8">
        <div className="text-center space-y-4">
          <div className="text-5xl mb-4 animate-pulse">💗</div>
          
          <p className="text-xl font-medium">
            Let's take 90 seconds to...
          </p>
          
          <p className="text-2xl font-bold text-primary">
            {action}
          </p>
          
          <p className="text-muted-foreground">
            I'll stay with you.
          </p>
        </div>

        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold tabular-nums animate-breathe">
              {formatTime(seconds)}
            </div>
          </div>
          
          <Progress value={progress} className="h-3" />
        </div>

        <div className="text-center text-sm text-muted-foreground animate-pulse">
          Breathe... You're doing great 🌿
        </div>
      </div>
    </div>
  );
};

export default SoothingTimer;
