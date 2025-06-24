import { useState } from 'react';
import { LessonSidebar } from '@/components/lesson-sidebar';
import { LessonContent } from '@/components/lesson-content';
import { AIAssistant } from '@/components/ai-assistant';
import { Card, CardContent } from '@/components/ui/card';
import { lessonData } from '@/lib/lesson-data';
import { PlaneIcon, BookOpen, Brain, Bot } from 'lucide-react';

export default function Home() {
  const [currentSection, setCurrentSection] = useState('home');
  const [currentLesson, setCurrentLesson] = useState<string>('');

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    if (section !== 'lesson') {
      setCurrentLesson('');
    }
  };

  const handleLessonChange = (lesson: string) => {
    setCurrentLesson(lesson);
    setCurrentSection('lesson');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'ask':
        return (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="bg-white border-b border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Flight Training Assistant</h2>
              <p className="text-gray-600 mt-1">Get instant answers to your aviation questions</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AIAssistant />
            </div>
          </div>
        );
      case 'lesson':
        const lesson = lessonData[currentLesson];
        if (!lesson) {
          return (
            <div className="flex-1 flex items-center justify-center p-8">
              <p className="text-gray-500">Lesson not found.</p>
            </div>
          );
        }
        return <LessonContent lesson={lesson} lessonId={currentLesson} />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center h-full p-8">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <PlaneIcon className="text-6xl text-[var(--aviation-primary)] mb-4 mx-auto" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to PilotPal</h2>
              <p className="text-xl text-gray-600 mb-8">
                Your comprehensive flight training companion. Master the fundamentals of aviation 
                with interactive lessons, flashcards, and AI-powered assistance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-sm border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="text-2xl text-[var(--aviation-primary)] mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2">11 Comprehensive Lessons</h3>
                    <p className="text-gray-600 text-sm">From aerodynamics to navigation systems</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <Brain className="text-2xl text-[var(--aviation-secondary)] mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2">Interactive Flashcards</h3>
                    <p className="text-gray-600 text-sm">Reinforce your knowledge with spaced repetition</p>
                  </CardContent>
                </Card>
                <Card className="shadow-sm border border-gray-200">
                  <CardContent className="p-6 text-center">
                    <Bot className="text-2xl text-[var(--aviation-accent)] mb-3 mx-auto" />
                    <h3 className="font-semibold mb-2">AI-Powered Q&A</h3>
                    <p className="text-gray-600 text-sm">Get instant answers to aviation questions</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <LessonSidebar
        currentSection={currentSection}
        onSectionChange={handleSectionChange}
        currentLesson={currentLesson}
        onLessonChange={handleLessonChange}
      />
      {renderContent()}
    </div>
  );
}
