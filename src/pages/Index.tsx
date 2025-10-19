import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { getUserSettings, getCheckinPhrases } from "@/lib/supabase";
import Checkin from "./Checkin";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      
      if (!session) {
        navigate("/auth");
      } else {
        // Check onboarding status
        setTimeout(async () => {
          try {
            const settings = await getUserSettings(session.user.id);
            setOnboardingComplete(settings.onboarding_completed);
            
            if (!settings.onboarding_completed) {
              navigate("/onboarding");
            }
          } catch (error) {
            console.error("Error checking onboarding:", error);
          } finally {
            setLoading(false);
          }
        }, 0);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (!session) {
        navigate("/auth");
        setLoading(false);
      } else {
        setTimeout(async () => {
          try {
            const settings = await getUserSettings(session.user.id);
            setOnboardingComplete(settings.onboarding_completed);
            
            if (!settings.onboarding_completed) {
              navigate("/onboarding");
            }
          } catch (error) {
            console.error("Error checking onboarding:", error);
          } finally {
            setLoading(false);
          }
        }, 0);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-breathe">
        <div className="text-center space-y-4">
          <div className="text-4xl animate-pulse">🌿</div>
          <p className="text-muted-foreground">Loading your space...</p>
        </div>
      </div>
    );
  }

  if (!session || !onboardingComplete) {
    return null;
  }

  return (
    <div className="min-h-screen relative">
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="absolute top-4 right-4 rounded-full"
      >
        Sign Out
      </Button>
      <Checkin userId={session.user.id} />
    </div>
  );
};

export default Index;
