// Système de validation stricte pour contacts authentiques uniquement
const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail|etu\..+)\.(com|fr|edu)$/;
const VALID_PHONE_REGEX = /^\+(212|229|221|225|226|227|228|230|231|232|233|234|235|236|237|238|239|240|241|242|243|244|245|246|247|248|249|250|251|252|253|254|255|256|257|258|260|261|262|263|264|265|266|267|268|269|290|291|297|298|299)\d{8,12}$/;

// Domaines strictement interdits
const FORBIDDEN_DOMAINS = [
  'email.com', 'domain.com', 'example.com', 'test.com', 'fake.com',
  'placeholder.com', 'dummy.com', 'sample.com', 'invalid.com',
  'tempmail.com', '10minutemail.com', 'guerrillamail.com'
];

// Patterns d'emails générés automatiquement à rejeter
const AUTO_GENERATED_PATTERNS = [
  /^[a-z]+\.[a-z]+@email\.com$/i,
  /^user\d+@/i,
  /^test\d*@/i,
  /^student\d+@/i,
  /^etudiant\d+@/i,
  /^prenom\.nom@/i,
  /^firstname\.lastname@/i
];

// Sources autorisées pour la collecte de données
const AUTHORIZED_SOURCES = {
  LINKEDIN_PUBLIC: 'linkedin_public',
  STUDENT_FORUM: 'student_forum',
  EDUCATIONAL_SITE: 'educational_site',
  PUBLIC_DIRECTORY: 'public_directory'
};

// Validation stricte des URLs sources
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

export class RealContactValidator {
  constructor() {
    this.rejectedContacts = new Map();
    this.validatedContacts = new Map();
    this.manualReviewQueue = [];
    this.sourceUrls = new Map(); // Traçabilité des URLs sources
  }

  /**
   * Validation stricte d'URL source
   */
  validateSourceUrl(sourceUrl) {
    if (!sourceUrl || typeof sourceUrl !== 'string') {
      return { isValid: false, reason: 'SOURCE_URL_MISSING' };
    }

    const trimmedUrl = sourceUrl.trim();

    // Vérification format URL valide
    if (!URL_REGEX.test(trimmedUrl)) {
      return { isValid: false, reason: 'INVALID_URL_FORMAT' };
    }

    // Vérification protocole sécurisé
    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      return { isValid: false, reason: 'INVALID_PROTOCOL' };
    }

    return { 
      isValid: true, 
      url: trimmedUrl,
      domain: this.extractDomainFromUrl(trimmedUrl)
    };
  }

  /**
   * Extraction du domaine depuis une URL
   */
  extractDomainFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validation stricte d'email - rejette tout ce qui n'est pas authentique
   */
  validateEmail(email, source = null, sourceUrl = null) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, reason: 'EMAIL_MISSING' };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérification format strict
    if (!STRICT_EMAIL_REGEX.test(normalizedEmail)) {
      this.logRejection(normalizedEmail, 'INVALID_FORMAT', source, sourceUrl);
      return { isValid: false, reason: 'INVALID_FORMAT' };
    }

    // Extraction du domaine
    const domain = normalizedEmail.split('@')[1];

    // Vérification domaines interdits
    if (FORBIDDEN_DOMAINS.includes(domain)) {
      this.logRejection(normalizedEmail, 'FORBIDDEN_DOMAIN', source, sourceUrl);
      return { isValid: false, reason: 'FORBIDDEN_DOMAIN' };
    }

    // Vérification patterns auto-générés
    for (const pattern of AUTO_GENERATED_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        this.logRejection(normalizedEmail, 'AUTO_GENERATED_PATTERN', source, sourceUrl);
        return { isValid: false, reason: 'AUTO_GENERATED_PATTERN' };
      }
    }

    // Vérification source autorisée
    if (source && !Object.values(AUTHORIZED_SOURCES).includes(source)) {
      this.logRejection(normalizedEmail, 'UNAUTHORIZED_SOURCE', source, sourceUrl);
      return { isValid: false, reason: 'UNAUTHORIZED_SOURCE' };
    }

    // Enregistrement de la source URL pour traçabilité
    if (sourceUrl) {
      this.sourceUrls.set(normalizedEmail, sourceUrl);
    }

    return { 
      isValid: true, 
      email: normalizedEmail,
      domain,
      provider: this.getEmailProvider(domain),
      sourceUrl: sourceUrl
    };
  }

  /**
   * Validation stricte de numéro de téléphone
   */
  validatePhone(phone, country = null, sourceUrl = null) {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, reason: 'PHONE_MISSING' };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

    // Vérification format strict avec indicatifs valides
    if (!VALID_PHONE_REGEX.test(cleanPhone)) {
      this.logRejection(phone, 'INVALID_PHONE_FORMAT', null, sourceUrl);
      return { isValid: false, reason: 'INVALID_PHONE_FORMAT' };
    }

    return { 
      isValid: true, 
      phone: cleanPhone,
      countryCode: cleanPhone.substring(0, 4),
      sourceUrl: sourceUrl
    };
  }

  /**
   * Validation complète d'un contact étudiant avec URL source obligatoire
   */
  validateStudentContact(studentData) {
    const result = {
      id: studentData.id,
      firstName: studentData.firstName,
      lastName: studentData.lastName,
      country: studentData.country,
      city: studentData.city,
      domain: studentData.domain,
      specialization: studentData.specialization,
      level: studentData.level,
      bio: studentData.bio,
      source: studentData.source,
      sourceUrl: null, // URL source obligatoire
      residentInMorocco: studentData.residentInMorocco,
      hasValidContact: false,
      emailStatus: 'MISSING',
      phoneStatus: 'MISSING',
      contactQuality: 'INCOMPLETE',
      extractedAt: new Date().toISOString()
    };

    // Validation URL source OBLIGATOIRE
    if (studentData.sourceUrl) {
      const sourceUrlValidation = this.validateSourceUrl(studentData.sourceUrl);
      if (sourceUrlValidation.isValid) {
        result.sourceUrl = sourceUrlValidation.url;
        result.sourceDomain = sourceUrlValidation.domain;
      } else {
        // Rejet si URL source invalide
        this.logRejection(
          `${studentData.firstName} ${studentData.lastName}`, 
          sourceUrlValidation.reason, 
          studentData.source, 
          studentData.sourceUrl
        );
        return null; // Contact rejeté
      }
    } else {
      // Rejet si pas d'URL source
      this.logRejection(
        `${studentData.firstName} ${studentData.lastName}`, 
        'SOURCE_URL_MISSING', 
        studentData.source, 
        null
      );
      return null; // Contact rejeté
    }

    let hasValidEmail = false;
    let hasValidPhone = false;

    // Validation email avec URL source
    if (studentData.email) {
      const emailValidation = this.validateEmail(
        studentData.email, 
        studentData.source, 
        result.sourceUrl
      );
      if (emailValidation.isValid) {
        result.email = emailValidation.email;
        result.emailStatus = 'VERIFIED';
        result.emailProvider = emailValidation.provider;
        result.emailVerifiedAt = new Date().toISOString();
        result.emailSourceUrl = emailValidation.sourceUrl;
        hasValidEmail = true;
      } else {
        result.emailStatus = 'REJECTED';
        result.emailRejectionReason = emailValidation.reason;
        // Ne pas inclure l'email rejeté
      }
    }

    // Validation téléphone avec URL source
    if (studentData.phone) {
      const phoneValidation = this.validatePhone(
        studentData.phone, 
        studentData.country, 
        result.sourceUrl
      );
      if (phoneValidation.isValid) {
        result.phone = phoneValidation.phone;
        result.phoneStatus = 'VERIFIED';
        result.phoneCountryCode = phoneValidation.countryCode;
        result.phoneSourceUrl = phoneValidation.sourceUrl;
        hasValidPhone = true;
      } else {
        result.phoneStatus = 'REJECTED';
        result.phoneRejectionReason = phoneValidation.reason;
        // Ne pas inclure le téléphone rejeté
      }
    }

    // Détermination de la qualité du contact
    if (hasValidEmail && hasValidPhone) {
      result.hasValidContact = true;
      result.contactQuality = 'EXCELLENT';
    } else if (hasValidEmail || hasValidPhone) {
      result.hasValidContact = true;
      result.contactQuality = 'GOOD';
    } else {
      result.hasValidContact = false;
      result.contactQuality = 'INCOMPLETE';
      // Ajouter à la file de vérification manuelle
      this.addToManualReview(result);
    }

    return result;
  }

  /**
   * Détermine le fournisseur d'email
   */
  getEmailProvider(domain) {
    if (domain.includes('gmail')) return 'gmail';
    if (domain.includes('yahoo')) return 'yahoo';
    if (domain.includes('outlook') || domain.includes('hotmail')) return 'outlook';
    if (domain.startsWith('etu.')) return 'educational';
    return 'other';
  }

  /**
   * Ajoute un contact à la file de vérification manuelle
   */
  addToManualReview(studentData) {
    this.manualReviewQueue.push({
      studentId: studentData.id,
      name: `${studentData.firstName} ${studentData.lastName}`,
      country: studentData.country,
      domain: studentData.domain,
      sourceUrl: studentData.sourceUrl,
      reason: 'NO_VALID_CONTACT_INFO',
      addedAt: new Date().toISOString()
    });
  }

  /**
   * Enregistre les rejets pour monitoring avec URL source
   */
  logRejection(contact, reason, source, sourceUrl) {
    const key = `${contact}_${reason}`;
    if (!this.rejectedContacts.has(key)) {
      this.rejectedContacts.set(key, {
        contact,
        reason,
        source,
        sourceUrl,
        count: 1,
        firstRejectedAt: new Date().toISOString()
      });
    } else {
      this.rejectedContacts.get(key).count++;
    }
  }

  /**
   * Obtient les statistiques de validation
   */
  getValidationStats() {
    return {
      totalRejected: this.rejectedContacts.size,
      manualReviewPending: this.manualReviewQueue.length,
      rejectionReasons: this.getRejectionReasons(),
      sourceUrlsTracked: this.sourceUrls.size
    };
  }

  /**
   * Obtient les raisons de rejet groupées
   */
  getRejectionReasons() {
    const reasons = {};
    for (const [, data] of this.rejectedContacts) {
      reasons[data.reason] = (reasons[data.reason] || 0) + data.count;
    }
    return reasons;
  }

  /**
   * Filtre uniquement les profils avec contacts valides
   */
  filterValidContactsOnly(students) {
    return students.filter(student => student && student.hasValidContact);
  }

  /**
   * Obtient les profils nécessitant une vérification manuelle
   */
  getManualReviewQueue() {
    return this.manualReviewQueue;
  }

  /**
   * Obtient les statistiques par domaine source
   */
  getSourceDomainStats() {
    const domainStats = {};
    for (const [email, url] of this.sourceUrls) {
      const domain = this.extractDomainFromUrl(url);
      if (domain) {
        domainStats[domain] = (domainStats[domain] || 0) + 1;
      }
    }
    return domainStats;
  }
}

// Instance singleton
export const contactValidator = new RealContactValidator();

// Utilitaires d'export
export const validateAndFilterStudents = (rawStudents) => {
  const validatedStudents = rawStudents
    .map(student => contactValidator.validateStudentContact(student))
    .filter(student => student && student.hasValidContact); // Ne garder que ceux avec contacts valides ET URL source

  return {
    validStudents: validatedStudents,
    stats: contactValidator.getValidationStats(),
    manualReviewQueue: contactValidator.getManualReviewQueue(),
    sourceDomainStats: contactValidator.getSourceDomainStats()
  };
};