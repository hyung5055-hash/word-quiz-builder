import { Link } from "wouter";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
        >
          <div className="bg-primary/10 p-2 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground font-display">
            Lexi<span className="text-primary">Learn</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link 
            href="/" 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            All Quizzes
          </Link>
        </nav>
      </div>
    </header>
  );
}
