import { useState, useEffect } from "react";
import { NurturingButton } from "../ui/button-variants";
import { emotionalStates, getSoothingActions } from "@/lib/supabase";

interface StateSelectionProps {
  userId: string;
  onStateSelected: (state: string, action: string) => void;
}

const StateSelection = ({ userId, onStateSelected }: StateSelectionProps) => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleStateClick = async (stateId: string) => {
    setSelectedState(stateId);
    setLoading(true);
    
    try {
      const userActions = await getSoothingActions(userId, stateId as 'restless' | 'still' | 'scattered' | 'looping' | 'disconnected');
      setActions(userActions);
    } catch (error) {
      console.error("Error loading actions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionSelect = (action: string) => {
    onStateSelected(selectedState, action);
  };

  if (selectedState && actions.length > 0) {
    return (
      <div className="w-full max-w-lg space-y-6 animate-gentle-fade-in">
        <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <p className="text-xl text-muted-foreground">
              Let's try one of these:
            </p>
          </div>

          <div className="space-y-3">
            {actions.map((action) => (
              <NurturingButton
                key={action.id}
                onClick={() => handleActionSelect(action.action)}
                className="w-full"
              >
                {action.action}
              </NurturingButton>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg space-y-6 animate-gentle-fade-in">
      <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold">
            What kind of 'not alright' is it?
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {emotionalStates.map((state) => (
            <NurturingButton
              key={state.id}
              onClick={() => handleStateClick(state.id)}
              disabled={loading}
              className="flex items-center justify-center gap-3 h-20"
            >
              <span className="text-3xl">{state.icon}</span>
              <span className="text-lg">{state.label}</span>
            </NurturingButton>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StateSelection;
