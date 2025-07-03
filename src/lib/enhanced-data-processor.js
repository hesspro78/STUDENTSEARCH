import { emailValidator } from './email-validator';

// Enhanced data processing with email validation
export const processStudentData = (rawProfiles) => {
  const processedProfiles = [];
  const validationStats = {
    verified: 0,
    invalid: 0,
    pending: 0,
    manualReview: 0
  };

  for (const profile of rawProfiles) {
    // Skip profiles without basic required data
    if (!profile.firstName || !profile.lastName) {
      continue;
    }

    const processedProfile = { ...profile };

    // Process email validation
    if (profile.email) {
      const validation = emailValidator.validateEmail(
        profile.email,
        profile.source || 'unknown',
        {
          studentId: profile.id,
          country: profile.country,
          domain: profile.domain
        }
      );

      if (validation.isValid) {
        processedProfile.email = validation.email;
        processedProfile.emailStatus = 'VERIFIED';
        processedProfile.emailVerifiedAt = validation.verifiedAt;
        processedProfile.emailSource = validation.source;
        validationStats.verified++;
      } else {
        processedProfile.email = null;
        processedProfile.emailStatus = 'INVALID';
        processedProfile.emailRejectionReason = validation.reason;
        
        if (validation.requiresManualVerification) {
          emailValidator.addToVerificationQueue(
            profile.id,
            profile.email,
            validation.reason
          );
          processedProfile.emailStatus = 'MANUAL_VERIFICATION_NEEDED';
          validationStats.manualReview++;
        } else {
          validationStats.invalid++;
        }
      }
    } else {
      processedProfile.email = null;
      processedProfile.emailStatus = 'MANUAL_VERIFICATION_NEEDED';
      validationStats.manualReview++;
    }

    // Validate phone number (basic validation)
    if (profile.phone) {
      const phoneRegex = /^\+\d{8,15}$/;
      if (phoneRegex.test(profile.phone.replace(/[\s-()]/g, ''))) {
        processedProfile.phoneStatus = 'VERIFIED';
      } else {
        processedProfile.phone = null;
        processedProfile.phoneStatus = 'INVALID';
      }
    } else {
      processedProfile.phoneStatus = 'MISSING';
    }

    // Determine overall contact status
    if (processedProfile.emailStatus === 'VERIFIED' && processedProfile.phoneStatus === 'VERIFIED') {
      processedProfile.contactStatus = 'verified';
    } else if (processedProfile.emailStatus === 'VERIFIED' || processedProfile.phoneStatus === 'VERIFIED') {
      processedProfile.contactStatus = 'uncertain';
    } else {
      processedProfile.contactStatus = 'manual_verification_needed';
    }

    processedProfiles.push(processedProfile);
  }

  return {
    profiles: processedProfiles,
    validationStats
  };
};

// Email domain filtering utilities
export const getEmailDomainStats = (profiles) => {
  const domainStats = {};
  
  profiles.forEach(profile => {
    if (profile.email && profile.emailStatus === 'VERIFIED') {
      const domain = profile.email.split('@')[1];
      domainStats[domain] = (domainStats[domain] || 0) + 1;
    }
  });

  return Object.entries(domainStats)
    .sort(([,a], [,b]) => b - a)
    .map(([domain, count]) => ({ domain, count }));
};

// Source validation statistics
export const getSourceValidationStats = (profiles) => {
  const sourceStats = {};
  
  profiles.forEach(profile => {
    const source = profile.source || 'unknown';
    if (!sourceStats[source]) {
      sourceStats[source] = { total: 0, verified: 0, invalid: 0, manual: 0 };
    }
    
    sourceStats[source].total++;
    
    switch (profile.emailStatus) {
      case 'VERIFIED':
        sourceStats[source].verified++;
        break;
      case 'INVALID':
        sourceStats[source].invalid++;
        break;
      case 'MANUAL_VERIFICATION_NEEDED':
        sourceStats[source].manual++;
        break;
    }
  });

  return sourceStats;
};