"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { DifficultyLevel, useGames } from "@/contexts/GamesContext";
import {
    difficultyColors,
    difficultyLabels,
    getFilteredQuestions,
    getRandomQuestion,
    rephraseSentences
} from "@/data/games-data";
import {
    Award,
    BookOpen,
    Brain,
    Edit3,
    FileText,
    Home,
    Lightbulb,
    MessageSquare,
    RotateCcw,
    SkipForward,
    Sparkles,
    Target,
    TrendingUp,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface EvaluationResult {
  score: number;
  scoreLabel: string;
  breakdown: {
    clarity: number;
    grammar: number;
    tone: number;
    vocabulary: number;
    completeness: number;
  };
  strengths: string[];
  improvements: string[];
  idealAnswer: string;
  miniTip: string;
  recruiterPerspective?: string;
  prepFramework?: string;
}

export default function RephraseMeGame() {
  const router = useRouter();
  const { 
    selectedDifficulty, 
    setDifficulty, 
    recordAttempt, 
    gameProgress, 
    calculateXp,
    getDifficultyMultiplier 
  } = useGames();
  
  const progress = gameProgress['rephrase-me'];
  
  const [currentSentence, setCurrentSentence] = useState<typeof rephraseSentences[0] | null>(null);
  const [userRewrite, setUserRewrite] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [usedSentenceIds, setUsedSentenceIds] = useState<string[]>([]);
  const [sentenceNumber, setSentenceNumber] = useState(1);

  // Initialize with a sentence
  useEffect(() => {
    selectNewSentence();
  }, []);

  const selectNewSentence = useCallback(() => {
    const filtered = getFilteredQuestions(rephraseSentences, selectedDifficulty);
    const sentence = getRandomQuestion(filtered, usedSentenceIds);
    
    if (sentence) {
      setCurrentSentence(sentence);
      setUsedSentenceIds(prev => [...prev, sentence.id].slice(-5));
    } else {
      const anySentence = getRandomQuestion(filtered, []);
      setCurrentSentence(anySentence);
      setUsedSentenceIds([anySentence?.id || '']);
    }
    
    setUserRewrite("");
    setEvaluation(null);
    setShowResults(false);
    setSentenceNumber(prev => prev + 1);
  }, [selectedDifficulty, usedSentenceIds]);

  // Handle difficulty change
  const handleDifficultyChange = (diff: DifficultyLevel) => {
    setDifficulty(diff);
    setUsedSentenceIds([]);
    const filtered = getFilteredQuestions(rephraseSentences, diff);
    const sentence = getRandomQuestion(filtered, []);
    setCurrentSentence(sentence);
    setUserRewrite("");
    setEvaluation(null);
    setShowResults(false);
  };

  // Local evaluation function
  const evaluateRewrite = useCallback((original: string, rewrite: string): EvaluationResult => {
    let score = 5.0;
    const strengths: string[] = [];
    const improvements: string[] = [];

    // Length improvement
    if (rewrite.length > original.length * 1.5) {
      score += 1.0;
      strengths.push("Added meaningful detail to the original sentence");
    } else if (rewrite.length <= original.length) {
      score -= 0.5;
      improvements.push("Consider adding more specific details and context");
    }

    // Professional vocabulary check
    const professionalTerms = [
      'implemented', 'developed', 'managed', 'led', 'coordinated', 'achieved',
      'delivered', 'executed', 'established', 'enhanced', 'optimized', 'collaborated',
      'demonstrated', 'spearheaded', 'facilitated', 'analyzed', 'designed', 'created',
      'successfully', 'effectively', 'efficiently', 'professional', 'expertise'
    ];

    const lowerRewrite = rewrite.toLowerCase();
    const professionalCount = professionalTerms.filter(term => lowerRewrite.includes(term)).length;
    
    if (professionalCount >= 3) {
      score += 1.5;
      strengths.push("Excellent use of professional vocabulary");
    } else if (professionalCount >= 1) {
      score += 0.5;
      strengths.push("Good incorporation of professional terms");
    } else {
      improvements.push("Include more professional action words and terminology");
    }

    // Vague words check
    const vagueWords = ['some', 'things', 'stuff', 'good', 'nice', 'okay', 'bit', 'maybe', 'try', 'just'];
    const vagueCount = vagueWords.filter(word => lowerRewrite.includes(word)).length;
    
    if (vagueCount === 0) {
      score += 0.5;
      strengths.push("Avoided vague and weak language");
    } else {
      score -= vagueCount * 0.3;
      improvements.push("Avoid vague words like 'some', 'things', 'just'");
    }

    // Structure check
    if (rewrite.includes(',') || rewrite.includes('and')) {
      score += 0.5;
    }

    // Quantifiable check
    const hasNumbers = /\d+/.test(rewrite);
    const hasQuantifiers = ['several', 'multiple', 'various', 'numerous', 'significant'].some(q => lowerRewrite.includes(q));
    
    if (hasNumbers || hasQuantifiers) {
      score += 0.5;
      strengths.push("Good use of quantifiable or specific language");
    } else {
      improvements.push("Try adding specific quantities or measurable outcomes");
    }

    // Apply difficulty strictness
    const strictnessModifier = selectedDifficulty === 'advanced' ? 0.9 : selectedDifficulty === 'intermediate' ? 1.0 : 1.1;
    score = Math.min(10, Math.max(0, score * strictnessModifier));
    score = Math.round(score * 10) / 10;

    // Breakdown scores
    const breakdown = {
      clarity: Math.min(10, Math.max(1, score + (Math.random() * 1 - 0.5))),
      grammar: Math.min(10, Math.max(1, score + (Math.random() * 0.8))),
      tone: Math.min(10, Math.max(1, score + (Math.random() * 1 - 0.3))),
      vocabulary: Math.min(10, Math.max(1, professionalCount >= 2 ? score + 0.5 : score - 0.3)),
      completeness: Math.min(10, Math.max(1, rewrite.length > original.length * 1.3 ? score + 0.3 : score - 0.3)),
    };

    // Score label
    let scoreLabel = 'Poor';
    if (score >= 9) {scoreLabel = 'Outstanding';}
    else if (score >= 8) {scoreLabel = 'Excellent';}
    else if (score >= 7) {scoreLabel = 'Good';}
    else if (score >= 6) {scoreLabel = 'Fair';}
    else if (score >= 4) {scoreLabel = 'Needs Work';}

    // Mini tip
    const tips = [
      "Try adding specific examples or quantifiable results.",
      "Use professional action words like 'executed', 'managed', or 'delivered'.",
      "Include the impact or outcome of your actions.",
      "Avoid vague words and be more specific about your role.",
      "Structure your response with clear beginning, action, and result."
    ];
    const miniTip = improvements.length > 0 ? tips[Math.floor(Math.random() * tips.length)] : "Great work! Keep focusing on specific, professional language.";

    // Recruiter perspective
    let recruiterPerspective = '';
    if (score >= 8) {
      recruiterPerspective = "This response would impress recruiters - it's clear, professional, and demonstrates specific value.";
    } else if (score >= 6) {
      recruiterPerspective = "A decent response that shows potential. Adding more specifics would make it more memorable.";
    } else {
      recruiterPerspective = "This response needs refinement to stand out in competitive interviews.";
    }

    // PREP framework suggestion
    const prepFramework = score < 7 
      ? "💡 Try the PREP Method:\n• Point: State your main point\n• Reason: Explain why\n• Example: Give a specific example\n• Point: Restate your point"
      : "✨ Good structure! Consider using PREP for even more impact: Point → Reason → Example → Point.";

    return {
      score,
      scoreLabel,
      breakdown,
      strengths,
      improvements,
      idealAnswer: currentSentence?.idealRewrite || '',
      miniTip,
      recruiterPerspective,
      prepFramework,
    };
  }, [selectedDifficulty, currentSentence]);

  const handleSubmit = async () => {
    if (!userRewrite.trim() || !currentSentence) {
      toast.error("Please write your professional rewrite.");
      
return;
    }

    setIsLoading(true);

    try {
      const result = evaluateRewrite(currentSentence.original, userRewrite);
      setEvaluation(result);
      setShowResults(true);

      // Calculate XP
      const earnedXp = calculateXp(result.score, selectedDifficulty);
      setXpEarned(earnedXp);

      // Record attempt
      recordAttempt('rephrase-me', result.score, currentSentence.id, selectedDifficulty);

      // Toast
      if (result.score >= 8) {
        toast.success("🎯 Excellent professional rewrite!");
      } else if (result.score >= 6) {
        toast.success("👍 Good improvement!");
      } else {
        toast.success("💪 Keep practicing!");
      }

    } catch (error) {
      console.error("Error:", error);
      toast.error("Evaluation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) {return "text-green-600 bg-green-50";}
    if (score >= 6) {return "text-blue-600 bg-blue-50";}
    if (score >= 4) {return "text-amber-600 bg-amber-50";}
    
return "text-red-600 bg-red-50";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 w-fit"
            onClick={() => router.push('/games')}
          >
            <Home className="h-4 w-4 mr-1" />
            Back to Games
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rephrase Me</h1>
              <p className="text-sm text-gray-500">Vocabulary Builder</p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500">Attempts</p>
                  <p className="text-lg font-bold">{progress.totalAttempts}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-gray-500">Best Score</p>
                  <p className="text-lg font-bold">{progress.bestScore > 0 ? progress.bestScore.toFixed(1) : '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-xs text-gray-500">Average</p>
                  <p className="text-lg font-bold">{progress.averageScore > 0 ? progress.averageScore : '--'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs text-gray-500">Level</p>
                  <p className="text-lg font-bold">{progress.currentLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Selector */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-gray-700">Difficulty</span>
              </div>
              <div className="flex gap-2">
                {(['beginner', 'intermediate', 'advanced'] as const).map((diff) => (
                  <button
                    key={diff}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedDifficulty === diff
                        ? `${difficultyColors[diff].bg} ${difficultyColors[diff].text} border-2 ${difficultyColors[diff].border}`
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                    onClick={() => handleDifficultyChange(diff)}
                  >
                    {difficultyLabels[diff]}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Game Interface */}
        {!showResults ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Original Sentence */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-lg">
                  <span className="flex items-center gap-2 text-orange-600">
                    <MessageSquare className="h-5 w-5" />
                    Original Sentence #{sentenceNumber}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 text-lg leading-relaxed font-medium">
                    &quot;{currentSentence?.original || 'Loading...'}&quot;
                  </p>
                </div>
                <div className="mt-4 flex items-start gap-2 text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    Transform this into professional, interview-ready language
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* User Rewrite */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-emerald-600 text-lg">
                  <Edit3 className="h-5 w-5" />
                  Your Professional Rewrite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={userRewrite}
                  placeholder="Rewrite the sentence using professional, specific, and impactful language..."
                  className="min-h-[150px] border-2 focus:border-emerald-400 resize-none"
                  disabled={isLoading}
                  onChange={(e) => setUserRewrite(e.target.value)}
                />
                <div className="flex gap-2 mt-4">
                  <Button
                    disabled={isLoading || !userRewrite.trim()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleSubmit}
                  >
                    {isLoading ? 'Evaluating...' : 'Submit Rewrite'}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => setUserRewrite("")}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Results Screen */
          <div className="space-y-6">
            {/* XP Banner */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">You earned</p>
                    <div className="flex items-center gap-2">
                      <Zap className="h-8 w-8 text-yellow-300" />
                      <span className="text-4xl font-bold">+{xpEarned} XP</span>
                    </div>
                    <p className="text-sm mt-1 opacity-80">
                      {difficultyLabels[selectedDifficulty]} ({getDifficultyMultiplier(selectedDifficulty)}x)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-4 py-3 rounded-xl bg-white/20`}>
                      <p className="text-4xl font-bold">{evaluation?.score}/10</p>
                      <p className="text-sm">{evaluation?.scoreLabel}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    Detailed Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {evaluation?.breakdown && Object.entries(evaluation.breakdown).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-gray-600">{value.toFixed(1)}/10</span>
                      </div>
                      <Progress value={value * 10} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Strengths */}
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">✓ Strengths</p>
                    <ul className="space-y-1">
                      {evaluation?.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-700">• {s}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div>
                    <p className="text-sm font-medium text-amber-600 mb-2">△ Areas for Improvement</p>
                    <ul className="space-y-1">
                      {evaluation?.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-gray-700">• {imp}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recruiter Perspective */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-sm font-medium text-blue-700 mb-2">👔 Recruiter Perspective</p>
                  <p className="text-gray-700">{evaluation?.recruiterPerspective}</p>
                </div>
              </CardContent>
            </Card>

            {/* PREP Framework */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Structured Suggestion (PREP Method)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-sm text-gray-700 whitespace-pre-line">{evaluation?.prepFramework}</p>
                </div>
              </CardContent>
            </Card>

            {/* Ideal Answer */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Suggested Ideal Answer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed">
                    {evaluation?.idealAnswer || currentSentence?.idealRewrite}
                  </p>
                </div>
                {currentSentence?.keyImprovements && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentSentence.keyImprovements.map((imp, i) => (
                      <Badge key={i} variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
                        {imp}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mini Tip */}
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-sm text-indigo-700 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                <strong>Tip:</strong> {evaluation?.miniTip}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={selectNewSentence}
              >
                Next Sentence
                <SkipForward className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setUserRewrite("");
                  setEvaluation(null);
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
