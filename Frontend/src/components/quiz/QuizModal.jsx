import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle } from 'lucide-react';
import { quizService } from '../../services/quizService';

// Fisher-Yates Shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const QuizModal = ({ quizData, isOpen, onClose, onSuccess }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    if (quizData?.questions) {
      const shuffled = shuffleArray(quizData.questions).map(q => ({
        ...q,
        shuffledOptions: shuffleArray(['a', 'b', 'c', 'd'])
      }));
      setShuffledQuestions(shuffled);
    }
  }, [quizData]);

  if (!isOpen || !quizData || shuffledQuestions.length === 0) return null;

  const { quiz } = quizData;

  const handleSelectOption = (questionId, optionKey) => {
    setAnswers({ ...answers, [questionId]: optionKey });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let attemptResult;
      if (quiz.isMock) {
        await new Promise(resolve => setTimeout(resolve, 800)); // fake delay
        // Mock a 100% score for demo
        attemptResult = { score: 100, passed: true };
      } else {
        const response = await quizService.submitAttempt(quiz._id, answers);
        attemptResult = response.data.data;
      }
      setResult(attemptResult);
      if (attemptResult.score >= quiz.passing_score) {
        onSuccess(attemptResult);
      }
    } catch (error) {
      console.error('Failed to submit quiz', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === shuffledQuestions.length - 1;
  const isPassed = result?.score >= quiz.passing_score;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{quiz.title}</h2>
          {!result && (
            <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {result ? (
            <div className="text-center py-8">
              {isPassed ? (
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              )}
              <h3 className="text-2xl font-bold mb-2">
                {isPassed ? 'Congratulations!' : 'Keep Trying!'}
              </h3>
              <p className="text-gray-600 mb-6">
                You scored <span className="font-bold text-lg">{result.score}%</span>. 
                (Passing score is {quiz.passing_score}%)
              </p>
              
              {!isPassed && (
                <button
                  onClick={() => { setResult(null); setAnswers({}); setCurrentQuestionIndex(0); }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Retry Quiz
                </button>
              )}
              {isPassed && (
                <button
                  onClick={onClose}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Learning
                </button>
              )}
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6 text-sm text-gray-500 font-medium">
                <span>Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
                <div className="w-32 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / shuffledQuestions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">{currentQuestion.question}</h3>
              
              <div className="space-y-3">
                {currentQuestion.shuffledOptions.map((key, index) => {
                  const optionText = currentQuestion[`option_${key}`];
                  if (!optionText) return null;
                  
                  const isSelected = answers[currentQuestion._id] === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleSelectOption(currentQuestion._id, key)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50 text-blue-900' 
                          : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                      }`}
                    >
                      <span className="inline-block w-6 font-bold uppercase mr-2">{String.fromCharCode(65 + index)}.</span>
                      {optionText}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 font-medium text-gray-600 disabled:opacity-50"
            >
              Previous
            </button>
            
            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(answers).length < shuffledQuestions.length || isSubmitting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(shuffledQuestions.length - 1, prev + 1))}
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
