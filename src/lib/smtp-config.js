
const knownProviders = {
  'gmail.com': { smtpHost: 'smtp.gmail.com', smtpPort: '587', smtpSecure: 'tls' },
  'outlook.com': { smtpHost: 'smtp.office365.com', smtpPort: '587', smtpSecure: 'tls' },
  'hotmail.com': { smtpHost: 'smtp.office365.com', smtpPort: '587', smtpSecure: 'tls' },
  'yahoo.com': { smtpHost: 'smtp.mail.yahoo.com', smtpPort: '465', smtpSecure: 'ssl' },
  'aol.com': { smtpHost: 'smtp.aol.com', smtpPort: '465', smtpSecure: 'ssl' },
  'zoho.com': { smtpHost: 'smtp.zoho.com', smtpPort: '465', smtpSecure: 'ssl' },
};

export const getSmtpConfigFromEmail = (email) => {
  if (!email || !email.includes('@')) {
    return { config: null, isKnown: false };
  }
  const domain = email.split('@')[1];
  if (knownProviders[domain]) {
    return { config: knownProviders[domain], isKnown: true };
  }
  return { config: null, isKnown: false };
};
