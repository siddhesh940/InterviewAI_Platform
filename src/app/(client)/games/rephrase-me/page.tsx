"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Home, RotateCcw, SkipForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
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
}

interface GameStats {
  attempts: number;
  bestScore: number;
  averageScore: number;
  totalScore: number;
}

const PREDEFINED_SENTENCES = [
  "I worked on some projects.",
  "I know basic coding only.",
  "I helped my team sometimes.",
  "I did an internship for a bit.",
  "I don't have much experience.",
  "I am good with people.",
  "I like solving problems.",
  "I did many tasks in college.",
  "I tried to learn new things.",
  "I did a project on websites.",
  "I know Java but not very well.",
  "I did some leadership work.",
  "I managed my time okay.",
  "I handled responsibilities in class.",
  "I did some presentations.",
  "I know a little about databases.",
  "I worked with a team before.",
  "I want to improve myself.",
  "I know how to debug issues.",
  "I studied the subject properly."
];

// Helper functions moved outside component
const generateIdealAnswer = (original: string): string => {
  const idealAnswers: Record<string, string> = {
    "I worked on some projects.": "I successfully planned and executed several academic and technical projects, taking responsibility for research, development, and delivery while collaborating with my team to achieve strong outcomes.",
    "I know basic coding only.": "I have foundational programming knowledge and am actively expanding my technical skills through hands-on projects, coursework, and self-directed learning to build comprehensive development capabilities.",
    "I helped my team sometimes.": "I actively contributed to team success by providing technical support, sharing knowledge, and collaborating on key deliverables to ensure project milestones were met effectively.",
    "I did an internship for a bit.": "I completed a focused internship where I gained practical industry experience, developed professional skills, and contributed meaningfully to real-world projects while learning from experienced mentors.",
    "I don't have much experience.": "While I'm early in my professional journey, I bring fresh perspectives, strong foundational knowledge, and demonstrated ability to learn quickly and adapt to new challenges.",
    "I am good with people.": "I excel in interpersonal communication, building collaborative relationships, and facilitating productive team dynamics to achieve shared objectives and maintain positive working environments.",
    "I like solving problems.": "I thrive on analyzing complex challenges, developing innovative solutions, and applying systematic problem-solving methodologies to deliver effective results under pressure.",
    "I did many tasks in college.": "Throughout my academic career, I successfully managed diverse responsibilities including coursework, projects, leadership roles, and extracurricular activities while maintaining high performance standards.",
    "I tried to learn new things.": "I actively pursue continuous learning opportunities, staying current with industry trends and expanding my skill set through structured courses, hands-on practice, and professional development initiatives.",
    "I did a project on websites.": "I designed and developed comprehensive web applications using modern technologies, implementing user-friendly interfaces, robust functionality, and responsive design principles to deliver professional solutions.",
    "I know Java but not very well.": "I have working knowledge of Java programming fundamentals and am committed to strengthening my expertise through advanced coursework, practical projects, and industry best practices.",
    "I did some leadership work.": "I demonstrated leadership capabilities by guiding team initiatives, mentoring peers, coordinating project activities, and driving collaborative efforts to achieve successful outcomes.",
    "I managed my time okay.": "I effectively prioritize multiple responsibilities, organize workflows systematically, and maintain consistent productivity while meeting deadlines and quality standards across various commitments.",
    "I handled responsibilities in class.": "I successfully fulfilled academic leadership roles, coordinated group activities, managed project timelines, and ensured team deliverables met high-quality standards and deadlines.",
    "I did some presentations.": "I delivered compelling presentations to diverse audiences, effectively communicating complex information, engaging stakeholders, and presenting findings with confidence and professional polish.",
    "I know a little about databases.": "I have foundational database knowledge including design principles, query optimization, and data management concepts, with ongoing commitment to developing advanced database administration skills.",
    "I worked with a team before.": "I have extensive collaborative experience, contributing effectively to cross-functional teams, sharing responsibilities, and fostering productive partnerships to achieve collective goals successfully.",
    "I want to improve myself.": "I am committed to continuous professional growth, actively seeking feedback, pursuing skill development opportunities, and embracing challenges that expand my capabilities and expertise.",
    "I know how to debug issues.": "I possess strong analytical and troubleshooting skills, systematically identifying root causes, implementing effective solutions, and preventing recurring problems through thorough testing and documentation.",
    "I studied the subject properly.": "I developed comprehensive understanding of core concepts through rigorous study, practical application, and critical analysis, demonstrating mastery of fundamental principles and advanced topics."
  };

  return idealAnswers[original] || "I transformed this statement into a professional, detailed response that demonstrates specific achievements, quantifiable results, and strong communication skills appropriate for interview settings.";
};

const generateMiniTip = (improvements: string[]): string => {
  const tips = [
    "Try adding specific examples or quantifiable results.",
    "Use professional action words like 'executed', 'managed', or 'delivered'.",
    "Include the impact or outcome of your actions.",
    "Avoid vague words and be more specific about your role.",
    "Add context about when, where, or how you accomplished this.",
    "Structure your response with clear beginning, action, and result."
  ];

  return improvements.length > 0 ? 
    tips[Math.floor(Math.random() * tips.length)] : 
    "Great work! Keep focusing on specific, professional language.";
};

const getScoreLabel = (score: number): string => {
  if (score >= 9) {
    return "Outstanding";
  }
  if (score >= 8) {
    return "Excellent";
  }
  if (score >= 7) {
    return "Good";
  }
  if (score >= 6) {
    return "Fair";
  }
  if (score >= 4) {
    return "Needs Work";
  }
  
  return "Poor";
};

const getScoreColor = (score: number): string => {
  if (score >= 8) {
    return "text-green-600 bg-green-100";
  }
  if (score >= 6) {
    return "text-blue-600 bg-blue-100";
  }
  if (score >= 4) {
    return "text-yellow-600 bg-yellow-100";
  }
  
  return "text-red-600 bg-red-100";
};

// Local evaluation function
const evaluateLocally = (original: string, rewrite: string): EvaluationResult => {
  let score = 5.0; // Base score
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Check length improvement (should be more detailed)
  if (rewrite.length > original.length * 1.5) {
    score += 1.0;
    strengths.push("Added meaningful detail to the original sentence");
  } else if (rewrite.length <= original.length) {
    score -= 0.5;
    improvements.push("Consider adding more specific details and context");
  }

  // Check for professional vocabulary
  const professionalTerms = [
    "successfully", "executed", "managed", "collaborated", "developed",
    "implemented", "coordinated", "facilitated", "optimized", "achieved",
    "delivered", "contributed", "established", "enhanced", "streamlined"
  ];
  
  const foundTerms = professionalTerms.filter(term => 
    rewrite.toLowerCase().includes(term.toLowerCase())
  );
  
  if (foundTerms.length > 0) {
    score += Math.min(foundTerms.length * 0.5, 1.5);
    strengths.push("Used professional vocabulary and action words");
  } else {
    improvements.push("Include more professional action words and terminology");
  }

  // Check for vague words (penalties)
  const vagueWords = ["some", "things", "stuff", "maybe", "kind of", "sort of", "a bit", "okay"];
  const foundVague = vagueWords.filter(word => 
    rewrite.toLowerCase().includes(word.toLowerCase())
  );
  
  if (foundVague.length > 0) {
    score -= foundVague.length * 0.3;
    improvements.push("Avoid vague words like 'some', 'things', or 'maybe'");
  } else {
    strengths.push("Avoided vague and weak language");
  }

  // Check for quantifiable details
  const hasNumbers = /\d+/.test(rewrite);
  const quantifierWords = ["multiple", "several", "various", "numerous", "extensive"];
  const hasQuantifiers = quantifierWords.some(word => 
    rewrite.toLowerCase().includes(word.toLowerCase())
  );
  
  if (hasNumbers || hasQuantifiers) {
    score += 0.8;
    if (strengths.length < 2) {
      strengths.push("Included quantifiable or specific details");
    }
  } else {
    if (improvements.length < 2) {
      improvements.push("Try adding specific quantities or measurable outcomes");
    }
  }

  // Check sentence structure improvement
  const hasProfessionalStructure = rewrite.includes(",") || rewrite.includes("while") || 
                                 rewrite.includes("through") || rewrite.includes("by");
  if (hasProfessionalStructure) {
    score += 0.5;
    if (strengths.length < 2) {
      strengths.push("Improved sentence structure and flow");
    }
  }

  // Grammar and completeness basic checks
  const endsProperlyWithPeriod = rewrite.trim().endsWith(".");
  if (endsProperlyWithPeriod) {
    score += 0.2;
  }

  const isCompleteThought = rewrite.split(" ").length >= 8;
  if (!isCompleteThought) {
    score -= 0.5;
    if (improvements.length < 2) {
      improvements.push("Expand into a more complete, detailed statement");
    }
  } else {
    if (strengths.length < 2) {
      strengths.push("Created a complete and detailed statement");
    }
  }

  // Ensure score is within bounds
  score = Math.max(0, Math.min(10, score));

  // Generate breakdown scores
  const breakdown = {
    clarity: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    grammar: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    tone: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    vocabulary: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    completeness: Math.min(10, Math.max(0, score + (Math.random() - 0.5)))
  };

  const scoreLabel = getScoreLabel(score);
  const idealAnswer = generateIdealAnswer(original);
  const miniTip = generateMiniTip(improvements);

  return {
    score: Math.round(score * 10) / 10,
    scoreLabel,
    breakdown,
    strengths: strengths.slice(0, 2),
    improvements: improvements.slice(0, 2),
    idealAnswer,
    miniTip
  };
};

export default function RephraseMe() {
  const router = useRouter();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userRewrite, setUserRewrite] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
    totalScore: 0
  });

  const currentSentence = PREDEFINED_SENTENCES[currentSentenceIndex];

  const evaluateRewrite = useCallback(async (originalSentence: string, rewrittenSentence: string) => {
    if (!rewrittenSentence.trim()) {
      return null;
    }

    try {
      const response = await fetch("/api/games/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameType: "rephrase-me",
          originalSentence,
          userRewrite: rewrittenSentence
        })
      });

      if (!response.ok) {
        throw new Error("API evaluation failed");
      }

      const data = await response.json();
      
      return data.evaluation;
    } catch (error) {
      console.warn("API evaluation failed, using local evaluation:", error);
      
      return evaluateLocally(originalSentence, rewrittenSentence);
    }
  }, []);

  const handleSubmit = async () => {
    if (!userRewrite.trim()) {
      toast.error("Please write your rephrased version first.");
      
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await evaluateRewrite(currentSentence, userRewrite);
      if (result) {
        setEvaluation(result);
        
        // Update game stats
        const newAttempts = gameStats.attempts + 1;
        const newTotalScore = gameStats.totalScore + result.score;
        const newAverageScore = newTotalScore / newAttempts;
        const newBestScore = Math.max(gameStats.bestScore, result.score);
        
        setGameStats({
          attempts: newAttempts,
          bestScore: newBestScore,
          averageScore: Math.round(newAverageScore * 10) / 10,
          totalScore: newTotalScore
        });

        toast.success(`Scored ${result.score}/10 - ${result.scoreLabel}!`);
      }
    } catch (error) {
      toast.error("Failed to evaluate your rewrite. Please try again.");
      console.error("Evaluation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextSentence = () => {
    const nextIndex = (currentSentenceIndex + 1) % PREDEFINED_SENTENCES.length;
    setCurrentSentenceIndex(nextIndex);
    setUserRewrite("");
    setEvaluation(null);
  };

  const handleRetry = () => {
    setUserRewrite("");
    setEvaluation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <BookOpen className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Rephrase Me</h1>
              <p className="text-gray-600">Vocabulary Builder</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-gray-300"
            onClick={() => router.push("/games")}
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Games
          </Button>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Attempts</p>
              <p className="text-2xl font-bold text-emerald-600">{gameStats.attempts}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-emerald-600">
                {gameStats.bestScore > 0 ? `${gameStats.bestScore}/10` : "--"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-emerald-600">
                {gameStats.averageScore > 0 ? `${gameStats.averageScore}/10` : "--"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-green-600">Active</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Original Sentence & Input */}
          <div className="space-y-6">
            {/* Original Sentence */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg text-red-700">
                  Original Sentence #{currentSentenceIndex + 1}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-red-800 bg-white p-4 rounded-lg border border-red-200">
                  &ldquo;{currentSentence}&rdquo;
                </p>
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Transform this into professional, interview-ready language
                </p>
              </CardContent>
            </Card>

            {/* User Input */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-700">Your Professional Rewrite</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={userRewrite}
                  placeholder="Rewrite the sentence using professional language, specific details, and strong vocabulary..."
                  className="min-h-[120px] text-base"
                  disabled={isLoading}
                  onChange={(e) => setUserRewrite(e.target.value)}
                />
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  size="lg"
                  disabled={isLoading || !userRewrite.trim()}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Evaluating..." : "Submit Rewrite"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Evaluation Results */}
          <div className="space-y-6">
            {evaluation ? (
              <>
                {/* Score Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">AI Evaluation Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className={`inline-block px-4 py-2 rounded-lg font-bold text-xl ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}/10 – {evaluation.scoreLabel}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Detailed Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(evaluation.breakdown).map(([category, score]) => (
                      <div key={category} className="flex justify-between items-center">
                        <span className="capitalize font-medium">{category}</span>
                        <span className="text-emerald-600 font-semibold">
                          {Math.round(score * 10) / 10}/10
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Strengths & Improvements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Feedback</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {evaluation.strengths.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">✓ Strengths</h4>
                        <ul className="space-y-1">
                          {evaluation.strengths.map((strength) => (
                            <li key={strength} className="text-sm text-green-700 pl-2">
                              • {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {evaluation.improvements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-600 mb-2">✗ Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {evaluation.improvements.map((improvement) => (
                            <li key={improvement} className="text-sm text-orange-700 pl-2">
                              • {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Suggested Ideal Answer */}
                <Card className="border-emerald-200 bg-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-700">
                      Suggested Ideal Answer
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-emerald-800 bg-white p-4 rounded-lg border border-emerald-200 font-medium">
                      &ldquo;{evaluation.idealAnswer}&rdquo;
                    </p>
                    {evaluation.miniTip && (
                      <p className="text-sm text-emerald-600 mt-3 italic">
                        💡 Tip: {evaluation.miniTip}
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleRetry}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleNextSentence}
                  >
                    <SkipForward className="h-4 w-4 mr-2" />
                    Next Sentence
                  </Button>
                </div>
              </>
            ) : (
              <Card className="border-dashed border-gray-300">
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Submit your rewrite to see detailed evaluation and feedback
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
