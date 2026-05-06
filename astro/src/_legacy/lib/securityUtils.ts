// Security utilities for input validation and sanitization
import DOMPurify from 'dompurify';

// Advanced input validation with security patterns
export const validateSecureInput = (input: string, maxLength = 5000): { isValid: boolean; error?: string } => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'Input is required' };
  }
  
  if (input.length > maxLength) {
    return { isValid: false, error: `Input exceeds maximum length of ${maxLength} characters` };
  }
  
  // Check for potential security threats
  const securityPatterns = [
    // Script injection
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /data:text\/html/gi,
    /on\w+\s*=/gi,
    
    // SQL injection patterns
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
    /(;|\s)(-{2}|\/\*|\*\/)/gi,
    /\'\s*(or|and)\s*\'/gi,
    
    // Prompt injection attempts
    /ignore\s+previous\s+instructions/i,
    /system\s*:\s*you\s+are/i,
    /forget\s+everything/i,
    /new\s+instructions/i,
    /admin\s+mode/i,
    /override\s+(settings|instructions)/i,
    /act\s+as\s+(admin|root|system)/i,
    
    // XSS patterns
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<form/gi,
    /<input/gi,
    /expression\(/gi,
    /url\(/gi,
  ];
  
  for (const pattern of securityPatterns) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input contains potentially harmful content' };
    }
  }
  
  return { isValid: true };
};

// Sanitize HTML content for safe display
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'em', 'code', 'br', 'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    RETURN_DOM_FRAGMENT: false
  });
};

// Deep sanitize object properties
export const sanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return obj.trim().replace(/[<>]/g, '');
  }
  
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  
  return sanitized;
};

// Rate limiting store for client-side rate limiting awareness
export const clientRateLimit = {
  store: new Map<string, { count: number; resetTime: number }>(),
  
  check(key: string, limit: number = 10, windowMs: number = 60000): { allowed: boolean; resetTime?: number } {
    const now = Date.now();
    const record = this.store.get(key);
    
    if (!record || now > record.resetTime) {
      this.store.set(key, { count: 1, resetTime: now + windowMs });
      return { allowed: true };
    }
    
    if (record.count >= limit) {
      return { allowed: false, resetTime: record.resetTime };
    }
    
    record.count++;
    return { allowed: true };
  },
  
  clear(key?: string) {
    if (key) {
      this.store.delete(key);
    } else {
      this.store.clear();
    }
  }
};

// Check if content contains suspicious patterns
export const containsSuspiciousContent = (content: string): boolean => {
  const suspiciousPatterns = [
    // Phishing attempts
    /verify.*account/gi,
    /suspended.*account/gi,
    /click.*here.*immediately/gi,
    /urgent.*action.*required/gi,
    
    // Spam patterns
    /win.*prize/gi,
    /congratulations.*winner/gi,
    /act.*now/gi,
    /limited.*time.*offer/gi,
    
    // Social engineering
    /send.*password/gi,
    /provide.*credentials/gi,
    /verify.*identity/gi,
    /confirm.*payment/gi,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(content));
};

// Escape HTML entities
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Create Content Security Policy nonce
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};