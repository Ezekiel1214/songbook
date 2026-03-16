import { Music, BookOpen, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="w-full py-4">
      <div className="container flex justify-between items-center">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Music className="h-6 w-6 text-accent" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold bg-gradient-to-r from-lyrical-purple to-lyrical-gold text-transparent bg-clip-text">
            Lyrical Tale Weaver
          </h1>
        </button>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/library")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">My Stories</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className="text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
      <div className="container text-center mt-1">
        <p className="text-sm md:text-base text-white/80 italic">
          Create stories from songs • Search lyrics • Weave tales
        </p>
      </div>
    </header>
  );
};

export default Header;
