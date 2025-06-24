import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Lightbulb, CheckCircle, GraduationCap } from 'lucide-react';
import { Flashcard as FlashcardType } from '@shared/schema';

interface FlashcardProps {
  flashcards: FlashcardType[];
  onComplete: () => void;
}

export function Flashcard({ flashcards, onComplete }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-gray-500">No flashcards available for this lesson.</p>
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Flashcards</h3>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {flashcards.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mx-auto max-w-2xl mb-6">
        {!isFlipped ? (
          <Card 
            className="border-2 border-[var(--aviation-primary)] cursor-pointer h-64 transition-all duration-300 hover:shadow-lg"
            onClick={flipCard}
          >
            <CardContent className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <Lightbulb className="text-3xl text-[var(--aviation-primary)] mb-4 mx-auto" />
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Question</h4>
                <p className="text-gray-700 mb-4 text-lg">{currentCard.q}</p>
                <p className="text-sm text-gray-500">Click to reveal answer</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card 
            className="bg-[var(--aviation-primary)] text-white cursor-pointer h-64 transition-all duration-300 hover:shadow-lg"
            onClick={flipCard}
          >
            <CardContent className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <CheckCircle className="text-3xl mb-4 mx-auto" />
                <h4 className="text-lg font-semibold mb-4">Answer</h4>
                <p className="mb-4 text-lg">{currentCard.a}</p>
                <p className="text-sm opacity-80">Click to return to question</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-center space-x-4 mb-8 relative z-10">
        <Button
          onClick={previousCard}
          disabled={currentIndex === 0}
          variant="outline"
          className="flex items-center space-x-2 px-6 py-3 text-lg"
          size="lg"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Previous Card</span>
        </Button>
        <Button
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          className="bg-[var(--aviation-primary)] hover:bg-blue-700 flex items-center space-x-2 px-6 py-3 text-lg"
          size="lg"
        >
          <span>Next Card</span>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {currentIndex === flashcards.length - 1 && (
        <div className="text-center">
          <Button
            onClick={onComplete}
            className="bg-[var(--aviation-secondary)] hover:bg-green-700 font-semibold flex items-center space-x-2 mx-auto"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Take Quiz</span>
          </Button>
        </div>
      )}
    </div>
  );
}
