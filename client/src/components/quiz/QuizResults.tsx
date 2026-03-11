import React, { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { RotateCcw, Home, Trophy, Target, Star } from "lucide-react";

interface QuizResultsProps {
  score: number;
  total: number;
  onRetry: () => void;
}

export function QuizResults({ score, total, onRetry }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100);
  
  useEffect(() => {
    if (percentage >= 70) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [percentage]);

  let MessageIcon = Trophy;
  let messageTitle = "Outstanding!";
  let messageBody = "You've truly mastered this vocabulary set.";
  let iconColor = "text-yellow-500";
  let iconBg = "bg-yellow-500/10";

  if (percentage < 40) {
    MessageIcon = Target;
    messageTitle = "Keep Trying!";
    messageBody = "Practice makes perfect. Review the words and try again.";
    iconColor = "text-blue-500";
    iconBg = "bg-blue-500/10";
  } else if (percentage < 70) {
    MessageIcon = Star;
    messageTitle = "Good Effort!";
    messageBody = "You're getting there. A little more practice and you'll nail it.";
    iconColor = "text-primary";
    iconBg = "bg-primary/10";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent -z-10" />
        
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 12, delay: 0.2 }}
          className={`w-24 h-24 mx-auto rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-6`}
        >
          <MessageIcon className="w-12 h-12" />
        </motion.div>

        <h2 className="text-3xl font-display font-bold text-foreground mb-2">
          {messageTitle}
        </h2>
        <p className="text-muted-foreground mb-8 text-lg">
          {messageBody}
        </p>

        <div className="bg-background/50 rounded-2xl p-6 mb-8 border border-border/50 shadow-inner">
          <div className="flex items-end justify-center gap-2 mb-2">
            <span className="text-6xl font-display font-extrabold text-primary leading-none">
              {score}
            </span>
            <span className="text-2xl font-bold text-muted-foreground mb-1">
              / {total}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Final Score ({percentage}%)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Retry Quiz
          </button>
          
          <Link href="/" className="w-full sm:w-auto">
            <span className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer">
              <Home className="w-5 h-5" />
              Back to Home
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
