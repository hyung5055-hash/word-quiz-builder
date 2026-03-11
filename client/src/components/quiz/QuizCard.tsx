import { Link } from "wouter";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  index: number;
}

export function QuizCard({ id, title, description, index }: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      <Link 
        href={`/quiz/${id}`}
        className="block h-full outline-none group"
      >
        <div className="h-full flex flex-col p-6 rounded-2xl glass-card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <BookOpen className="w-6 h-6" />
          </div>
          
          <h3 className="text-xl font-bold font-display text-foreground mb-2 line-clamp-1">
            {title}
          </h3>
          
          <p className="text-muted-foreground text-sm flex-grow line-clamp-2 mb-6">
            {description}
          </p>
          
          <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
            <div className="flex items-center text-xs text-muted-foreground font-medium">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              <span>~ 5 mins</span>
            </div>
            
            <div className="flex items-center text-sm font-semibold text-primary group-hover:translate-x-1 transition-transform duration-300">
              Start Quiz
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
