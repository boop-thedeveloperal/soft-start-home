import { useState, useEffect } from "react";
import { NurturingButton, GentleButton } from "@/components/ui/button-variants";
import { getCheckinPhrases, logCheckin } from "@/lib/supabase";
import SupportFlow from "@/components/SupportFlow";
import { toast } from "sonner";

interface CheckinProps {
  userId: string;
}

const Checkin = ({ userId }: CheckinProps) => {
  const [currentPhrase, setCurrentPhrase] = useState("");
  const [showSupport, setShowSupport] = useState(false);
  const [phrases, setPhrases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPhrase();
  }, [userId]);

  const loadPhrase = async () => {
    try {
      const userPhrases = await getCheckinPhrases(userId);
      if (userPhrases.length > 0) {
        setPhrases(userPhrases.map(p => p.phrase));
        const randomPhrase = userPhrases[Math.floor(Math.random() * userPhrases.length)];
        setCurrentPhrase(randomPhrase.phrase);
      }
    } catch (error) {
      console.error("Error loading phrases:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (response: 'alright' | 'not_alright') => {
    try {
      await logCheckin(userId, {
        response,
        checkin_time: new Date().toISOString()
      });

      if (response === 'alright') {
        toast.success("Beautiful 🌸");
        // Could navigate to a calm completion screen or just stay here
      } else {
        setShowSupport(true);
      }
    } catch (error) {
      console.error("Error logging check-in:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-breathe">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">🌿</div>
        </div>
      </div>
    );
  }

  if (showSupport) {
    return <SupportFlow userId={userId} onComplete={() => setShowSupport(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-breathe">
      <div className="w-full max-w-lg space-y-8 text-center animate-gentle-fade-in">
        <div className="space-y-6">
          <div className="text-6xl mb-8 animate-pulse">🌿</div>
          
          <h1 className="text-3xl md:text-4xl font-bold leading-relaxed px-4">
            {currentPhrase}
          </h1>
        </div>

        <div className="space-y-6 pt-8">
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <NurturingButton 
              onClick={() => handleResponse('alright')}
              className="h-32 text-lg"
            >
              Yep, I'm alright! 😊
            </NurturingButton>

            <NurturingButton 
              onClick={() => handleResponse('not_alright')}
              className="h-32 text-lg bg-accent hover:bg-accent/90"
            >
              No, I'm not alright... 💗
            </NurturingButton>
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors underline">
            Delay check-in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkin;
