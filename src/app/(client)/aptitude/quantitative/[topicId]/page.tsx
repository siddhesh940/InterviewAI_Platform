"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPDFQuestions } from "@/data/pdf-questions";
import { getTopicInfo } from "@/data/quantitative-data";
import { AlertTriangle, ArrowLeft, BarChart3, BookOpen, CheckCircle, Lightbulb, Play, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface PracticeSession {
  currentQuestion: number;
  answers: { questionId: number; selectedAnswer: string; isCorrect: boolean }[];
  score: number;
  isComplete: boolean;
}

export default function TopicPage() {
  const router = useRouter();
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [mode, setMode] = useState<'intro' | 'practice' | 'result'>('intro');
  const [session, setSession] = useState<PracticeSession>({
    currentQuestion: 0,
    answers: [],
    score: 0,
    isComplete: false
  });
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const topicInfo = getTopicInfo(topicId);
  const pdfQuestions = getPDFQuestions(topicId);

  // Merge PDF questions with topic info
  const mergedTopicInfo = topicInfo ? {
    ...topicInfo,
    questions: pdfQuestions.length > 0 ? pdfQuestions.map(q => ({
      ...q,
      difficulty: q.difficulty || 'Medium' as 'Easy' | 'Medium' | 'Hard'
    })) : topicInfo.questions
  } : null;

  if (!mergedTopicInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Topic Not Found</h2>
            <p className="text-gray-600 mb-4">The requested topic could not be found.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => router.push('/aptitude/quantitative')}
            >
              Back to Topics
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = mergedTopicInfo.questions[session.currentQuestion];

  const handleStartPractice = () => {
    setMode('practice');
    setSession({
      currentQuestion: 0,
      answers: [],
      score: 0,
      isComplete: false
    });
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer || hasAnswered) {return;}

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const newAnswers = [...session.answers, {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    }];

    setSession({
      ...session,
      answers: newAnswers,
      score: session.score + (isCorrect ? 1 : 0)
    });

    setHasAnswered(true);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = session.currentQuestion + 1;
    
    if (nextQuestionIndex >= mergedTopicInfo.questions.length) {
      // Session complete
      setSession({
        ...session,
        isComplete: true
      });
      setMode('result');
    } else {
      setSession({
        ...session,
        currentQuestion: nextQuestionIndex
      });
    }
    
    setSelectedAnswer('');
    setShowExplanation(false);
    setHasAnswered(false);
  };

  const getPerformanceMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) {return { message: "Excellent! Outstanding performance!", color: "text-green-600" };}
    if (percentage >= 60) {return { message: "Good work! Keep practicing!", color: "text-blue-600" };}
    if (percentage >= 40) {return { message: "Not bad! Room for improvement.", color: "text-yellow-600" };}
    
return { message: "Keep practicing! You'll improve.", color: "text-red-600" };
  };

  const getStrengthsAndWeaknesses = () => {
    const total = session.answers.length;
    const correct = session.score;
    const accuracy = (correct / total) * 100;

    const strengths = [];
    const weaknesses = [];

    if (accuracy >= 70) {
      strengths.push("Good grasp of basic concepts");
      strengths.push("Consistent problem-solving approach");
    } else {
      weaknesses.push("Need to review fundamental concepts");
      weaknesses.push("Practice more solved examples");
    }

    if (accuracy >= 50) {
      strengths.push("Decent formula application");
    } else {
      weaknesses.push("Focus on memorizing key formulas");
      weaknesses.push("Work on calculation speed and accuracy");
    }

    return { strengths, weaknesses };
  };

  // Topic Introduction Mode
  if (mode === 'intro') {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => router.push('/aptitude/quantitative')}
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div>
            <h1 className="text-3xl font-bold text-gray-900">{mergedTopicInfo.name}</h1>
            <p className="text-gray-600 mt-1">{mergedTopicInfo.description}</p>
            </div>
          </div>

          {/* Topic Introduction */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                What is {mergedTopicInfo.name}?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{mergedTopicInfo.introduction}</p>
            </CardContent>
          </Card>

          {/* Importance */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Why is it Important?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{mergedTopicInfo.importance}</p>
            </CardContent>
          </Card>

          {/* Important Formulas */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                Important Formulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mergedTopicInfo.formulas.map((formula, index) => (
                  <div key={`formula-${index}`} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <code className="text-blue-800 font-mono text-sm">{formula}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shortcuts & Tricks */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-green-600" />
                Shortcuts & Tricks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mergedTopicInfo.shortcuts.map((shortcut, index) => (
                  <li key={`shortcut-${index}`} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">{shortcut}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {mergedTopicInfo.commonMistakes.map((mistake, index) => (
                  <li key={`mistake-${index}`} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-gray-700">{mistake}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Start Practice Button */}
          <div className="text-center">
            <button
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition-colors"
              onClick={handleStartPractice}
            >
              <Play className="h-5 w-5" />
              Start Practice Questions ({mergedTopicInfo.questions.length} Questions)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Practice Mode
  if (mode === 'practice') {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Progress Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMode('intro')}
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </button>
              <div className="text-center">
                <h1 className="text-xl font-semibold">{mergedTopicInfo.name} Practice</h1>
                <p className="text-sm text-gray-600">
                  Question {session.currentQuestion + 1} of {mergedTopicInfo.questions.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Score</p>
                <p className="text-lg font-semibold">{session.score}/{session.currentQuestion + (hasAnswered ? 1 : 0)}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((session.currentQuestion + (hasAnswered ? 1 : 0)) / mergedTopicInfo.questions.length) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Q{session.currentQuestion + 1}. {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <button
                    key={key}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === key
                        ? hasAnswered
                          ? key === currentQuestion.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                        : hasAnswered && key === currentQuestion.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={hasAnswered}
                    onClick={() => !hasAnswered && setSelectedAnswer(key)}
                  >
                    <span className="font-medium mr-3">{key}.</span>
                    {value}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              {showExplanation && (
                <div className={`mt-6 p-4 rounded-lg ${
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-semibold">
                      {selectedAnswer === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!'}
                    </span>
                  </div>
                  {selectedAnswer !== currentQuestion.correctAnswer && (
                    <p className="text-sm text-gray-700 mb-2">
                      The correct answer is: <strong>{currentQuestion.correctAnswer}</strong>
                    </p>
                  )}
                  <p className="text-sm text-gray-700">{currentQuestion.explanation}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex justify-between">
                {!hasAnswered ? (
                  <button
                    disabled={!selectedAnswer}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    onClick={handleAnswerSubmit}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    onClick={handleNextQuestion}
                  >
                    {session.currentQuestion + 1 >= mergedTopicInfo.questions.length ? 'View Results' : 'Next Question'}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Results Mode
  if (mode === 'result') {
    const { strengths, weaknesses } = getStrengthsAndWeaknesses();
    const performanceMsg = getPerformanceMessage(session.score, session.answers.length);
    const accuracy = Math.round((session.score / session.answers.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Complete!</h1>
            <p className="text-gray-600">{mergedTopicInfo.name} - Performance Report</p>
          </div>

          {/* Score Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <div className="text-6xl font-bold text-blue-600">{session.score}</div>
                <div className="text-2xl text-gray-600">out of {session.answers.length}</div>
                <div className="text-xl font-semibold text-blue-600 mt-2">{accuracy}% Accuracy</div>
              </div>
              <p className={`text-lg font-medium ${performanceMsg.color}`}>
                {performanceMsg.message}
              </p>
            </CardContent>
          </Card>

          {/* Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strengths.length > 0 ? (
                  <ul className="space-y-2">
                      {strengths.map((strength, index) => (
                        <li key={`strength-${index}`} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">•</span>
                          <span className="text-gray-700">{strength}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Keep practicing to build your strengths!</p>
                )}
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                      {weaknesses.map((weakness, index) => (
                        <li key={`weakness-${index}`} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">•</span>
                          <span className="text-gray-700">{weakness}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Great job! No major areas of concern.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accuracy < 50 && (
                  <p className="text-gray-700">• Review the basic formulas and concepts for {mergedTopicInfo.name}</p>
                )}
                {accuracy < 70 && (
                  <p className="text-gray-700">• Practice more problems of similar difficulty level</p>
                )}
                <p className="text-gray-700">• Focus on the shortcuts and tricks mentioned in the topic introduction</p>
                <p className="text-gray-700">• Try to solve problems with different approaches to improve understanding</p>
                {accuracy >= 70 && (
                  <p className="text-gray-700">• Move on to the next topic or try advanced problems</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              onClick={() => {
                setMode('practice');
                setSession({
                  currentQuestion: 0,
                  answers: [],
                  score: 0,
                  isComplete: false
                });
                setSelectedAnswer('');
                setShowExplanation(false);
                setHasAnswered(false);
              }}
            >
              Practice Again
            </button>
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              onClick={() => setMode('intro')}
            >
              Review Topic
            </button>
            <button
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              onClick={() => router.push('/aptitude/quantitative')}
            >
              Back to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
