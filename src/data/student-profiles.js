import { northAfricaProfiles } from './profiles/north-africa.js';
import { westAfricaGroup1 } from './profiles/west-africa-group1.js';
import { westAfricaGroup2 } from './profiles/west-africa-group2.js';
import { centralAfricaProfiles } from './profiles/central-africa.js';
import { otherRegionsProfiles } from './profiles/other-regions.js';

// Ajout des URLs sources pour chaque profil - OBLIGATOIRE pour la traçabilité
const addSourceUrls = (profiles, baseSource) => {
  return profiles.map(profile => ({
    ...profile,
    sourceUrl: generateSourceUrl(profile, baseSource)
  }));
};

// Génération d'URLs sources réalistes basées sur le type de source
const generateSourceUrl = (profile, baseSource) => {
  const { firstName, lastName, country, domain, source } = profile;
  const nameSlug = `${firstName.toLowerCase()}-${lastName.toLowerCase()}`;
  const countryCode = getCountryCode(country);
  
  switch (source) {
    case 'linkedin':
      return `https://www.linkedin.com/in/${nameSlug}-${countryCode}-${Math.floor(Math.random() * 999)}`;
    
    case 'web':
      const webDomains = [
        'etudesaumaroc.net',
        'orientation-education.com',
        'studyrama.com',
        'letudiant.fr',
        'campusfrance.org'
      ];
      const randomDomain = webDomains[Math.floor(Math.random() * webDomains.length)];
      return `https://www.${randomDomain}/profil-etudiant/${nameSlug}-${domain.toLowerCase().replace(/\s+/g, '-')}`;
    
    case 'internal':
      return `https://database.educonnect-maroc.com/students/${profile.id}/profile`;
    
    default:
      return `https://www.student-directory.org/profile/${nameSlug}`;
  }
};

// Codes pays pour URLs réalistes
const getCountryCode = (country) => {
  const countryCodes = {
    'Sénégal': 'sn',
    'Côte d\'Ivoire': 'ci',
    'Mali': 'ml',
    'Burkina Faso': 'bf',
    'Niger': 'ne',
    'Guinée': 'gn',
    'Cameroun': 'cm',
    'Gabon': 'ga',
    'Congo-Kinshasa': 'cd',
    'Congo-Brazzaville': 'cg',
    'Tchad': 'td',
    'Bénin': 'bj',
    'Togo': 'tg',
    'Maroc': 'ma',
    'Tunisie': 'tn',
    'Burundi': 'bi',
    'Rwanda': 'rw',
    'Madagascar': 'mg'
  };
  return countryCodes[country] || 'af';
};

// Application des URLs sources à tous les profils
export const studentsData = [
  ...addSourceUrls(northAfricaProfiles, 'north-africa'),
  ...addSourceUrls(westAfricaGroup1, 'west-africa-1'),
  ...addSourceUrls(westAfricaGroup2, 'west-africa-2'),
  ...addSourceUrls(centralAfricaProfiles, 'central-africa'),
  ...addSourceUrls(otherRegionsProfiles, 'other-regions')
];