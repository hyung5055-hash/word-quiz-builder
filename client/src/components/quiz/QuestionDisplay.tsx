import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (selectedOption: string, isCorrect: boolean) => void;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions, onAnswer }: QuestionDisplayProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const handleOptionClick = (option: string) => {
    if (selectedOption || isAnimatingOut) return; // Prevent double clicks
    
    setSelectedOption(option);
    setIsAnimatingOut(true);
    
    const isCorrect = option === question.correctOption;
    
    // Brief delay to show selection highlight before moving on
    setTimeout(() => {
      onAnswer(option, isCorrect);
      setSelectedOption(null);
      setIsAnimatingOut(false);
    }, 600);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-2xl mx-auto"
      >
        <div className="mb-8 text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            Question {questionNumber} of {totalQuestions}
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-extrabold font-display text-foreground tracking-tight">
            {question.word}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted-foreground mt-4 text-lg">
            Choose the correct definition for this word.
          </motion.p>
        </div>

        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isRevealed = selectedOption !== null;
            const isCorrect = option === question.correctOption;
            
            // Determine button styling based on state
            let buttonClass = "bg-card border-border hover:border-primary/50 hover:bg-accent/50 text-foreground";
            let icon = null;

            if (isRevealed) {
              if (isSelected && isCorrect) {
                buttonClass = "bg-success/10 border-success text-success-foreground z-10 scale-[1.02] shadow-lg shadow-success/20";
                icon = <CheckCircle2 className="w-5 h-5 text-success ml-auto" />;
              } else if (isSelected && !isCorrect) {
                buttonClass = "bg-destructive/10 border-destructive text-destructive-foreground z-10 scale-[1.02] shadow-lg shadow-destructive/20";
                icon = <XCircle className="w-5 h-5 text-destructive ml-auto" />;
              } else if (isCorrect) {
                // Highlight correct answer even if they didn't pick it
                buttonClass = "bg-success/5 border-success/50 text-foreground";
                icon = <CheckCircle2 className="w-5 h-5 text-success/50 ml-auto" />;
              } else {
                buttonClass = "bg-card/50 border-border/50 text-muted-foreground opacity-50";
              }
            }

            return (
              <motion.button
                key={index}
                variants={itemVariants}
                onClick={() => handleOptionClick(option)}
                disabled={isRevealed}
                className={`
                  w-full text-left px-6 py-4 rounded-xl border-2 transition-all duration-300 
                  flex items-center text-lg font-medium outline-none
                  focus-visible:ring-4 focus-visible:ring-primary/20
                  ${buttonClass}
                `}
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 mr-4 text-sm font-bold text-muted-foreground">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-grow">{option}</span>
                {icon}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
