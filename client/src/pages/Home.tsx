import { Navbar } from "@/components/layout/Navbar";
import { useQuizzes } from "@/hooks/use-quizzes";
import { Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";

export default function Home() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("username");

    if (!user) {
      setLocation("/login");
    }
  }, [setLocation]);

  const { data: quizzes, isLoading, error } = useQuizzes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error || !quizzes) {
    return <div className="text-center mt-10">Error loading quizzes.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12">
        <p className="text-center mb-6">
          👤 {localStorage.getItem("username")}
        </p>

        <h1 className="text-4xl font-bold mb-10 text-center">
          Choose a language
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {quizzes.map((quiz: any) => (
            <Link key={quiz.id} href={`/quiz/${quiz.id}`}>
              <div className="p-6 rounded-xl border shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-muted-foreground">Start practicing now 🚀</p>
              </div>
            </Link>
          ))}

          <Link href="/match">
            <div className="p-6 rounded-xl border shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                German - French Match
              </h2>
              <p className="text-muted-foreground">Match verbs 🇩🇪🇫🇷</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
