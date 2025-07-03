const VALID_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const FORBIDDEN_DOMAINS = ['email.com', 'test.com', 'domain.com', 'example.com', 'fakemail.com'];
const GENERIC_EMAIL_PREFIXES = ['info@', 'contact@', 'noreply@', 'support@', 'admin@', 'test@'];
const PHONE_REGEX = /^\+\d{8,15}$/;

const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  if (!VALID_EMAIL_REGEX.test(email.toLowerCase())) return false;
  
  const domain = email.split('@')[1];
  if (FORBIDDEN_DOMAINS.includes(domain.toLowerCase())) return false;
  
  if (GENERIC_EMAIL_PREFIXES.some(prefix => email.toLowerCase().startsWith(prefix))) return false;
  
  return true;
};

const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PHONE_REGEX.test(phone.replace(/[\s-()]/g, ''));
};

export const enhanceStudentData = (profiles) => {
  return profiles
    .map(profile => {
      const hasValidName = profile.firstName && profile.lastName;
      if (!hasValidName) {
        return { ...profile, contactStatus: 'invalid' };
      }

      const isEmailValid = isValidEmail(profile.email);
      const isPhoneValid = isValidPhone(profile.phone);

      let contactStatus;
      const finalEmail = isEmailValid ? profile.email : null;
      const finalPhone = isPhoneValid ? profile.phone : null;

      if (isEmailValid && isPhoneValid) {
        contactStatus = 'verified';
      } else if (isEmailValid || isPhoneValid) {
        contactStatus = 'uncertain';
      } else {
        contactStatus = 'manual_verification_needed';
      }

      return { ...profile, email: finalEmail, phone: finalPhone, contactStatus };
    })
    .filter(profile => profile.contactStatus !== 'invalid');
};