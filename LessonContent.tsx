import { useState } from 'react';
import { useProgress } from '@/hooks/use-progress';
import { Card, CardContent } from '@/components/ui/card';

interface Lesson {
  title: string;
  subtitle: string;
  flashcards: { q: string; a: string }[];
  quiz: {
    questions: {
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }[];
  };
}

interface LessonContentProps {
  lesson: Lesson;
  lessonId: string;
}

export function LessonContent({ lesson, lessonId }: LessonContentProps) {
  const { completeLesson } = useProgress();
  const [answers, setAnswers] = useState<number[]>(Array(lesson.quiz.questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex: number, choice: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = choice;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correct = 0;
    lesson.quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correct) correct++;
    });
    const percent = Math.round((correct / lesson.quiz.questions.length) * 100);
    setScore(percent);
    setSubmitted(true);
    completeLesson(lessonId, percent); // mark lesson complete
  };

  return (
    <div className="p-6 overflow-y-auto flex-1">
      <h2 className="text-3xl font-bold mb-2">{lesson.title}</h2>
      <p className="text-gray-600 mb-6">{lesson.subtitle}</p>

      <h3 className="text-xl font-semibold mb-3">Flashcards</h3>
      <div className="grid gap-4 mb-8">
        {lesson.flashcards.map((fc, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <p><strong>Q:</strong> {fc.q}</p>
              <p><strong>A:</strong> {fc.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h3 className="text-xl font-semibold mb-3">Quiz</h3>
      {lesson.quiz.questions.map((q, i) => (
        <div key={i} className="mb-6">
          <p className="font-medium mb-2">{i + 1}. {q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j} className="block mb-1">
              <input
                type="radio"
                name={`q${i}`}
                checked={answers[i] === j}
                onChange={() => handleSelect(i, j)}
                disabled={submitted}
              />{' '}
              {opt}
            </label>
          ))}
          {submitted && (
            <p className={`text-sm mt-1 ${answers[i] === q.correct ? 'text-green-600' : 'text-red-600'}`}>
              {answers[i] === q.correct ? 'Correct!' : `Incorrect. ${q.explanation}`}
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      )}

      {submitted && (
        <p className="mt-4 text-lg font-se

        