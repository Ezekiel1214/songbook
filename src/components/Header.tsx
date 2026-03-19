import { Music, BookOpen, LogIn, LogOut, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-4">
      <div className="container flex justify-between items-center">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Music className="h-4 w-4 text-primary" />
          </div>
          <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground">
            Lyrical Tale <span className="text-accent">Weaver</span>
          </h1>
        </button>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/library")}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">My Stories</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
