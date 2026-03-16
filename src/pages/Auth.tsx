import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Music, ArrowLeft, Loader2 } from "lucide-react";
import MusicNotes from "@/components/MusicNotes";

type AuthMode = "login" | "signup" | "forgot";

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
        navigate("/");
      } else if (mode === "signup") {
        await signUp(email, password, displayName);
        toast({ title: "Check your email!", description: "We sent you a confirmation link." });
      } else {
        await resetPassword(email);
        toast({ title: "Reset email sent", description: "Check your inbox for the reset link." });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-white flex items-center justify-center">
      <MusicNotes />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Music className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-serif font-bold">Lyrical Tale Weaver</h1>
          </div>
          <p className="text-white/70 text-sm">Transform songs into magical stories</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6">
          <h2 className="text-xl font-serif font-bold text-center mb-6 text-white">
            {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Input
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            {mode !== "forgot" && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            )}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/80" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-accent hover:underline block mx-auto">
                  Forgot password?
                </button>
                <p className="text-white/60">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-accent hover:underline">Sign up</button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-white/60">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-accent hover:underline">Sign in</button>
              </p>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-accent hover:underline flex items-center gap-1 mx-auto">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </button>
            )}
          </div>
        </Card>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-white/60 hover:text-white">
            Continue without account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
