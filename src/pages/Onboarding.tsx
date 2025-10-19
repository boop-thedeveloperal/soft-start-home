import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NurturingButton, GentleButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { emotionalStates, defaultCheckinPhrases, updateUserSettings } from "@/lib/supabase";
import { X, Plus } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [phrases, setPhrases] = useState<string[]>(defaultCheckinPhrases);
  const [newPhrase, setNewPhrase] = useState("");
  const [soothingActions, setSoothingActions] = useState<Record<string, string[]>>({});
  const [frequency, setFrequency] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUserId(session.user.id);
      }
    });

    // Initialize default soothing actions
    const defaults: Record<string, string[]> = {};
    emotionalStates.forEach(state => {
      defaults[state.id] = [...state.defaultActions];
    });
    setSoothingActions(defaults);
  }, [navigate]);

  const addPhrase = () => {
    if (newPhrase.trim() && !phrases.includes(newPhrase.trim())) {
      setPhrases([...phrases, newPhrase.trim()]);
      setNewPhrase("");
    }
  };

  const removePhrase = (phrase: string) => {
    setPhrases(phrases.filter(p => p !== phrase));
  };

  const addSoothingAction = (stateId: string, action: string) => {
    if (action.trim()) {
      setSoothingActions(prev => ({
        ...prev,
        [stateId]: [...(prev[stateId] || []), action.trim()]
      }));
    }
  };

  const removeSoothingAction = (stateId: string, action: string) => {
    setSoothingActions(prev => ({
      ...prev,
      [stateId]: prev[stateId].filter(a => a !== action)
    }));
  };

  const handleComplete = async () => {
    if (!userId) return;

    try {
      // Save phrases
      for (const phrase of phrases) {
        await supabase.from('checkin_phrases').insert({
          user_id: userId,
          phrase
        });
      }

      // Save soothing actions
      for (const [state, actions] of Object.entries(soothingActions)) {
        for (const action of actions) {
          await supabase.from('soothing_actions').insert([{
            user_id: userId,
            state: state as 'restless' | 'still' | 'scattered' | 'looping' | 'disconnected',
            action
          }]);
        }
      }

      // Update settings
      await updateUserSettings(userId, {
        checkin_frequency_hours: frequency,
        onboarding_completed: true,
        next_checkin_at: new Date(Date.now() + frequency * 60 * 60 * 1000).toISOString()
      });

      toast.success("All set! 🌸 Let's begin your journey.");
      navigate("/");
    } catch (error: any) {
      toast.error("Oops, something went wrong. Let's try that again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-breathe">
      <div className="w-full max-w-2xl space-y-6 animate-gentle-fade-in">
        {/* Step 1: Welcome & Phrases */}
        {step === 1 && (
          <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold">Hey there 🌿</h1>
              <p className="text-lg text-muted-foreground">
                I'm here to check in with you, gently.
              </p>
              <p className="text-muted-foreground">
                Let's make this space feel safe for you.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-medium">Choose check-in phrases you're comfortable hearing:</p>
              
              <div className="space-y-2">
                {phrases.map(phrase => (
                  <div key={phrase} className="flex items-center gap-2 bg-background p-3 rounded-full">
                    <span className="flex-1 text-sm">{phrase}</span>
                    <button
                      onClick={() => removePhrase(phrase)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newPhrase}
                  onChange={(e) => setNewPhrase(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPhrase())}
                  placeholder="Add your own phrase..."
                  className="rounded-full"
                />
                <GentleButton onClick={addPhrase}>
                  <Plus className="w-4 h-4" />
                </GentleButton>
              </div>
            </div>

            <NurturingButton onClick={() => setStep(2)} className="w-full">
              Continue 🌸
            </NurturingButton>
          </div>
        )}

        {/* Step 2: Soothing Setup */}
        {step === 2 && (
          <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-bold">When you're not feeling okay...</h2>
              <p className="text-muted-foreground">What usually helps you?</p>
            </div>

            <div className="space-y-6">
              {emotionalStates.map(state => (
                <div key={state.id} className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <span className="text-2xl">{state.icon}</span>
                    {state.label}
                  </h3>
                  
                  <div className="space-y-2">
                    {soothingActions[state.id]?.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-background p-2 rounded-full">
                        <span className="flex-1 text-sm px-2">{action}</span>
                        <button
                          onClick={() => removeSoothingAction(state.id, action)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Input
                    placeholder="Add a soothing action..."
                    className="rounded-full text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSoothingAction(state.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <GentleButton onClick={() => setStep(1)} className="flex-1">
                Back
              </GentleButton>
              <NurturingButton onClick={() => setStep(3)} className="flex-1">
                Continue 🌸
              </NurturingButton>
            </div>
          </div>
        )}

        {/* Step 3: Frequency */}
        {step === 3 && (
          <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
            <div className="space-y-3 text-center">
              <h2 className="text-2xl font-bold">How often should I check in?</h2>
              <p className="text-muted-foreground">You can always adjust this later</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <span className="text-lg">Every</span>
                <Input
                  type="number"
                  min="1"
                  max="24"
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-20 h-12 text-center rounded-full text-xl font-semibold"
                />
                <span className="text-lg">hours</span>
              </div>
            </div>

            <div className="flex gap-3">
              <GentleButton onClick={() => setStep(2)} className="flex-1">
                Back
              </GentleButton>
              <NurturingButton onClick={handleComplete} className="flex-1">
                Let's Begin 🌿
              </NurturingButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
