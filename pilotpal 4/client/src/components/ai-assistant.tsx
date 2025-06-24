import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Bot, Send, MessageCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function AIAssistant() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const { toast } = useToast();

  const askAIMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest('POST', '/api/ask-ai', { question });
      return response.json();
    },
    onSuccess: (data) => {
      setResponse(data.answer);
      setShowResponse(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to get AI response. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    if (!question.trim()) {
      toast({
        title: 'Warning',
        description: 'Please enter a question',
        variant: 'destructive',
      });
      return;
    }
    askAIMutation.mutate(question);
  };

  const sampleQuestions = [
    'What are the different types of airspace?',
    'How do I calculate weight and balance?',
    'When should I use carburetor heat?',
    'What is the difference between VFR and IFR?'
  ];

  const setQuestionFromSample = (sampleQuestion: string) => {
    setQuestion(sampleQuestion);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card className="shadow-sm border border-gray-200 mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Bot className="text-2xl text-[var(--aviation-primary)]" />
            <div>
              <h3 className="font-semibold text-gray-900">PilotPal AI Assistant</h3>
              <p className="text-sm text-gray-600">Powered by advanced AI to help with your flight training</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="userQuestion" className="block text-sm font-medium text-gray-700 mb-2">
                Ask your aviation question:
              </Label>
              <Textarea
                id="userQuestion"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Example: What is the difference between true altitude and indicated altitude?"
                className="w-full resize-none"
                rows={4}
              />
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={askAIMutation.isPending}
              className="bg-[var(--aviation-primary)] hover:bg-blue-700 font-medium flex items-center space-x-2"
            >
              {askAIMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Ask Question</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResponse && (
        <Card className="shadow-sm border border-gray-200 mb-6">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <MessageCircle className="text-[var(--aviation-primary)]" />
              <span>AI Response</span>
            </h4>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{response}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sample Questions */}
      <Card className="bg-[var(--aviation-light)] border border-gray-200">
        <CardContent className="p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Sample Questions to Try:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sampleQuestions.map((sampleQuestion, index) => (
              <Button
                key={index}
                onClick={() => setQuestionFromSample(sampleQuestion)}
                variant="outline"
                className="text-left p-3 h-auto justify-start bg-white hover:bg-gray-50 text-sm"
              >
                {sampleQuestion}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
