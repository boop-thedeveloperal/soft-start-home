import { useState } from "react";
import StateSelection from "./support/StateSelection";
import SoothingTimer from "./support/SoothingTimer";
import RegulationCheck from "./support/RegulationCheck";
import Affirmation from "./support/Affirmation";

interface SupportFlowProps {
  userId: string;
  onComplete: () => void;
}

type FlowStep = 'state' | 'soothing' | 'check' | 'affirmation';

const SupportFlow = ({ userId, onComplete }: SupportFlowProps) => {
  const [step, setStep] = useState<FlowStep>('state');
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedAction, setSelectedAction] = useState<string>("");

  const handleStateSelected = (state: string, action: string) => {
    setSelectedState(state);
    setSelectedAction(action);
    setStep('soothing');
  };

  const handleTimerComplete = () => {
    setStep('check');
  };

  const handleCheckResponse = (feltBetter: boolean) => {
    if (feltBetter) {
      setStep('affirmation');
    } else {
      // Go back to state selection to try another approach
      setStep('state');
    }
  };

  const handleAffirmationComplete = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-breathe">
      {step === 'state' && (
        <StateSelection userId={userId} onStateSelected={handleStateSelected} />
      )}
      
      {step === 'soothing' && (
        <SoothingTimer 
          action={selectedAction} 
          onComplete={handleTimerComplete}
        />
      )}
      
      {step === 'check' && (
        <RegulationCheck 
          userId={userId}
          onResponse={handleCheckResponse}
        />
      )}
      
      {step === 'affirmation' && (
        <Affirmation onComplete={handleAffirmationComplete} />
      )}
    </div>
  );
};

export default SupportFlow;
