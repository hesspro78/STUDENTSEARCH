// Email validation and verification system
const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|etu\..+)\.(com|fr|net|edu)$/;
const BLACKLISTED_DOMAINS = [
  'email.com', 'domain.com', 'example.com', 'test.com', 'fake.com',
  'placeholder.com', 'dummy.com', 'sample.com', 'invalid.com'
];
const GENERIC_PATTERNS = [
  /^(info|contact|admin|support|noreply|no-reply)@/i,
  /^[a-z]+\.[a-z]+@email\.com$/i,
  /^user\d+@/i,
  /^test\d*@/i
];

// Authorized sources for email collection
const AUTHORIZED_SOURCES = {
  LINKEDIN: 'linkedin',
  STUDENT_FORUM: 'student_forum',
  EDUCATIONAL_WEBSITE: 'educational_website',
  PUBLIC_STUDENT_LIST: 'public_student_list'
};

export class EmailValidator {
  constructor() {
    this.validationCache = new Map();
    this.blacklistedEmails = new Set();
    this.verificationQueue = [];
  }

  /**
   * Validates email format and checks against blacklists
   */
  validateEmailFormat(email) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, reason: 'MISSING_EMAIL' };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check basic format
    if (!VALID_EMAIL_REGEX.test(normalizedEmail)) {
      return { isValid: false, reason: 'INVALID_FORMAT' };
    }

    // Extract domain
    const domain = normalizedEmail.split('@')[1];

    // Check blacklisted domains
    if (BLACKLISTED_DOMAINS.includes(domain)) {
      return { isValid: false, reason: 'BLACKLISTED_DOMAIN' };
    }

    // Check generic patterns
    for (const pattern of GENERIC_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        return { isValid: false, reason: 'GENERIC_PATTERN' };
      }
    }

    // Check if manually blacklisted
    if (this.blacklistedEmails.has(normalizedEmail)) {
      return { isValid: false, reason: 'MANUALLY_BLACKLISTED' };
    }

    return { isValid: true, email: normalizedEmail };
  }

  /**
   * Validates email source authorization
   */
  validateEmailSource(source) {
    return Object.values(AUTHORIZED_SOURCES).includes(source);
  }

  /**
   * Comprehensive email validation with source verification
   */
  validateEmail(email, source, metadata = {}) {
    const formatValidation = this.validateEmailFormat(email);
    
    if (!formatValidation.isValid) {
      this.logRejectedEmail(email, formatValidation.reason, source, metadata);
      return {
        isValid: false,
        status: 'INVALID',
        reason: formatValidation.reason,
        requiresManualVerification: true
      };
    }

    if (!this.validateEmailSource(source)) {
      this.logRejectedEmail(email, 'UNAUTHORIZED_SOURCE', source, metadata);
      return {
        isValid: false,
        status: 'INVALID',
        reason: 'UNAUTHORIZED_SOURCE',
        requiresManualVerification: true
      };
    }

    // Check cache first
    const cacheKey = `${formatValidation.email}_${source}`;
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey);
    }

    const result = {
      isValid: true,
      status: 'VERIFIED',
      email: formatValidation.email,
      source,
      verifiedAt: new Date().toISOString(),
      metadata
    };

    this.validationCache.set(cacheKey, result);
    return result;
  }

  /**
   * Simulates external email validation API
   */
  async validateWithExternalAPI(email) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const validation = this.validateEmailFormat(email);
    if (!validation.isValid) {
      return { deliverable: false, reason: validation.reason };
    }

    // Simulate API response
    const domain = email.split('@')[1];
    const isDeliverable = !['fake.com', 'invalid.com'].includes(domain);

    return {
      deliverable: isDeliverable,
      reason: isDeliverable ? 'VALID' : 'UNDELIVERABLE',
      confidence: isDeliverable ? 0.95 : 0.1
    };
  }

  /**
   * Adds email to manual verification queue
   */
  addToVerificationQueue(studentId, email, reason) {
    this.verificationQueue.push({
      studentId,
      email,
      reason,
      addedAt: new Date().toISOString(),
      status: 'PENDING'
    });
  }

  /**
   * Logs rejected emails for monitoring
   */
  logRejectedEmail(email, reason, source, metadata) {
    const logEntry = {
      email,
      reason,
      source,
      metadata,
      rejectedAt: new Date().toISOString()
    };

    // In a real application, this would be sent to a logging service
    console.warn('Email rejected:', logEntry);
  }

  /**
   * Blacklists an email address
   */
  blacklistEmail(email, reason) {
    const normalizedEmail = email.toLowerCase().trim();
    this.blacklistedEmails.add(normalizedEmail);
    this.logRejectedEmail(normalizedEmail, `BLACKLISTED: ${reason}`, 'MANUAL', {});
  }

  /**
   * Gets validation statistics
   */
  getValidationStats() {
    return {
      totalValidated: this.validationCache.size,
      totalBlacklisted: this.blacklistedEmails.size,
      pendingVerification: this.verificationQueue.length
    };
  }
}

// Singleton instance
export const emailValidator = new EmailValidator();

// Email domain utilities
export const getEmailDomain = (email) => {
  if (!email || !email.includes('@')) return null;
  return email.split('@')[1].toLowerCase();
};

export const getEmailProvider = (email) => {
  const domain = getEmailDomain(email);
  if (!domain) return 'unknown';

  if (domain.includes('gmail')) return 'gmail';
  if (domain.includes('yahoo')) return 'yahoo';
  if (domain.includes('outlook') || domain.includes('hotmail')) return 'outlook';
  if (domain.startsWith('etu.')) return 'educational';
  return 'other';
};

export const EMAIL_PROVIDERS = {
  gmail: { name: 'Gmail', color: 'bg-red-100 text-red-800' },
  yahoo: { name: 'Yahoo', color: 'bg-purple-100 text-purple-800' },
  outlook: { name: 'Outlook', color: 'bg-blue-100 text-blue-800' },
  educational: { name: 'Educational', color: 'bg-green-100 text-green-800' },
  other: { name: 'Other', color: 'bg-gray-100 text-gray-800' }
};