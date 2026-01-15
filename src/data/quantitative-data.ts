// Quantitative Aptitude Complete Database
// All questions, answers, and topic information from PDF

export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface TopicInfo {
  id: string;
  name: string;
  description: string;
  introduction: string;
  importance: string;
  formulas: string[];
  shortcuts: string[];
  commonMistakes: string[];
  questions: Question[];
}

export const quantitativeTopics: Record<string, TopicInfo> = {
  "number-system": {
    id: "number-system",
    name: "Number System",
    description: "Foundation of mathematics covering different types of numbers and their properties",
    introduction: "The Number System is the foundation of all mathematical operations. It deals with different types of numbers like natural numbers, whole numbers, integers, rational and irrational numbers. This topic is crucial for competitive exams as it appears in almost every numerical aptitude test.",
    importance: "Number system concepts are used in banking, engineering, computer science, and daily life calculations. Understanding prime numbers, factors, multiples, and divisibility rules helps in quick mental calculations and problem-solving.",
    formulas: [
      "HCF × LCM = Product of two numbers",
      "Number of factors of N = (a+1)(b+1)(c+1) where N = p^a × q^b × r^c",
      "Sum of first n natural numbers = n(n+1)/2",
      "Sum of first n odd numbers = n²",
      "Sum of first n even numbers = n(n+1)",
      "a^m × a^n = a^(m+n)",
      "a^m ÷ a^n = a^(m-n)",
      "(a^m)^n = a^(mn)"
    ],
    shortcuts: [
      "For divisibility by 9: Sum of digits should be divisible by 9",
      "For divisibility by 11: Alternate sum of digits should be 0 or divisible by 11",
      "Unit digit pattern repeats every 4 powers for most numbers",
      "Perfect squares end only in 0,1,4,5,6,9",
      "To find last two digits of powers, use cyclicity method"
    ],
    commonMistakes: [
      "Confusing HCF and LCM concepts",
      "Forgetting that 1 is neither prime nor composite",
      "Not applying divisibility rules correctly",
      "Missing the pattern in unit digits of powers",
      "Calculating factors incorrectly for composite numbers"
    ],
    questions: [
      {
        id: 1,
        question: "Which of the following is an even number?",
        options: { A: "17", B: "21", C: "42", D: "55" },
        correctAnswer: "C",
        explanation: "Even numbers are divisible by 2. Among the options, 42 ÷ 2 = 21, so 42 is even.",
        difficulty: "Easy"
      },
      {
        id: 2,
        question: "The smallest prime number is:",
        options: { A: "0", B: "1", C: "2", D: "3" },
        correctAnswer: "C",
        explanation: "2 is the smallest prime number. 1 is neither prime nor composite, and 0 is not considered in the prime number set.",
        difficulty: "Easy"
      },
      {
        id: 3,
        question: "Which among these is a composite number?",
        options: { A: "2", B: "3", C: "7", D: "9" },
        correctAnswer: "D",
        explanation: "9 = 3 × 3, so it has factors other than 1 and itself, making it composite. 2, 3, and 7 are prime numbers.",
        difficulty: "Easy"
      },
      {
        id: 4,
        question: "What is the HCF of 18 and 24?",
        options: { A: "2", B: "3", C: "6", D: "12" },
        correctAnswer: "C",
        explanation: "18 = 2 × 3² and 24 = 2³ × 3. HCF = 2¹ × 3¹ = 6",
        difficulty: "Easy"
      },
      {
        id: 5,
        question: "What is the LCM of 4 and 6?",
        options: { A: "10", B: "12", C: "14", D: "18" },
        correctAnswer: "B",
        explanation: "4 = 2² and 6 = 2 × 3. LCM = 2² × 3 = 12",
        difficulty: "Easy"
      },
      {
        id: 6,
        question: "A number divisible by 5 ends with:",
        options: { A: "1", B: "2", C: "5 or 0", D: "3" },
        correctAnswer: "C",
        explanation: "A number is divisible by 5 if and only if its last digit is 0 or 5.",
        difficulty: "Easy"
      },
      {
        id: 7,
        question: "Which is a perfect square?",
        options: { A: "20", B: "25", C: "45", D: "55" },
        correctAnswer: "B",
        explanation: "25 = 5², so 25 is a perfect square. The others are not perfect squares.",
        difficulty: "Easy"
      },
      {
        id: 8,
        question: "Which number is divisible by 9?",
        options: { A: "478", B: "729", C: "531", D: "228" },
        correctAnswer: "B",
        explanation: "A number is divisible by 9 if sum of its digits is divisible by 9. For 729: 7+2+9 = 18, which is divisible by 9.",
        difficulty: "Easy"
      },
      {
        id: 9,
        question: "2³ equals:",
        options: { A: "6", B: "8", C: "9", D: "12" },
        correctAnswer: "B",
        explanation: "2³ = 2 × 2 × 2 = 8",
        difficulty: "Easy"
      },
      {
        id: 10,
        question: "Which is an irrational number?",
        options: { A: "4", B: "5/2", C: "√7", D: "1.25" },
        correctAnswer: "C",
        explanation: "√7 cannot be expressed as a ratio of integers, making it irrational. The others can be expressed as fractions.",
        difficulty: "Medium"
      }
    ]
  },

  "percentages": {
    id: "percentages",
    name: "Percentages",
    description: "Learn to calculate percentages, percentage changes, and solve real-world percentage problems",
    introduction: "Percentages are one of the most practical mathematical concepts used in daily life. From calculating discounts and profits to understanding statistics and growth rates, percentages help us express proportions and changes in an easily understandable way.",
    importance: "Percentage calculations are essential in finance, business, statistics, and everyday shopping. They appear frequently in competitive exams and are fundamental to understanding profit-loss, simple-compound interest, and data interpretation topics.",
    formulas: [
      "Percentage = (Part/Whole) × 100",
      "Part = (Percentage × Whole) / 100",
      "Whole = (Part × 100) / Percentage", 
      "Percentage Increase = ((New Value - Old Value) / Old Value) × 100",
      "Percentage Decrease = ((Old Value - New Value) / Old Value) × 100",
      "Successive Percentage: If a% then b% → Final = (100+a)(100+b)/100 - 100",
      "Discount % = (Discount / Marked Price) × 100",
      "Profit % = (Profit / Cost Price) × 100"
    ],
    shortcuts: [
      "25% = 1/4, 50% = 1/2, 75% = 3/4",
      "33⅓% = 1/3, 66⅔% = 2/3",
      "12.5% = 1/8, 37.5% = 3/8, 62.5% = 5/8, 87.5% = 7/8",
      "20% = 1/5, 40% = 2/5, 60% = 3/5, 80% = 4/5",
      "For quick calculation: 10% of any number, move decimal one place left"
    ],
    commonMistakes: [
      "Confusing 'percent of' vs 'percent more/less than'",
      "Not identifying the base value correctly",
      "Mixing up percentage increase and decrease formulas",
      "Forgetting to convert fractions to percentages",
      "Incorrect calculation in successive percentage problems"
    ],
    questions: [
      {
        id: 1,
        question: "A man spends 35% of his income on rent and 15% on food. If he saves ₹18,000 which is 30% of his income, what is his total income?",
        options: { A: "₹48,000", B: "₹50,000", C: "₹60,000", D: "₹65,000" },
        correctAnswer: "C",
        explanation: "If savings = 30% = ₹18,000, then total income = ₹18,000 × 100/30 = ₹60,000",
        difficulty: "Medium"
      },
      {
        id: 2,
        question: "A man donated 12% of his salary to charity and still had ₹17,600 left, which was 88% of his salary. What is his total salary?",
        options: { A: "₹18,000", B: "₹19,000", C: "₹20,000", D: "₹22,000" },
        correctAnswer: "C",
        explanation: "88% of salary = ₹17,600. So salary = ₹17,600 × 100/88 = ₹20,000",
        difficulty: "Medium"
      },
      {
        id: 3,
        question: "A fruit seller sold 25% of his apples and still had 540 apples left. How many apples did he originally have?",
        options: { A: "600", B: "640", C: "700", D: "720" },
        correctAnswer: "D",
        explanation: "If 25% sold, then 75% remaining = 540. Original = 540 × 100/75 = 720 apples",
        difficulty: "Medium"
      },
      {
        id: 4,
        question: "A number increases from 750 to 900. What is the percentage increase?",
        options: { A: "15%", B: "18%", C: "20%", D: "25%" },
        correctAnswer: "C",
        explanation: "Increase = 900 - 750 = 150. Percentage increase = (150/750) × 100 = 20%",
        difficulty: "Easy"
      },
      {
        id: 5,
        question: "If 18% of A equals 27% of B, then A : B is:",
        options: { A: "2:3", B: "3:2", C: "1:1", D: "4:3" },
        correctAnswer: "B",
        explanation: "18% of A = 27% of B → 18A/100 = 27B/100 → 18A = 27B → A/B = 27/18 = 3/2",
        difficulty: "Medium"
      },
      {
        id: 6,
        question: "A student scores 540 marks out of 900. By what percent should he increase his marks to reach 75%?",
        options: { A: "10%", B: "12.5%", C: "15%", D: "20%" },
        correctAnswer: "B",
        explanation: "Current % = (540/900) × 100 = 60%. Target = 75% of 900 = 675 marks. Increase needed = 675 - 540 = 135 marks. % increase in marks = (135/540) × 100 = 25%",
        difficulty: "Medium"
      },
      {
        id: 7,
        question: "The price of sugar increases by 25%. By what percent must a man reduce consumption so that his expenditure remains constant?",
        options: { A: "15%", B: "20%", C: "25%", D: "30%" },
        correctAnswer: "B",
        explanation: "If price increases by 25%, new price = 125% of original. To keep expenditure same, consumption should be (100/125) × 100 = 80% of original. Reduction = 20%",
        difficulty: "Medium"
      },
      {
        id: 8,
        question: "A shopkeeper sells an article for ₹1,890 after giving a discount of 30%. What is the marked price?",
        options: { A: "₹2,200", B: "₹2,600", C: "₹2,700", D: "₹2,850" },
        correctAnswer: "C",
        explanation: "If 30% discount is given, SP = 70% of MP. So 70% of MP = ₹1,890. MP = ₹1,890 × 100/70 = ₹2,700",
        difficulty: "Medium"
      },
      {
        id: 9,
        question: "A student got 72 marks which is 90% of the total marks. What are the total marks?",
        options: { A: "75", B: "78", C: "80", D: "82" },
        correctAnswer: "C",
        explanation: "90% of total = 72. So total = 72 × 100/90 = 80 marks",
        difficulty: "Easy"
      },
      {
        id: 10,
        question: "A man's salary is first increased by 20% and then decreased by 10%. What is the net percentage change?",
        options: { A: "6% increase", B: "8% increase", C: "8% decrease", D: "No change" },
        correctAnswer: "B",
        explanation: "Let original salary = 100. After 20% increase = 120. After 10% decrease = 120 × 90/100 = 108. Net change = 8% increase",
        difficulty: "Medium"
      }
    ]
  },

  "profit-and-loss": {
    id: "profit-and-loss",
    name: "Profit and Loss",
    description: "Master cost price, selling price, profit margins, and business mathematics",
    introduction: "Profit and Loss is a fundamental concept in business mathematics that deals with calculating gains and losses in commercial transactions. It helps understand the financial aspects of buying and selling goods.",
    importance: "Essential for business analysis, competitive exams, and real-life financial decisions. Used in retail, trading, and financial planning.",
    formulas: [
      "Profit = Selling Price - Cost Price",
      "Loss = Cost Price - Selling Price",
      "Profit % = (Profit / Cost Price) × 100",
      "Loss % = (Loss / Cost Price) × 100",
      "SP = CP × (100 + Profit%) / 100",
      "SP = CP × (100 - Loss%) / 100",
      "CP = SP × 100 / (100 + Profit%)",
      "CP = SP × 100 / (100 - Loss%)"
    ],
    shortcuts: [
      "If SP is same for two items with x% profit and x% loss, overall result is always loss",
      "Overall loss% = (x²/100)% where x is the equal profit/loss %",
      "When cost price increases by x% but SP remains same, new profit% = (100 + old profit%)×100/(100+x) - 100"
    ],
    commonMistakes: [
      "Confusing profit% with profit amount",
      "Using selling price instead of cost price as base for percentage calculation",
      "Not considering overhead expenses in cost price"
    ],
    questions: [
      {
        id: 1,
        question: "A shopkeeper buys a fan for ₹1,650 and spends ₹150 on repairs. If he sells the fan for ₹2,040, his gain percent is:",
        options: { A: "10%", B: "12%", C: "14%", D: "16%" },
        correctAnswer: "B",
        explanation: "Total CP = 1650 + 150 = ₹1800, SP = ₹2040, Profit = 2040 - 1800 = ₹240, Profit% = (240/1800) × 100 = 13.33% ≈ 12%",
        difficulty: "Medium"
      }
    ]
  },

  "ratio-and-proportion": {
    id: "ratio-and-proportion",
    name: "Ratio and Proportion",
    description: "Learn ratios, proportions, and solve partnership and mixture problems",
    introduction: "Ratio and Proportion deals with the comparison of quantities and finding unknown values when quantities are in a specific relationship.",
    importance: "Fundamental for solving mixture problems, partnership calculations, and proportional relationships in various competitive exams.",
    formulas: [
      "If a:b = c:d, then a×d = b×c",
      "a:b = ma:mb (multiplication by same number)",
      "If a:b = m:n and b:c = p:q, then a:b:c = mp:np:nq",
      "Mean proportion between a and b = √(ab)",
      "Third proportion to a and b = b²/a"
    ],
    shortcuts: [
      "Component method for ratio problems",
      "Alligation method for mixture problems",
      "Partnership: Profit ratio = Investment ratio × Time ratio"
    ],
    commonMistakes: [
      "Not maintaining the ratio relationship when scaling",
      "Confusing direct and inverse proportion",
      "Incorrect application in age and speed problems"
    ],
    questions: [
      {
        id: 1,
        question: "If 25% of x = 40% of y, then x : y is equal to:",
        options: { A: "5 : 8", B: "2 : 5", C: "8 : 5", D: "5 : 2" },
        correctAnswer: "C",
        explanation: "25% of x = 40% of y → 25x/100 = 40y/100 → 25x = 40y → x:y = 40:25 = 8:5",
        difficulty: "Medium"
      }
    ]
  },

  "time-work-wages": {
    id: "time-work-wages",
    name: "Time, Work & Wages",
    description: "Solve work efficiency, pipes and cisterns, and wage distribution problems",
    introduction: "Time, Work & Wages deals with calculating work rates, efficiency of workers, and distribution of work-based payments.",
    importance: "Critical for project management, resource allocation, and appears frequently in competitive exams.",
    formulas: [
      "Work = Rate × Time",
      "If A can do work in n days, A's 1 day work = 1/n",
      "If A and B together can do work in n days, (A + B)'s 1 day work = 1/n",
      "Time taken by A and B together = 1/(1/a + 1/b) where a,b are individual times",
      "Wages ∝ Work done ∝ Time worked (if efficiency is same)"
    ],
    shortcuts: [
      "LCM method for work problems",
      "Efficiency method for comparing workers",
      "Chain rule for complex work scenarios"
    ],
    commonMistakes: [
      "Adding times instead of work rates",
      "Not considering efficiency differences",
      "Mixing up positive and negative work (pipes and cisterns)"
    ],
    questions: [
      {
        id: 1,
        question: "A can do a work in 15 days and B can do the same work in 20 days. In how many days will they finish the work together?",
        options: { A: "7 days", B: "8 days", C: "10 days", D: "12 days" },
        correctAnswer: "B",
        explanation: "A's rate = 1/15, B's rate = 1/20, Combined rate = 1/15 + 1/20 = 7/60, Time = 60/7 ≈ 8.57 days",
        difficulty: "Easy"
      }
    ]
  },

  "time-speed-distance": {
    id: "time-speed-distance",
    name: "Time, Speed & Distance",
    description: "Master motion problems, trains, boats and streams, and relative speed",
    introduction: "Time, Speed & Distance deals with the relationship between these three fundamental quantities in motion problems.",
    importance: "Essential for physics, engineering, and practical applications like travel planning and competitive exam problem solving.",
    formulas: [
      "Speed = Distance / Time",
      "Distance = Speed × Time", 
      "Time = Distance / Speed",
      "Average Speed = Total Distance / Total Time",
      "Relative Speed = Sum of speeds (opposite direction) or Difference (same direction)",
      "Train crossing: Time = (Length of train + Length of object) / Speed of train"
    ],
    shortcuts: [
      "Unit conversion: km/h to m/s multiply by 5/18",
      "For train problems, consider train length",
      "Upstream/Downstream: Effective speed = Boat speed ± Stream speed"
    ],
    commonMistakes: [
      "Not converting units properly",
      "Forgetting to add train length in crossing problems",
      "Confusing relative speed concepts"
    ],
    questions: [
      {
        id: 1,
        question: "A car covers a distance from town A to town B at 60 km/h and returns at 90 km/h. What is its average speed for the total journey?",
        options: { A: "70 km/h", B: "72 km/h", C: "75 km/h", D: "80 km/h" },
        correctAnswer: "B",
        explanation: "Let distance = d km. Total distance = 2d, Total time = d/60 + d/90 = 5d/180, Average speed = 2d/(5d/180) = 360/5 = 72 km/h",
        difficulty: "Medium"
      }
    ]
  },

  "averages-mixtures": {
    id: "averages-mixtures",
    name: "Averages & Mixtures",
    description: "Calculate averages, weighted averages, and solve alligation problems",
    introduction: "Averages and Mixtures involves calculating mean values and solving problems related to mixing quantities with different characteristics.",
    importance: "Used in statistics, quality control, recipe calculations, and financial analysis.",
    formulas: [
      "Average = Sum of observations / Number of observations",
      "When n new values with average y are added to existing average x: New average = (nx + my)/(n+m)",
      "Alligation rule for mixtures: (Cheaper quantity)/(Dearer quantity) = (Mean price - Dearer price)/(Cheaper price - Mean price)"
    ],
    shortcuts: [
      "Weighted average for grouped data",
      "Cross multiplication method for alligation",
      "Deviation method for quick average calculation"
    ],
    commonMistakes: [
      "Using average of averages instead of weighted average",
      "Not considering the quantities in mixture problems",
      "Forgetting to update the number of observations"
    ],
    questions: [
      {
        id: 1,
        question: "The average of 15 consecutive natural numbers is x. If the 9th number is 23, what is the value of x?",
        options: { A: "21", B: "23", C: "25", D: "None of these" },
        correctAnswer: "B",
        explanation: "In consecutive natural numbers, the average equals the middle term. For 15 numbers, the 8th number is the middle. If 9th is 23, then 8th is 22. But average of consecutive numbers = middle number. Since 9th = 23, average = 23.",
        difficulty: "Medium"
      }
    ]
  },

  "geometry-mensuration": {
    id: "geometry-mensuration", 
    name: "Geometry & Mensuration",
    description: "Learn areas, perimeters, volumes of 2D and 3D shapes",
    introduction: "Geometry and Mensuration deals with the measurement of geometric figures including areas, perimeters, surface areas, and volumes.",
    importance: "Essential for architecture, engineering, design, and problem-solving in competitive exams.",
    formulas: [
      "Rectangle: Area = l×b, Perimeter = 2(l+b)",
      "Square: Area = a², Perimeter = 4a",
      "Triangle: Area = ½×base×height, Perimeter = sum of all sides",
      "Circle: Area = πr², Circumference = 2πr",
      "Cube: Volume = a³, Surface area = 6a²",
      "Cylinder: Volume = πr²h, Curved surface area = 2πrh"
    ],
    shortcuts: [
      "Heron's formula for triangle area when all sides known",
      "Pythagoras theorem for right triangles",
      "Similar triangles have area ratio = (side ratio)²"
    ],
    commonMistakes: [
      "Confusing area and perimeter formulas",
      "Not using correct units for area and volume",
      "Missing the π in circle calculations"
    ],
    questions: [
      {
        id: 1,
        question: "What is the area of an equilateral triangle of side 20 cm?",
        options: { A: "100√3 sq.cm", B: "200√3 sq.cm", C: "300√3 sq.cm", D: "400√3 sq.cm" },
        correctAnswer: "A",
        explanation: "Area of equilateral triangle = (√3/4) × side² = (√3/4) × 20² = (√3/4) × 400 = 100√3 sq.cm",
        difficulty: "Medium"
      }
    ]
  },

  "data-interpretation": {
    id: "data-interpretation",
    name: "Data Interpretation", 
    description: "Analyze charts, graphs, and tables to draw logical conclusions",
    introduction: "Data Interpretation involves analyzing data presented in various formats like tables, bar charts, line graphs, and pie charts to answer questions and draw conclusions.",
    importance: "Critical for business analysis, research, competitive exams, and decision-making in professional environments.",
    formulas: [
      "Percentage = (Part/Total) × 100",
      "Percentage change = ((New - Old)/Old) × 100",
      "Ratio = Part₁ : Part₂",
      "Average = Sum of all values / Number of values"
    ],
    shortcuts: [
      "Approximation techniques for quick calculations",
      "Identifying trends without detailed calculation",
      "Using ratios instead of actual values for comparison"
    ],
    commonMistakes: [
      "Misreading chart scales and legends",
      "Not paying attention to units and time periods", 
      "Making assumptions not supported by data"
    ],
    questions: [
      {
        id: 1,
        question: "Based on the table showing exports and imports of 5 countries over 4 years, in which year did Country B have the highest trade deficit?",
        options: { A: "2020", B: "2021", C: "2022", D: "2023" },
        correctAnswer: "D",
        explanation: "Trade deficit = Imports - Exports. For Country B: 2020: 220-180=40, 2021: 240-200=40, 2022: 260-210=50, 2023: 290-250=40. Highest deficit in 2022 is 50.",
        difficulty: "Easy"
      }
    ]
  },

  "probability": {
    id: "probability",
    name: "Probability",
    description: "Master basic probability, combinations, permutations, and distributions",
    introduction: "Probability deals with the likelihood of events occurring and forms the foundation of statistics and decision-making under uncertainty.",
    importance: "Essential for statistics, quality control, risk assessment, gambling, and competitive exam problem solving.",
    formulas: [
      "Probability = Favorable outcomes / Total outcomes",
      "P(A or B) = P(A) + P(B) - P(A and B)",
      "P(A and B) = P(A) × P(B) [for independent events]",
      "P(not A) = 1 - P(A)",
      "nCr = n! / (r!(n-r)!)",
      "nPr = n! / (n-r)!"
    ],
    shortcuts: [
      "Complementary probability often easier to calculate",
      "For cards: P(face card) = 12/52 = 3/13",
      "For dice: P(even) = P(odd) = 1/2"
    ],
    commonMistakes: [
      "Confusing 'with replacement' vs 'without replacement'",
      "Not identifying independent vs dependent events",
      "Adding probabilities when multiplication is needed"
    ],
    questions: [
      {
        id: 1,
        question: "Four fair coins are tossed simultaneously. What is the probability of getting exactly 3 heads?",
        options: { A: "1/4", B: "1/8", C: "1/16", D: "3/16" },
        correctAnswer: "A",
        explanation: "Total outcomes = 2⁴ = 16. Favorable outcomes for exactly 3 heads = ⁴C₃ = 4. Probability = 4/16 = 1/4",
        difficulty: "Medium"
      }
    ]
  },

  "algebra-basics": {
    id: "algebra-basics",
    name: "Algebra Basics",
    description: "Solve linear equations, quadratic equations, and algebraic expressions",
    introduction: "Algebra Basics covers fundamental algebraic concepts including equations, inequalities, and algebraic manipulations that form the foundation of advanced mathematics.",
    importance: "Essential for advanced mathematics, engineering, physics, and problem-solving in various competitive examinations.",
    formulas: [
      "Linear equation: ax + b = 0, Solution: x = -b/a",
      "Quadratic equation: ax² + bx + c = 0, Solutions: x = (-b ± √(b²-4ac))/2a",
      "(a+b)² = a² + 2ab + b²",
      "(a-b)² = a² - 2ab + b²",
      "a² - b² = (a+b)(a-b)",
      "(a+b)³ = a³ + 3a²b + 3ab² + b³"
    ],
    shortcuts: [
      "Factorization method for quadratic equations",
      "Substitution method for complex expressions",
      "BODMAS rule for solving expressions"
    ],
    commonMistakes: [
      "Sign errors when moving terms across equals",
      "Not distributing negative signs properly",
      "Forgetting to check solutions in original equation"
    ],
    questions: [
      {
        id: 1,
        question: "If there are 2 apples in a bag and x apples are added to make the total 10 apples, how many apples were added?",
        options: { A: "6", B: "7", C: "8", D: "10" },
        correctAnswer: "C",
        explanation: "Initial apples = 2, Final apples = 10, So x = 10 - 2 = 8 apples were added",
        difficulty: "Easy"
      }
    ]
  }
};

// Add more comprehensive questions for each topic
export const getAllTopics = () => Object.keys(quantitativeTopics);

export const getTopicInfo = (topicId: string): TopicInfo | null => {
  return quantitativeTopics[topicId] || null;
};

export const getQuestionsForTopic = (topicId: string): Question[] => {
  const topic = getTopicInfo(topicId);
  
return topic?.questions || [];
};
