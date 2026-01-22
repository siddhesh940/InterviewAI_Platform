"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Clock,
    Flame,
    Trophy,
    XCircle,
    Zap
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  }
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
};

// Quick challenge questions - mix from all categories
const quickChallengeQuestions = [
  // Quantitative
  {
    id: 1,
    category: "Quantitative",
    question: "If 15% of a number is 45, what is the number?",
    options: ["300", "250", "200", "350"],
    correct: "300",
    explanation: "Let the number be x. 15% of x = 45 → 0.15x = 45 → x = 45/0.15 = 300"
  },
  {
    id: 2,
    category: "Quantitative",
    question: "A train 150m long passes a pole in 15 seconds. What is its speed in km/hr?",
    options: ["36 km/hr", "40 km/hr", "45 km/hr", "30 km/hr"],
    correct: "36 km/hr",
    explanation: "Speed = Distance/Time = 150/15 = 10 m/s = 10 × 18/5 = 36 km/hr"
  },
  {
    id: 3,
    category: "Quantitative",
    question: "If A:B = 2:3 and B:C = 4:5, then A:B:C is?",
    options: ["8:12:15", "2:3:5", "4:6:5", "8:12:10"],
    correct: "8:12:15",
    explanation: "A:B = 2:3 = 8:12, B:C = 4:5 = 12:15 → A:B:C = 8:12:15"
  },
  {
    id: 4,
    category: "Quantitative", 
    question: "What is the compound interest on Rs.1000 at 10% per annum for 2 years?",
    options: ["Rs.210", "Rs.200", "Rs.220", "Rs.230"],
    correct: "Rs.210",
    explanation: "CI = P(1+r/100)^n - P = 1000(1.1)² - 1000 = 1210 - 1000 = Rs.210"
  },
  {
    id: 5,
    category: "Quantitative",
    question: "The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?",
    options: ["28", "26", "30", "24"],
    correct: "28",
    explanation: "Sum of 5 numbers = 5 × 20 = 100. Sum of 4 numbers = 4 × 18 = 72. Excluded = 100 - 72 = 28"
  },
  // Logical
  {
    id: 6,
    category: "Logical",
    question: "Find the next number: 2, 6, 12, 20, 30, ?",
    options: ["42", "40", "38", "44"],
    correct: "42",
    explanation: "Pattern: differences are 4, 6, 8, 10, 12. Next difference = 12, so 30 + 12 = 42"
  },
  {
    id: 7,
    category: "Logical",
    question: "If APPLE is coded as ELPPA, how is MANGO coded?",
    options: ["OGNAM", "GNAMO", "OGANM", "NAMGO"],
    correct: "OGNAM",
    explanation: "The word is reversed. MANGO reversed = OGNAM"
  },
  {
    id: 8,
    category: "Logical",
    question: "Complete: Book is to Reading as Fork is to?",
    options: ["Eating", "Writing", "Cooking", "Drawing"],
    correct: "Eating",
    explanation: "Book is used for reading, fork is used for eating. Same relationship."
  },
  {
    id: 9,
    category: "Logical",
    question: "If 'WORK' is coded as 'ZRUN', then 'REST' is coded as?",
    options: ["UHVW", "VIWX", "TGUV", "SFTU"],
    correct: "UHVW",
    explanation: "Each letter moves forward by 3 positions. R→U, E→H, S→V, T→W"
  },
  {
    id: 10,
    category: "Logical",
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then how is A related to D?",
    options: ["Granddaughter", "Daughter", "Grandmother", "Grandfather"],
    correct: "Granddaughter",
    explanation: "D is C's father, C is A's mother, so D is A's grandfather. A is D's granddaughter."
  },
  // Verbal
  {
    id: 11,
    category: "Verbal",
    question: "Choose the correct synonym for 'ELOQUENT':",
    options: ["Articulate", "Silent", "Confused", "Angry"],
    correct: "Articulate",
    explanation: "Eloquent means fluent or persuasive in speaking/writing, same as articulate."
  },
  {
    id: 12,
    category: "Verbal",
    question: "Choose the antonym for 'BENEVOLENT':",
    options: ["Malevolent", "Kind", "Generous", "Helpful"],
    correct: "Malevolent",
    explanation: "Benevolent means kind and helpful. Malevolent means having evil intentions."
  },
  {
    id: 13,
    category: "Verbal",
    question: "Fill in the blank: He _____ to the store yesterday.",
    options: ["went", "go", "goes", "going"],
    correct: "went",
    explanation: "'Yesterday' indicates past tense, so 'went' (past tense of go) is correct."
  },
  {
    id: 14,
    category: "Verbal",
    question: "Identify the correctly spelled word:",
    options: ["Accommodate", "Acommodate", "Accomodate", "Acomodate"],
    correct: "Accommodate",
    explanation: "Accommodate has double 'c' and double 'm'."
  },
  {
    id: 15,
    category: "Verbal",
    question: "Choose the word that best completes: 'The professor's lecture was so _____ that students fell asleep.'",
    options: ["Monotonous", "Exciting", "Interesting", "Engaging"],
    correct: "Monotonous",
    explanation: "Monotonous means dull and repetitive, fitting the context of students falling asleep."
  }
];

export default function QuickChallengePage() {
  const router = useRouter();
  
  const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
  const [questions, setQuestions] = useState<typeof quickChallengeQuestions>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{questionId: number; answer: string; correct: boolean; timeSpent: number}[]>([]);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [questionStartTime, setQuestionStartTime] = useState(0);

  // Shuffle and pick 5 random questions
  const initializeQuestions = useCallback(() => {
    const shuffled = [...quickChallengeQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
  }, []);

  // Start game
  const startChallenge = () => {
    initializeQuestions();
    setPhase("playing");
    setCurrentIndex(0);
    setAnswers([]);
    setTimeLeft(180);
    setQuestionStartTime(Date.now());
    setSelectedAnswer(null);
  };

  // Timer effect
  useEffect(() => {
    if (phase !== "playing") {return;}
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up - auto finish
          clearInterval(timer);
          finishChallenge();
          
return 0;
        }
        
return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const submitAnswer = () => {
    if (!selectedAnswer || phase !== "playing") {return;}
    
    const currentQ = questions[currentIndex];
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const isCorrect = selectedAnswer === currentQ.correct;

    const newAnswer = {
      questionId: currentQ.id,
      answer: selectedAnswer,
      correct: isCorrect,
      timeSpent
    };

    setAnswers(prev => [...prev, newAnswer]);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setQuestionStartTime(Date.now());
    } else {
      finishChallenge([...answers, newAnswer]);
    }
  };

  const finishChallenge = (finalAnswers = answers) => {
    setPhase("result");
    // Save to localStorage
    const history = JSON.parse(localStorage.getItem("quick-challenge-history") || "[]");
    const newResult = {
      date: new Date().toISOString(),
      score: finalAnswers.filter(a => a.correct).length,
      total: questions.length,
      timeSpent: 180 - timeLeft,
      answers: finalAnswers
    };
    localStorage.setItem("quick-challenge-history", JSON.stringify([newResult, ...history.slice(0, 9)]));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScore = () => answers.filter(a => a.correct).length;
  const getAccuracy = () => Math.round((getScore() / questions.length) * 100);

  // Intro Phase
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-amber-300/30 rounded-full"
              style={{
                left: `${10 + i * 12}%`,
                top: `${20 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-2xl mx-auto relative">
          <motion.button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: -5 }}
            onClick={() => router.push("/aptitude")}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Aptitude Arena
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="border-2 border-amber-200 overflow-hidden shadow-xl">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center relative overflow-hidden">
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
                
                <motion.div 
                  className="p-4 bg-white/20 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center relative"
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    boxShadow: [
                      '0 0 20px rgba(255,255,255,0.3)',
                      '0 0 40px rgba(255,255,255,0.5)',
                      '0 0 20px rgba(255,255,255,0.3)',
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Flame className="h-10 w-10" />
                  <motion.div
                    className="absolute -top-1 -right-1 text-xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🔥
                  </motion.div>
                </motion.div>
                <motion.h1 
                  className="text-2xl font-bold mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Quick Challenge
                </motion.h1>
                <motion.p 
                  className="text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Test your aptitude in rapid-fire mode ⚡
                </motion.p>
              </div>
              
              <CardContent className="p-6">
                <motion.div 
                  className="grid grid-cols-3 gap-4 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div animate={floatingAnimation}>
                      <Zap className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                    <p className="text-xs text-gray-600">Questions</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-2xl font-bold text-gray-900">3:00</p>
                    <p className="text-xs text-gray-600">Minutes</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <motion.div 
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Trophy className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-2xl font-bold text-gray-900">Mix</p>
                    <p className="text-xs text-gray-600">Categories</p>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">How it works:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {[
                      "5 random questions from Quant, Logic & Verbal",
                      "3 minutes total time - be quick!",
                      "Track your speed and accuracy"
                    ].map((text, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                      >
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </motion.div>
                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                <motion.button
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={startChallenge}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Flame className="h-5 w-5" />
                  </motion.div>
                  Start Challenge
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                </motion.button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Playing Phase
  if (phase === "playing" && questions.length > 0) {
    const currentQ = questions[currentIndex];
    const getCategoryColor = (cat: string) => {
      if (cat === "Quantitative") {return "bg-blue-100 text-blue-700";}
      if (cat === "Logical") {return "bg-purple-100 text-purple-700";}
      
return "bg-green-100 text-green-700";
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Timer Bar */}
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <motion.div 
                className={`flex items-center gap-2 font-mono text-lg font-bold ${timeLeft <= 30 ? "text-red-600" : "text-gray-900"}`}
                animate={timeLeft <= 30 ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <motion.div
                  animate={timeLeft <= 30 ? { rotate: [0, 10, -10, 0] } : { rotate: 360 }}
                  transition={timeLeft <= 30 ? { duration: 0.3, repeat: Infinity } : { duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Clock className={`h-5 w-5 ${timeLeft <= 30 ? "text-red-600" : ""}`} />
                </motion.div>
                {formatTime(timeLeft)}
              </motion.div>
            </div>
            <div className="relative">
              <Progress value={(currentIndex / questions.length) * 100} className="h-2" />
              <motion.div
                className="absolute top-0 left-0 h-full bg-amber-400/50 rounded-full"
                style={{ width: `${(currentIndex / questions.length) * 100}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="border-2 border-amber-200 overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  {/* Category Badge */}
                  <motion.span 
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategoryColor(currentQ.category)}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    {currentQ.category}
                  </motion.span>

              {/* Question */}
              <motion.h2 
                className="text-lg font-semibold text-gray-900 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentQ.question}
              </motion.h2>

              {/* Options */}
              <motion.div 
                className="space-y-3 mb-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={`${currentQ.id}-${option}`}
                    variants={cardVariants}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedAnswer === option
                        ? "border-amber-500 bg-amber-50 shadow-md"
                        : "border-gray-200 hover:border-amber-300 hover:bg-amber-50/50"
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    <motion.span 
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full mr-3 text-sm font-bold ${
                        selectedAnswer === option
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                      animate={selectedAnswer === option ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      {String.fromCharCode(65 + idx)}
                    </motion.span>
                    {option}
                  </motion.button>
                ))}
              </motion.div>

              {/* Submit Button */}
              <motion.button
                disabled={!selectedAnswer}
                className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  selectedAnswer
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                whileHover={selectedAnswer ? { scale: 1.02 } : {}}
                whileTap={selectedAnswer ? { scale: 0.98 } : {}}
                onClick={submitAnswer}
              >
                {currentIndex < questions.length - 1 ? (
                  <>
                    Next 
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </>
                ) : (
                  <>Finish Challenge 🏆</>
                )}
              </motion.button>
            </CardContent>
          </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Result Phase
  if (phase === "result") {
    const score = getScore();
    const accuracy = getAccuracy();
    const timeSpent = 180 - timeLeft;

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6 relative overflow-hidden">
        {/* Confetti-like celebration */}
        {accuracy >= 60 && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className={`absolute w-3 h-3 rounded-full ${
                  i % 3 === 0 ? 'bg-amber-400' : i % 3 === 1 ? 'bg-green-400' : 'bg-purple-400'
                }`}
                style={{
                  left: `${5 + i * 8}%`,
                  top: '-10%',
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, (i % 2 === 0 ? 20 : -20)],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 3 + i * 0.2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "linear",
                }}
              />
            ))}
          </div>
        )}
        
        <div className="max-w-2xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Card className="border-2 border-amber-200 overflow-hidden shadow-xl">
              <motion.div 
                className={`p-6 text-white text-center relative overflow-hidden ${
                  accuracy >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                  accuracy >= 60 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                  "bg-gradient-to-r from-red-500 to-rose-500"
                }`}
                initial={{ y: -50 }}
                animate={{ y: 0 }}
              >
                {/* Shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  <Trophy className="h-12 w-12 mx-auto mb-3" />
                </motion.div>
                <motion.h1 
                  className="text-2xl font-bold mb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Challenge Complete!
                </motion.h1>
                <motion.p 
                  className="text-white/90"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {accuracy >= 80 ? "Outstanding performance! 🎉" :
                   accuracy >= 60 ? "Good job! Keep practicing! 👍" :
                   "Keep practicing! You'll improve! 💪"}
                </motion.p>
              </motion.div>
              
              <CardContent className="p-6">
                {/* Score Summary */}
                <motion.div 
                  className="grid grid-cols-3 gap-4 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.p 
                      className="text-3xl font-bold text-green-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.5 }}
                    >
                      {score}/{questions.length}
                    </motion.p>
                    <p className="text-xs text-gray-600">✅ Correct</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.p 
                      className="text-3xl font-bold text-blue-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.6 }}
                    >
                      {accuracy}%
                    </motion.p>
                    <p className="text-xs text-gray-600">🎯 Accuracy</p>
                  </motion.div>
                  <motion.div 
                    className="text-center p-4 bg-amber-50 rounded-xl border-2 border-amber-100"
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.p 
                      className="text-3xl font-bold text-amber-600"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.7 }}
                    >
                      {formatTime(timeSpent)}
                    </motion.p>
                    <p className="text-xs text-gray-600">⏱️ Time</p>
                  </motion.div>
                </motion.div>

                {/* Question Review */}
                <motion.h3 
                  className="font-semibold text-gray-900 mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  📝 Review Answers
                </motion.h3>
                <motion.div 
                  className="space-y-3 mb-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {questions.map((q, idx) => {
                    const ans = answers[idx];
                    const isCorrect = ans?.correct;
                    
                    return (
                      <motion.div 
                        key={q.id} 
                        className={`p-4 rounded-xl border-2 ${isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <div className="flex items-start gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", delay: 0.9 + idx * 0.1 }}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 mb-1">{q.question}</p>
                            {!isCorrect && (
                              <p className="text-xs text-gray-600">
                                <span className="text-red-600">Your answer: {ans?.answer}</span>
                                <span className="mx-2">•</span>
                                <span className="text-green-600">Correct: {q.correct}</span>
                              </p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">{q.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <motion.button
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.3)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startChallenge}
                  >
                    🔄 Try Again
                  </motion.button>
                  <motion.button
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/aptitude")}
                  >
                    ← Back to Arena
                  </motion.button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}
