import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, CheckCircle, XCircle, RotateCcw, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { Quiz as QuizType } from '@shared/schema';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number) => void;
  onReturnToFlashcards: () => void;
}

export function Quiz({ quiz, onComplete, onReturnToFlashcards }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(new Array(quiz.questions.length).fill(''));
  const [submitted, setSubmitted] = useState<boolean[]>(new Array(quiz.questions.length).fill(false));
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>(new Array(quiz.questions.length).fill(false));
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentSelectedAnswer = selectedAnswers[currentQuestionIndex];
  const currentSubmitted = submitted[currentQuestionIndex];
  const currentIsCorrect = correctAnswers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleSubmit = () => {
    if (!currentSelectedAnswer) return;
    
    const answerIndex = parseInt(currentSelectedAnswer);
    const correct = answerIndex === currentQuestion.correct;
    
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[currentQuestionIndex] = correct;
    setCorrectAnswers(newCorrectAnswers);
    
    const newSubmitted = [...submitted];
    newSubmitted[currentQuestionIndex] = true;
    setSubmitted(newSubmitted);
  };

  const handleRetry = () => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = '';
    setSelectedAnswers(newSelectedAnswers);
    
    const newSubmitted = [...submitted];
    newSubmitted[currentQuestionIndex] = false;
    setSubmitted(newSubmitted);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (value: string) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = value;
    setSelectedAnswers(newSelectedAnswers);
  };

  const calculateFinalScore = () => {
    const correctCount = correctAnswers.filter(Boolean).length;
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleCompleteQuiz = () => {
    const score = calculateFinalScore();
    onComplete(score);
    setQuizCompleted(true);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto pb-32">
      <Card className="shadow-sm border border-gray-200">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <ClipboardList className="text-4xl text-[var(--aviation-primary)] mb-4 mx-auto" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Knowledge Check</h3>
            <p className="text-gray-600">Test your understanding of this lesson</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </h4>
            </div>
            <Progress value={progress} className="h-2 mb-6" />
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-6">{currentQuestion.question}</h4>
            
            <RadioGroup 
              value={currentSelectedAnswer} 
              onValueChange={handleAnswerChange}
              disabled={currentSubmitted}
              className="space-y-3"
            >
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mr-4" />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {!currentSubmitted ? (
            <div className="text-center mb-8">
              <Button
                onClick={handleSubmit}
                disabled={!currentSelectedAnswer}
                className="bg-[var(--aviation-primary)] hover:bg-blue-700 font-semibold"
              >
                Submit Answer
              </Button>
            </div>
          ) : (
            <Card className={`mb-8 p-6 ${currentIsCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {currentIsCorrect ? (
                    <CheckCircle className="text-2xl text-[var(--aviation-secondary)]" />
                  ) : (
                    <XCircle className="text-2xl text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h5 className={`font-semibold mb-2 ${currentIsCorrect ? 'text-[var(--aviation-secondary)]' : 'text-red-600'}`}>
                    {currentIsCorrect ? 'Correct!' : 'Incorrect'}
                  </h5>
                  <p className="text-gray-700 mb-4">{currentQuestion.explanation}</p>
                  
                  {!currentIsCorrect && (
                    <div className="flex space-x-3 mb-4">
                      <Button
                        onClick={onReturnToFlashcards}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Review Flashcards</span>
                      </Button>
                      <Button
                        onClick={handleRetry}
                        className="bg-gray-500 hover:bg-gray-600 flex items-center space-x-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Try Again</span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-center space-x-4 mb-8 relative z-10">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="flex items-center space-x-2 px-6 py-3 text-lg"
              size="lg"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous Question</span>
            </Button>
            
            {currentQuestionIndex === quiz.questions.length - 1 ? (
              <Button
                onClick={handleCompleteQuiz}
                disabled={!submitted.every(Boolean)}
                className="bg-[var(--aviation-secondary)] hover:bg-green-700 font-semibold flex items-center space-x-2 px-6 py-3 text-lg"
                size="lg"
              >
                <span>Complete Quiz</span>
              </Button>
            ) : (
              <Button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === quiz.questions.length - 1}
                className="bg-[var(--aviation-primary)] hover:bg-blue-700 flex items-center space-x-2 px-6 py-3 text-lg"
                size="lg"
              >
                <span>Next Question</span>
                <ChevronRight className="h-5 w-5" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
