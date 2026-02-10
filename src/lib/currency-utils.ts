// Utility functions for currency conversion and salary formatting

// USD to INR exchange rate (as of current market rates)
const USD_TO_INR_RATE = 83;

// Convert USD to Indian Lakhs Per Annum (LPA)
export function usdToLPA(usdAmount: number): number {
  return (usdAmount * USD_TO_INR_RATE) / 100000;
}

// Convert LPA to USD
export function lpaToUSD(lpaAmount: number): number {
  return (lpaAmount * 100000) / USD_TO_INR_RATE;
}

// Convert salary range from USD to LPA
export function convertSalaryRangeToLPA(salaryRange: string): string {
  // Extract numbers from salary range (e.g., "$110k - $132k" or "$75k-$95k")
  const matches = salaryRange.match(/\$(\d+)k?\s*[-–]\s*\$(\d+)k?/);
  
  if (matches) {
    const minUSD = parseInt(matches[1]) * 1000; // Convert k to full amount
    const maxUSD = parseInt(matches[2]) * 1000;
    
    const minLPA = usdToLPA(minUSD);
    const maxLPA = usdToLPA(maxUSD);
    
    return `${minLPA.toFixed(1)} LPA - ${maxLPA.toFixed(1)} LPA (India)`;
  }
  
  // Handle single value (e.g., "$85k")
  const singleMatch = salaryRange.match(/\$(\d+)k?/);
  if (singleMatch) {
    const usdAmount = parseInt(singleMatch[1]) * 1000;
    const lpa = usdToLPA(usdAmount);
    
return `${lpa.toFixed(1)} LPA (India)`;
  }
  
  return salaryRange; // Return original if no match
}

// Format salary with both USD and LPA
export function formatSalaryWithBoth(salaryRange: string): {
  usd: string;
  lpa: string;
  combined: string;
} {
  const lpaRange = convertSalaryRangeToLPA(salaryRange);
  
  return {
    usd: salaryRange,
    lpa: lpaRange,
    combined: `${salaryRange} (${lpaRange})`
  };
}

// Parse individual salary values for calculations
export function parseSalaryRange(salaryRange: string): {
  minUSD: number;
  maxUSD: number;
  minLPA: number;
  maxLPA: number;
} {
  const matches = salaryRange.match(/\$(\d+)k?\s*[-–]\s*\$(\d+)k?/);
  
  if (matches) {
    const minUSD = parseInt(matches[1]) * 1000;
    const maxUSD = parseInt(matches[2]) * 1000;
    
    return {
      minUSD,
      maxUSD,
      minLPA: usdToLPA(minUSD),
      maxLPA: usdToLPA(maxUSD)
    };
  }
  
  // Default values if parsing fails
  return {
    minUSD: 70000,
    maxUSD: 90000,
    minLPA: usdToLPA(70000),
    maxLPA: usdToLPA(90000)
  };
}

// Format currency for display
export function formatCurrency(amount: number, currency: 'USD' | 'LPA' = 'USD'): string {
  if (currency === 'LPA') {
    return `${amount.toFixed(1)} LPA`;
  } else {
    return `$${(amount / 1000).toFixed(0)}k`;
  }
}

// Validate and ensure salary data integrity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ensureSalaryFormat(prediction: Record<string, unknown>): Record<string, unknown> {
  if (!prediction?.salary) {
    return prediction;
  }
  
  const salary = prediction.salary as Record<string, unknown>;
  if (!salary?.estimate) {
    return prediction;
  }
  
  const salaryInfo = formatSalaryWithBoth(salary.estimate as string);
  
  return {
    ...prediction,
    salary: {
      ...salary,
      estimate: salaryInfo.combined,
      estimateUSD: salaryInfo.usd,
      estimateLPA: salaryInfo.lpa,
      range: salary.range ? {
        ...(salary.range as Record<string, unknown>),
        minLPA: usdToLPA((salary.range as { min: number }).min),
        maxLPA: usdToLPA((salary.range as { max: number }).max)
      } : undefined
    }
  };
}

// Enhanced salary formatting with comprehensive options
export function formatSalaryDisplay(amount: number, options: {
  showUSD?: boolean;
  showINR?: boolean;
  showLPA?: boolean;
  precision?: number;
  currency?: 'USD' | 'INR' | 'LPA';
} = {}): string {
  const {
    showUSD = true,
    showINR = false,
    showLPA = true,
    precision = 1,
    currency = 'LPA'
  } = options;

  if (currency === 'LPA') {
    const usdEquivalent = lpaToUSD(amount);
    const inrEquivalent = amount * 1; // LPA is already in lakhs
    
    let result = `₹${amount.toFixed(precision)}L`;
    
    if (showUSD) {
      result += ` ($${(usdEquivalent / 1000).toFixed(0)}k)`;
    }
    
    if (showINR) {
      result += ` (₹${(inrEquivalent * 100000).toLocaleString('en-IN')})`;
    }
    
    return result;
  }
  
  if (currency === 'USD') {
    const lpaEquivalent = usdToLPA(amount);
    
    let result = `$${(amount / 1000).toFixed(0)}k`;
    
    if (showLPA) {
      result += ` (₹${lpaEquivalent.toFixed(precision)}L)`;
    }
    
    return result;
  }
  
  return `${amount}`;
}

// Validate and normalize salary input
export function validateAndNormalizeSalary(input: string | number): {
  isValid: boolean;
  normalizedAmount: number;
  currency: 'USD' | 'INR' | 'LPA';
  confidence: number;
} {
  if (typeof input === 'number') {
    return {
      isValid: input > 0,
      normalizedAmount: input,
      currency: input > 1000 ? 'USD' : 'LPA',
      confidence: 0.8
    };
  }
  
  const cleanInput = input.toLowerCase().trim();
  
  // USD patterns
  const usdPatterns = [
    /\$([0-9.,]+)k?/,
    /([0-9.,]+)\s*usd/,
    /([0-9.,]+)\s*dollars?/
  ];
  
  // LPA patterns
  const lpaPatterns = [
    /₹?([0-9.,]+)\s*l(pa|akhs?)?/,
    /([0-9.,]+)\s*lpa/,
    /([0-9.,]+)\s*lakhs?/
  ];
  
  // INR patterns
  const inrPatterns = [
    /₹([0-9.,]+)/,
    /([0-9.,]+)\s*inr/,
    /([0-9.,]+)\s*rupees?/
  ];
  
  // Check USD
  for (const pattern of usdPatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));

      return {
        isValid: amount > 0,
        normalizedAmount: cleanInput.includes('k') ? amount * 1000 : amount,
        currency: 'USD',
        confidence: 0.9
      };
    }
  }
  
  // Check LPA
  for (const pattern of lpaPatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));

      return {
        isValid: amount > 0,
        normalizedAmount: amount,
        currency: 'LPA',
        confidence: 0.95
      };
    }
  }
  
  // Check INR
  for (const pattern of inrPatterns) {
    const match = cleanInput.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(/,/g, ''));

      return {
        isValid: amount > 0,
        normalizedAmount: amount / 100000, // Convert to LPA
        currency: 'INR',
        confidence: 0.85
      };
    }
  }
  
  // Fallback: try to extract any number
  const numberMatch = cleanInput.match(/([0-9.,]+)/);
  if (numberMatch) {
    const amount = parseFloat(numberMatch[1].replace(/,/g, ''));

    return {
      isValid: amount > 0,
      normalizedAmount: amount,
      currency: amount > 1000 ? 'USD' : 'LPA',
      confidence: 0.5
    };
  }
  
  return {
    isValid: false,
    normalizedAmount: 0,
    currency: 'LPA',
    confidence: 0
  };
}

// Market-based salary prediction utilities
export function predictMarketSalary(currentSalary: number, experience: number, targetRole: string, timeframe: number): {
  predictedSalary: number;
  confidence: number;
  factors: string[];
} {
  const baseGrowthRate = 0.15; // 15% annual growth base
  const experienceMultiplier = Math.min(experience * 0.05, 0.3); // Max 30% boost
  const timeframeYears = timeframe / 365;
  
  // Role-specific multipliers
  const roleMultipliers: Record<string, number> = {
    'software engineer': 1.0,
    'senior software engineer': 1.4,
    'tech lead': 1.6,
    'engineering manager': 1.8,
    'principal engineer': 2.0,
    'data scientist': 1.2,
    'product manager': 1.5,
    'devops engineer': 1.3,
    'full stack developer': 1.1,
    'frontend developer': 0.95,
    'backend developer': 1.05
  };
  
  const roleMultiplier = roleMultipliers[targetRole.toLowerCase()] || 1.0;
  const totalGrowthRate = baseGrowthRate + experienceMultiplier;
  
  const predictedSalary = currentSalary * Math.pow(1 + totalGrowthRate, timeframeYears) * roleMultiplier;
  
  const confidence = Math.min(
    0.9 - (timeframeYears * 0.1) + // Reduce confidence for longer timeframes
    (experience > 2 ? 0.1 : 0) + // Boost confidence for experienced professionals
    (roleMultiplier > 1 ? 0.05 : 0), // Boost confidence for senior roles
    0.95
  );
  
  const factors = [
    `${(totalGrowthRate * 100).toFixed(1)}% annual growth rate`,
    `${(roleMultiplier - 1) * 100 > 0 ? '+' : ''}${((roleMultiplier - 1) * 100).toFixed(1)}% role premium`,
    `${timeframeYears.toFixed(1)} year timeframe`,
    `${experience} years experience factor`
  ];
  
  return {
    predictedSalary: Math.round(predictedSalary * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    factors
  };
}
