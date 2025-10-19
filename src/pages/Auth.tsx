import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { GentleButton } from "@/components/ui/button-variants";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Session } from "@supabase/supabase-js";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success("Welcome! 🌿 Let's get you set up.");
        navigate("/onboarding");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back 🌸");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (session) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 animate-breathe">
      <div className="w-full max-w-md space-y-8 animate-gentle-fade-in">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            Inner Parent 🌿
          </h1>
          <p className="text-lg text-muted-foreground">
            Your gentle companion for self-care
          </p>
        </div>

        <div className="bg-card p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex gap-2 p-1 bg-background rounded-full">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                !isSignUp 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                isSignUp 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-full border-2"
              />
            </div>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-full border-2"
                minLength={6}
              />
            </div>

            <GentleButton
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
            </GentleButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
