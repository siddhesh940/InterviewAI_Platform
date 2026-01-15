
import { NextResponse } from "next/server";

interface EvaluationRequest {
  gameType?: string;
  badAnswer?: string;
  userAnswer?: string;
  originalSentence?: string;
  userRewrite?: string;
  keywords?: string[];
  topic?: string;
}

interface GameScore {
  clarity: number;
  grammar: number;
  professionalTone: number;
  relevance: number;
  completeness: number;
  finalScore: number;
  strengths: string[];
  weaknesses: string[];
  idealAnswer: string;
}

// Generate contextual ideal answers based on the bad answer content
function generateIdealAnswer(badAnswer: string): string {
  const badAnswerLower = badAnswer.toLowerCase();
  
  // Knowledge/experience related
  if (badAnswerLower.includes("don't know") || badAnswerLower.includes("basics only") || badAnswerLower.includes("not sure what skills")) {
    return "I have a solid foundation in the core fundamentals, and I've been actively expanding my knowledge through hands-on projects and continuous learning. For example, I recently completed several practical exercises that helped me apply theoretical concepts to real-world scenarios. I'm confident in my current abilities and excited to further develop my expertise in this role.";
  }
  
  // Team work issues
  if (badAnswerLower.includes("not great at teamwork") || badAnswerLower.includes("prefer being alone") || badAnswerLower.includes("don't take initiative")) {
    return "I work very effectively in team environments and believe collaboration leads to the best outcomes. I've successfully contributed to several group projects where I took initiative to coordinate tasks, share ideas, and support team members. I find that different perspectives enhance creativity and problem-solving, and I'm always eager to contribute my skills while learning from others.";
  }
  
  // Communication issues
  if (badAnswerLower.includes("communication isn't good") || badAnswerLower.includes("didn't understand the question")) {
    return "I pride myself on clear and effective communication. I make sure to actively listen, ask clarifying questions when needed, and express my ideas in a structured way that others can easily understand. I've developed these skills through presentations, team collaborations, and client interactions, and I'm always looking for ways to improve my communication to better serve team goals.";
  }
  
  // Motivation/interest issues
  if (badAnswerLower.includes("not sure why I applied") || badAnswerLower.includes("just trying things") || badAnswerLower.includes("get bored easily")) {
    return "I'm genuinely excited about this opportunity because it aligns perfectly with my career goals and interests. I've researched your company and this role extensively, and I'm particularly drawn to the challenges and growth opportunities it offers. My passion for this field drives me to continuously learn and excel, and I'm committed to making meaningful contributions to your team's success.";
  }
  
  // Pressure/deadline issues
  if (badAnswerLower.includes("don't handle pressure") || badAnswerLower.includes("don't like deadlines") || badAnswerLower.includes("get stressed")) {
    return "I work very effectively under pressure and have developed strong time management skills to meet deadlines consistently. I use prioritization techniques and break complex tasks into manageable steps to maintain quality while staying on schedule. In my previous projects, I've successfully delivered results even in challenging timeframes, and I actually find that structured deadlines help me stay focused and motivated.";
  }
  
  // Leadership issues
  if (badAnswerLower.includes("don't have leadership") || badAnswerLower.includes("only work well when tasks are simple") || badAnswerLower.includes("work only when someone pushes")) {
    return "I demonstrate strong leadership qualities through taking ownership of my work and inspiring others through example. I'm proactive in identifying opportunities for improvement and take initiative to drive projects forward. I excel at both leading teams and being a reliable team member, adapting my approach based on what the situation requires to achieve the best outcomes.";
  }
  
  // Learning/preparation issues
  if (badAnswerLower.includes("didn't practice") || badAnswerLower.includes("learned from youtube") || badAnswerLower.includes("not perfect")) {
    return "I've invested significant time in developing my skills through a combination of formal learning, practical projects, and continuous self-improvement. While I learned many concepts through online resources, I've reinforced this knowledge through hands-on application and real projects. I believe in continuous learning and regularly seek out new challenges to expand my capabilities and stay current with industry best practices.";
  }
  
  // Problem-solving issues
  if (badAnswerLower.includes("average at problem-solving") || badAnswerLower.includes("just tried something")) {
    return "I have strong analytical and problem-solving abilities that I've developed through tackling complex challenges in my studies and projects. I approach problems methodically by breaking them down into components, researching solutions, and testing different approaches until I find the most effective one. I enjoy the process of finding creative solutions and have successfully resolved several challenging technical and conceptual issues in my previous work.";
  }
  
  // Job fit issues
  if (badAnswerLower.includes("don't think I'm the best") || badAnswerLower.includes("not the best for this job")) {
    return "I'm confident that my skills, experience, and enthusiasm make me an excellent fit for this position. I've carefully evaluated the requirements and believe my background in relevant areas, combined with my strong work ethic and eagerness to contribute, will allow me to excel in this role. I'm excited about the opportunity to bring my unique perspective and capabilities to help your team achieve its objectives.";
  }
  
  // Default comprehensive answer for other scenarios
  return "I bring a strong combination of technical skills, professional experience, and genuine enthusiasm to this role. I've developed my capabilities through dedicated learning and practical application, including specific projects where I successfully applied key concepts and delivered measurable results. I'm excited about the opportunity to contribute to your team's success while continuing to grow professionally in this dynamic field.";
}

// Local evaluation function for fallback
function evaluateLocally(badAnswer: string, userAnswer: string): GameScore {
  const userAnswerLower = userAnswer.toLowerCase();
  const badAnswerLower = badAnswer.toLowerCase();
  
  // Basic scoring criteria
  let clarity = 5.0;
  let grammar = 5.0;
  let professionalTone = 5.0;
  let relevance = 5.0;
  let completeness = 5.0;
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Clarity evaluation
  if (userAnswer.length > 100) {clarity += 1.5;}
  if (userAnswer.length > 200) {clarity += 1.0;}
  if (userAnswerLower.includes("specifically") || userAnswerLower.includes("example")) {clarity += 1.0;}
  if (userAnswer.split(".").length > 3) {clarity += 0.5;}
  
  // Grammar evaluation  
  if (userAnswer.charAt(0) === userAnswer.charAt(0).toUpperCase()) {grammar += 1.0;}
  if (userAnswer.endsWith(".") || userAnswer.endsWith("!")) {grammar += 0.5;}
  if (!userAnswerLower.includes("i don't") && !userAnswerLower.includes("dunno")) {grammar += 1.5;}
  
  // Professional tone evaluation
  const professionalWords = ["experience", "skills", "professional", "opportunity", "contribute", "team", "goal", "achieve", "responsibility"];
  const unprofessionalWords = ["yeah", "whatever", "i guess", "maybe", "kinda", "sorta", "dunno"];
  
  professionalWords.forEach(word => {
    if (userAnswerLower.includes(word)) {professionalTone += 0.3;}
  });
  
  unprofessionalWords.forEach(word => {
    if (userAnswerLower.includes(word)) {professionalTone -= 1.0;}
  });
  
  // Relevance evaluation
  if (userAnswer.length > badAnswer.length * 1.5) {relevance += 1.5;}
  if (!userAnswerLower.includes("bored") && badAnswerLower.includes("bored")) {relevance += 1.0;}
  if (!userAnswerLower.includes("hate") && badAnswerLower.includes("hate")) {relevance += 1.0;}
  
  // Completeness evaluation
  if (userAnswer.length > 150) {completeness += 1.0;}
  if (userAnswer.length > 250) {completeness += 1.0;}
  if (userAnswerLower.includes("because") || userAnswerLower.includes("for example")) {completeness += 1.0;}
  
  // Cap scores at 10
  clarity = Math.min(10, clarity);
  grammar = Math.min(10, grammar);
  professionalTone = Math.min(10, professionalTone);
  relevance = Math.min(10, relevance);
  completeness = Math.min(10, completeness);
  
  // Generate strengths and weaknesses
  if (clarity >= 7) {strengths.push("Clear and well-structured response");}
  if (grammar >= 7) {strengths.push("Good grammar and language usage");}
  if (professionalTone >= 7) {strengths.push("Professional and confident tone");}
  if (relevance >= 7) {strengths.push("Addresses the question appropriately");}
  if (completeness >= 7) {strengths.push("Provides sufficient detail and examples");}
  
  if (clarity < 6) {weaknesses.push("Could be clearer and more structured");}
  if (grammar < 6) {weaknesses.push("Check grammar and language usage");}
  if (professionalTone < 6) {weaknesses.push("Use more professional language");}
  if (relevance < 6) {weaknesses.push("Better address the core question");}
  if (completeness < 6) {weaknesses.push("Add more specific details and examples");}
  
  // Ensure we have at least one strength and weakness
  if (strengths.length === 0) {
    strengths.push("Shows improvement over the original answer");
  }
  if (weaknesses.length === 0) {
    weaknesses.push("Consider adding more specific examples");
  }
  
  const finalScore = Math.round(((clarity + grammar + professionalTone + relevance + completeness) / 5) * 10) / 10;
  
  return {
    clarity: Math.round(clarity * 10) / 10,
    grammar: Math.round(grammar * 10) / 10,
    professionalTone: Math.round(professionalTone * 10) / 10,
    relevance: Math.round(relevance * 10) / 10,
    completeness: Math.round(completeness * 10) / 10,
    finalScore,
    strengths: strengths.slice(0, 2),
    weaknesses: weaknesses.slice(0, 2),
    idealAnswer: generateIdealAnswer(badAnswer)
  };
}

// Handle rephrase-me game evaluation
async function handleRephraseMe(originalSentence: string, userRewrite: string) {
  try {
    // Try OpenAI API first
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
      try {
        const prompt = `
You are evaluating a professional writing exercise where someone rephrased a basic sentence.

ORIGINAL: "${originalSentence}"
USER'S REWRITE: "${userRewrite}"

Evaluate the rewrite on these 5 criteria (0-10 each):
1. Clarity: Is it clear and easy to understand?
2. Grammar: Proper grammar and sentence structure?
3. Tone: Professional, confident tone suitable for interviews?
4. Vocabulary: Strong, specific vocabulary vs vague words?
5. Completeness: Detailed and substantial content?

Also provide:
- 2 specific strengths
- 2 specific areas for improvement
- A polished, interview-ready version as "idealAnswer"
- A brief tip (one sentence)

Return ONLY valid JSON:
{
  "score": [weighted average 0-10],
  "scoreLabel": ["Outstanding"|"Excellent"|"Good"|"Fair"|"Needs Work"|"Poor"],
  "breakdown": {
    "clarity": [0-10],
    "grammar": [0-10], 
    "tone": [0-10],
    "vocabulary": [0-10],
    "completeness": [0-10]
  },
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "idealAnswer": "Complete professional sentence",
  "miniTip": "One sentence tip"
}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an expert writing coach. Respond only with valid JSON."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 800
          })
        });

        if (response.ok) {
          const aiResponse = await response.json();
          const aiContent = aiResponse.choices[0]?.message?.content;
          if (aiContent) {
            try {
              const evaluation = JSON.parse(aiContent);
              if (evaluation.score && evaluation.breakdown) {
                console.log("Successfully used OpenAI API for rephrase-me evaluation");
                
return NextResponse.json({ evaluation });
              }
            } catch (parseError) {
              console.log("Error parsing AI response for rephrase-me, falling back to local");
            }
          }
        }
      } catch (apiError) {
        console.log("OpenAI API error for rephrase-me, falling back to local");
      }
    }

    // Local evaluation fallback
    const localEvaluation = evaluateRephraseLocally(originalSentence, userRewrite);
    
return NextResponse.json({ evaluation: localEvaluation });

  } catch (error) {
    console.error("Error in rephrase-me evaluation:", error);
    const fallbackEvaluation = evaluateRephraseLocally(originalSentence, userRewrite);
    
return NextResponse.json({ evaluation: fallbackEvaluation });
  }
}

// Local evaluation for rephrase-me game
function evaluateRephraseLocally(original: string, rewrite: string) {
  let score = 5.0;
  const strengths: string[] = [];
  const improvements: string[] = [];

  // Length and detail improvement
  if (rewrite.length > original.length * 1.5) {
    score += 1.0;
    strengths.push("Added meaningful detail to the original sentence");
  } else if (rewrite.length <= original.length) {
    score -= 0.5;
    improvements.push("Consider adding more specific details and context");
  }

  // Professional vocabulary
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

  // Vague words penalty
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

  // Quantifiable details
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

  // Ensure score bounds
  score = Math.max(0, Math.min(10, score));

  const breakdown = {
    clarity: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    grammar: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    tone: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    vocabulary: Math.min(10, Math.max(0, score + (Math.random() - 0.5))),
    completeness: Math.min(10, Math.max(0, score + (Math.random() - 0.5)))
  };

  const getScoreLabel = (s: number) => {
    if (s >= 9) {return "Outstanding";}
    if (s >= 8) {return "Excellent";}
    if (s >= 7) {return "Good";}
    if (s >= 6) {return "Fair";}
    if (s >= 4) {return "Needs Work";}
    
return "Poor";
  };

  const generateIdealRephrase = (orig: string) => {
    const ideals: Record<string, string> = {
      "I worked on some projects.": "I successfully planned and executed several academic and technical projects, taking responsibility for research, development, and delivery while collaborating with my team to achieve strong outcomes.",
      "I know basic coding only.": "I have foundational programming knowledge and am actively expanding my technical skills through hands-on projects, coursework, and self-directed learning to build comprehensive development capabilities.",
      "I helped my team sometimes.": "I actively contributed to team success by providing technical support, sharing knowledge, and collaborating on key deliverables to ensure project milestones were met effectively.",
      "I did an internship for a bit.": "I completed a focused internship where I gained practical industry experience, developed professional skills, and contributed meaningfully to real-world projects while learning from experienced mentors.",
      "I don't have much experience.": "While I'm early in my professional journey, I bring fresh perspectives, strong foundational knowledge, and demonstrated ability to learn quickly and adapt to new challenges."
    };
    
    
    return ideals[orig] || "I transformed this statement into a professional, detailed response that demonstrates specific achievements, quantifiable results, and strong communication skills appropriate for interview settings.";
  };

  return {
    score: Math.round(score * 10) / 10,
    scoreLabel: getScoreLabel(score),
    breakdown,
    strengths: strengths.slice(0, 2),
    improvements: improvements.slice(0, 2),
    idealAnswer: generateIdealRephrase(original),
    miniTip: "Try adding specific examples or quantifiable results for greater impact."
  };
}

// Handle fix-bad-answer game evaluation  
async function handleFixBadAnswer(badAnswer: string, userAnswer: string) {
  try {
    // Try OpenAI API first if configured properly
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== "your_openai_api_key_here") {
      try {
        // Create the evaluation prompt
        const evaluationPrompt = `
You are an expert interview coach evaluating how well a candidate has improved a poor interview answer. 

ORIGINAL BAD ANSWER: "${badAnswer}"
CANDIDATE'S IMPROVED ANSWER: "${userAnswer}"

Please evaluate the improved answer using these exact criteria with weights:
- Clarity (20%): How clear and easy to understand is the answer?
- Grammar (20%): Are there grammatical errors or language issues?
- Professional Tone (20%): Does it sound professional and confident?
- Relevance (20%): Does it address the implied question appropriately?
- Completeness (20%): Does it provide sufficient detail and substance?

For each criterion, assign a score from 0-10, then calculate the weighted final score.

Also provide:
- 2 specific strengths of the improved answer
- 2 specific areas that could be improved further
- A complete, polished interview response that demonstrates confidence, professionalism, and specific examples

IMPORTANT: The idealAnswer must be a complete, ready-to-use interview response, not a description. Write it as if you're the candidate giving a perfect answer.

Respond ONLY in this JSON format:
{
  "clarity": [score 0-10],
  "grammar": [score 0-10], 
  "professionalTone": [score 0-10],
  "relevance": [score 0-10],
  "completeness": [score 0-10],
  "finalScore": [weighted average 0-10],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"], 
  "idealAnswer": "A complete, polished interview response that shows confidence and includes specific examples"
}`;

        // Call OpenAI API
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are an expert interview coach who evaluates interview answers and provides constructive feedback. Always respond with valid JSON format."
              },
              {
                role: "user",
                content: evaluationPrompt
              }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });

        if (response.ok) {
          const aiResponse = await response.json();
          const aiContent = aiResponse.choices[0]?.message?.content;

          if (aiContent) {
            try {
              const evaluation = JSON.parse(aiContent);
              
              // Validate and ensure all required fields are present
              if (evaluation.clarity && evaluation.grammar && evaluation.professionalTone && 
                  evaluation.relevance && evaluation.completeness) {
                
                // Calculate final score if not provided or incorrect
                const weightedScore = (
                  (evaluation.clarity * 0.2) +
                  (evaluation.grammar * 0.2) +
                  (evaluation.professionalTone * 0.2) +
                  (evaluation.relevance * 0.2) +
                  (evaluation.completeness * 0.2)
                );
                
                evaluation.finalScore = Math.round(weightedScore * 10) / 10;
                
                // Ensure strengths and weaknesses are arrays
                if (!Array.isArray(evaluation.strengths)) {
                  evaluation.strengths = ["Shows improvement over the original answer", "Demonstrates effort to provide a better response"];
                }
                if (!Array.isArray(evaluation.weaknesses)) {
                  evaluation.weaknesses = ["Could be more specific and detailed", "Consider adding more professional language"];
                }
                
                // Ensure ideal answer exists
                if (!evaluation.idealAnswer) {
                  evaluation.idealAnswer = generateIdealAnswer(badAnswer);
                }

                console.log("Successfully used OpenAI API for evaluation");
                
                return NextResponse.json(evaluation);
              }
            } catch (parseError) {
              console.log("Error parsing AI response, falling back to local evaluation");
            }
          }
        } else {
          console.log("OpenAI API request failed, falling back to local evaluation");
        }
      } catch (apiError) {
        console.log("OpenAI API error, falling back to local evaluation:", apiError);
      }
    } else {
      console.log("OpenAI API key not configured, using local evaluation");
    }

    // Fallback to local evaluation
    console.log("Using local evaluation system");
    const localEvaluation = evaluateLocally(badAnswer, userAnswer);
    
    return NextResponse.json(localEvaluation);

  } catch (error) {
    console.error("Error in fix-bad-answer evaluation:", error);
    const fallbackEvaluation = evaluateLocally(badAnswer, userAnswer);
    
    return NextResponse.json(fallbackEvaluation);
  }
}

export async function POST(req: Request) {
  try {
    const requestData: EvaluationRequest = await req.json();
    const { gameType = 'fix-bad-answer' } = requestData;

    // Validate input based on game type
    if (gameType === 'rephrase-me') {
      const { originalSentence, userRewrite } = requestData;
      if (!originalSentence || !userRewrite) {
        return NextResponse.json(
          { error: "Both originalSentence and userRewrite are required for rephrase-me game" },
          { status: 400 }
        );
      }
      
return await handleRephraseMe(originalSentence, userRewrite);
    } else {
      const { badAnswer, userAnswer } = requestData;
      if (!badAnswer || !userAnswer) {
        return NextResponse.json(
          { error: "Both badAnswer and userAnswer are required" },
          { status: 400 }
        );
      }
      
return await handleFixBadAnswer(badAnswer, userAnswer);
    }


  } catch (error) {
    console.error("Error in evaluate-answer API:", error);
    
    // Last resort - try to parse request and provide basic evaluation
    try {
      const body = await req.text();
      const { badAnswer, userAnswer } = JSON.parse(body);
      
      if (badAnswer && userAnswer) {
        const fallbackEvaluation = evaluateLocally(badAnswer, userAnswer);
        
return NextResponse.json(fallbackEvaluation);
      }
    } catch (fallbackError) {
      console.error("Complete fallback failed:", fallbackError);
    }
    
    return NextResponse.json(
      { error: "Unable to evaluate answer" },
      { status: 500 }
    );
  }
}
