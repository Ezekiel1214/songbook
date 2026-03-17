import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="min-h-screen relative overflow-hidden lyrical-gradient text-foreground flex items-center justify-center">
      <MusicNotes />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Music className="h-5 w-5 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Lyrical Tale Weaver</h1>
          <p className="text-muted-foreground text-sm mt-1">Transform songs into magical stories</p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-serif font-bold text-center mb-6 text-foreground">
            {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Input
                placeholder="Display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
            />
            {mode !== "forgot" && (
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-secondary/50 border-border/50 text-foreground placeholder:text-muted-foreground"
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
                <button onClick={() => setMode("forgot")} className="text-primary hover:underline block mx-auto">
                  Forgot password?
                </button>
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline">Sign up</button>
                </p>
              </>
            )}
            {mode === "signup" && (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="text-primary hover:underline">Sign in</button>
              </p>
            )}
            {mode === "forgot" && (
              <button onClick={() => setMode("login")} className="text-primary hover:underline flex items-center gap-1 mx-auto">
                <ArrowLeft className="h-3 w-3" /> Back to login
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            Continue without account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
