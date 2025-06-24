import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface ProgressData {
  completedLessons: string[];
  lessonScores: Record<string, number>;
}

export function useProgress(userId: number = 1) {
  const queryClient = useQueryClient();
  
  const { data: progress, isLoading } = useQuery<ProgressData>({
    queryKey: ['/api/progress', userId],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: ProgressData) => {
      const response = await apiRequest('POST', `/api/progress/${userId}`, progressData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress', userId] });
    },
  });

  const completeLesson = (lessonId: string, score: number = 100) => {
    if (!progress) return;
    
    const updatedLessons = progress.completedLessons.includes(lessonId) 
      ? progress.completedLessons 
      : [...progress.completedLessons, lessonId];
    
    const updatedScores = {
      ...progress.lessonScores,
      [lessonId]: score
    };

    updateProgressMutation.mutate({
      completedLessons: updatedLessons,
      lessonScores: updatedScores
    });
  };

  const updateScore = (lessonId: string, score: number) => {
    if (!progress) return;
    
    const updatedScores = {
      ...progress.lessonScores,
      [lessonId]: score
    };

    updateProgressMutation.mutate({
      completedLessons: progress.completedLessons,
      lessonScores: updatedScores
    });
  };

  return {
    progress: progress || { completedLessons: [], lessonScores: {} },
    isLoading,
    completeLesson,
    updateScore,
    isUpdating: updateProgressMutation.isPending
  };
}
