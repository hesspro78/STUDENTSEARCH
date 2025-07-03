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

export class RealContactValidator {
  constructor() {
    this.rejectedContacts = new Map();
    this.validatedContacts = new Map();
    this.manualReviewQueue = [];
  }

  /**
   * Validation stricte d'email - rejette tout ce qui n'est pas authentique
   */
  validateEmail(email, source = null) {
    if (!email || typeof email !== 'string') {
      return { isValid: false, reason: 'EMAIL_MISSING' };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Vérification format strict
    if (!STRICT_EMAIL_REGEX.test(normalizedEmail)) {
      this.logRejection(normalizedEmail, 'INVALID_FORMAT', source);
      return { isValid: false, reason: 'INVALID_FORMAT' };
    }

    // Extraction du domaine
    const domain = normalizedEmail.split('@')[1];

    // Vérification domaines interdits
    if (FORBIDDEN_DOMAINS.includes(domain)) {
      this.logRejection(normalizedEmail, 'FORBIDDEN_DOMAIN', source);
      return { isValid: false, reason: 'FORBIDDEN_DOMAIN' };
    }

    // Vérification patterns auto-générés
    for (const pattern of AUTO_GENERATED_PATTERNS) {
      if (pattern.test(normalizedEmail)) {
        this.logRejection(normalizedEmail, 'AUTO_GENERATED_PATTERN', source);
        return { isValid: false, reason: 'AUTO_GENERATED_PATTERN' };
      }
    }

    // Vérification source autorisée
    if (source && !Object.values(AUTHORIZED_SOURCES).includes(source)) {
      this.logRejection(normalizedEmail, 'UNAUTHORIZED_SOURCE', source);
      return { isValid: false, reason: 'UNAUTHORIZED_SOURCE' };
    }

    return { 
      isValid: true, 
      email: normalizedEmail,
      domain,
      provider: this.getEmailProvider(domain)
    };
  }

  /**
   * Validation stricte de numéro de téléphone
   */
  validatePhone(phone, country = null) {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, reason: 'PHONE_MISSING' };
    }

    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');

    // Vérification format strict avec indicatifs valides
    if (!VALID_PHONE_REGEX.test(cleanPhone)) {
      this.logRejection(phone, 'INVALID_PHONE_FORMAT', null);
      return { isValid: false, reason: 'INVALID_PHONE_FORMAT' };
    }

    return { 
      isValid: true, 
      phone: cleanPhone,
      countryCode: cleanPhone.substring(0, 4)
    };
  }

  /**
   * Validation complète d'un contact étudiant
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
      residentInMorocco: studentData.residentInMorocco,
      hasValidContact: false,
      emailStatus: 'MISSING',
      phoneStatus: 'MISSING',
      contactQuality: 'INCOMPLETE'
    };

    let hasValidEmail = false;
    let hasValidPhone = false;

    // Validation email
    if (studentData.email) {
      const emailValidation = this.validateEmail(studentData.email, studentData.source);
      if (emailValidation.isValid) {
        result.email = emailValidation.email;
        result.emailStatus = 'VERIFIED';
        result.emailProvider = emailValidation.provider;
        result.emailVerifiedAt = new Date().toISOString();
        hasValidEmail = true;
      } else {
        result.emailStatus = 'REJECTED';
        result.emailRejectionReason = emailValidation.reason;
        // Ne pas inclure l'email rejeté
      }
    }

    // Validation téléphone
    if (studentData.phone) {
      const phoneValidation = this.validatePhone(studentData.phone, studentData.country);
      if (phoneValidation.isValid) {
        result.phone = phoneValidation.phone;
        result.phoneStatus = 'VERIFIED';
        result.phoneCountryCode = phoneValidation.countryCode;
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
      reason: 'NO_VALID_CONTACT_INFO',
      addedAt: new Date().toISOString()
    });
  }

  /**
   * Enregistre les rejets pour monitoring
   */
  logRejection(contact, reason, source) {
    const key = `${contact}_${reason}`;
    if (!this.rejectedContacts.has(key)) {
      this.rejectedContacts.set(key, {
        contact,
        reason,
        source,
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
      rejectionReasons: this.getRejectionReasons()
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
    return students.filter(student => student.hasValidContact);
  }

  /**
   * Obtient les profils nécessitant une vérification manuelle
   */
  getManualReviewQueue() {
    return this.manualReviewQueue;
  }
}

// Instance singleton
export const contactValidator = new RealContactValidator();

// Utilitaires d'export
export const validateAndFilterStudents = (rawStudents) => {
  const validatedStudents = rawStudents
    .map(student => contactValidator.validateStudentContact(student))
    .filter(student => student.hasValidContact); // Ne garder que ceux avec contacts valides

  return {
    validStudents: validatedStudents,
    stats: contactValidator.getValidationStats(),
    manualReviewQueue: contactValidator.getManualReviewQueue()
  };
};