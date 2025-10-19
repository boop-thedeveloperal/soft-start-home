import { NurturingButton } from "../ui/button-variants";

interface RegulationCheckProps {
  userId: string;
  onResponse: (feltBetter: boolean) => void;
}

const RegulationCheck = ({ userId, onResponse }: RegulationCheckProps) => {
  return (
    <div className="w-full max-w-lg space-y-6 animate-gentle-fade-in">
      <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
        <div className="text-center space-y-4">
          <div className="text-5xl mb-4">🌸</div>
          
          <h2 className="text-2xl font-bold">
            How are you feeling now?
          </h2>
        </div>

        <div className="space-y-3">
          <NurturingButton
            onClick={() => onResponse(true)}
            className="w-full"
          >
            Better 😊
          </NurturingButton>

          <NurturingButton
            onClick={() => onResponse(false)}
            className="w-full bg-accent hover:bg-accent/90"
          >
            Still not okay 😞
          </NurturingButton>
        </div>
      </div>
    </div>
  );
};

export default RegulationCheck;
