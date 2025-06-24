import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Home, Bot, Plane, Menu, X, BookOpen, CheckCircle } from 'lucide-react';
import { useProgress } from '@/hooks/use-progress';
import { lessonData } from '@/lib/lesson-data';

interface LessonSidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  currentLesson?: string;
  onLessonChange: (lesson: string) => void;
}

export function LessonSidebar({ 
  currentSection, 
  onSectionChange, 
  currentLesson, 
  onLessonChange 
}: LessonSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { progress } = useProgress();

  const progressPercentage = (progress.completedLessons.length / 11) * 100;

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const closeMobile = () => setIsMobileOpen(false);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    closeMobile();
  };

  const handleLessonChange = (lesson: string) => {
    onLessonChange(lesson);
    closeMobile();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        onClick={toggleMobile}
        className="md:hidden fixed top-4 left-4 z-50 bg-[var(--aviation-primary)] hover:bg-blue-700"
        size="icon"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <div className={`
        sidebar-transition w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col 
        md:relative fixed inset-y-0 left-0 z-40
        ${isMobileOpen ? '' : 'sidebar-hidden md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="bg-[var(--aviation-primary)] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Plane className="text-2xl" />
            <div>
              <h1 className="text-xl font-bold">PilotPal</h1>
              <p className="text-[var(--aviation-light)] text-sm">Flight Training Assistant</p>
            </div>
          </div>
          <Button
            onClick={closeMobile}
            className="md:hidden text-white bg-transparent hover:bg-blue-700 p-2"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Overview */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress Overview</h3>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-xs text-gray-600">
            {progress.completedLessons.length} of 11 lessons completed
          </p>
        </div>

        {/* Navigation */}
        <div className="p-6 border-b border-gray-200">
          <Button
            onClick={() => handleSectionChange('home')}
            variant={currentSection === 'home' ? 'default' : 'ghost'}
            className="w-full justify-start mb-2"
          >
            <Home className="mr-3 h-4 w-4" />
            Home
          </Button>
          <Button
            onClick={() => handleSectionChange('ask')}
            variant={currentSection === 'ask' ? 'default' : 'ghost'}
            className="w-full justify-start"
          >
            <Bot className="mr-3 h-4 w-4" />
            Ask AI Assistant
          </Button>
        </div>

        {/* Lessons */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Training Lessons</h3>
          <div className="space-y-2">
            {Array.from({ length: 11 }, (_, i) => {
              const lessonId = `lesson${i + 1}`;
              const isCompleted = progress.completedLessons.includes(lessonId);
              const hasData = !!lessonData[lessonId];
              const score = progress.lessonScores[lessonId];

              return (
                <Button
                  key={lessonId}
                  onClick={() => hasData ? handleLessonChange(lessonId) : null}
                  disabled={!hasData}
                  variant={currentLesson === lessonId ? 'default' : 'ghost'}
                  className={`
                    w-full justify-between p-3 h-auto
                    ${isCompleted ? 'bg-[var(--aviation-light)] border border-[var(--aviation-secondary)]' : ''}
                    ${!hasData ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      ${isCompleted 
                        ? 'bg-[var(--aviation-secondary)] text-white' 
                        : 'bg-gray-200 text-gray-600'
                      }
                    `}>
                      {isCompleted ? <CheckCircle className="h-3 w-3" /> : i + 1}
                    </div>
                    <span className="font-medium">Lesson {i + 1}</span>
                  </div>
                  {score && (
                    <span className="text-xs text-[var(--aviation-secondary)] font-semibold">
                      {score}%
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobile}
        />
      )}
    </>
  );
}
