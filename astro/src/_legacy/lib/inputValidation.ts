// Input validation utilities for security
export const validatePromptInput = (input: string): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > 5000) {
    return { isValid: false, error: 'Input exceeds maximum length of 5000 characters' };
  }
  
  // Check for potential prompt injection attempts
  const suspiciousPatterns = [
    /ignore\s+previous\s+instructions/i,
    /system\s*:\s*you\s+are/i,
    /forget\s+everything/i,
    /new\s+instructions/i,
    /admin\s+mode/i,
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /data:text\/html/i,
    /eval\s*\(/i,
    /expression\s*\(/i
  ];
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input contains potentially harmful content' };
    }
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  // Remove excessive whitespace and normalize
  return input.trim().replace(/\s+/g, ' ');
};

export const validateEmailInput = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};