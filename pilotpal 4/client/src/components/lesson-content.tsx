import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flashcard } from './flashcard';
import { Quiz } from './quiz';
import { Lesson } from '@shared/schema';
import { useProgress } from '@/hooks/use-progress';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, HelpCircle } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  lessonId: string;
}

export function LessonContent({ lesson, lessonId }: LessonContentProps) {
  const [view, setView] = useState<'flashcards' | 'quiz'>('flashcards');
  const { completeLesson } = useProgress();
  const { toast } = useToast();

  const handleCompleteLesson = (score: number) => {
    completeLesson(lessonId, score);
    toast({
      title: 'Lesson Completed!',
      description: 'Great work! You have successfully completed this lesson.',
    });
  };

  const showQuiz = () => setView('quiz');
  const showFlashcards = () => setView('flashcards');

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Content Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lesson.title}</h2>
            <p className="text-gray-600 mt-1">{lesson.subtitle}</p>
          </div>
          <div className="flex space-x-3">
            <Button
              onClick={showFlashcards}
              variant={view === 'flashcards' ? 'default' : 'outline'}
              className="flex items-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Flashcards</span>
            </Button>
            <Button
              onClick={showQuiz}
              variant={view === 'quiz' ? 'default' : 'outline'}
              className="bg-[var(--aviation-secondary)] hover:bg-green-700 flex items-center space-x-2"
            >
              <HelpCircle className="h-4 w-4" />
              <span>Quiz</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {view === 'flashcards' ? (
          <Flashcard
            flashcards={lesson.flashcards}
            onComplete={showQuiz}
          />
        ) : (
          <Quiz
            quiz={lesson.quiz}
            onComplete={handleCompleteLesson}
            onReturnToFlashcards={showFlashcards}
          />
        )}
      </div>
    </div>
  );
}
