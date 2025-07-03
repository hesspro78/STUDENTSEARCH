import { studentsData as rawProfiles } from '@/data/student-profiles';
import { validateAndFilterStudents } from '@/lib/real-contact-validator';

// Application de la validation stricte avec URLs sources - SUPPRESSION de tous les contacts fictifs
const validationResult = validateAndFilterStudents(rawProfiles);

// IMPORTANT: Seuls les profils avec contacts RÉELS, VÉRIFIÉS et URL SOURCE sont conservés
export const studentsData = validationResult.validStudents;
export const validationStats = validationResult.stats;
export const manualReviewQueue = validationResult.manualReviewQueue;
export const sourceDomainStats = validationResult.sourceDomainStats;

// Statistiques de qualité des contacts
export const contactQualityStats = {
  excellent: studentsData.filter(s => s.contactQuality === 'EXCELLENT').length,
  good: studentsData.filter(s => s.contactQuality === 'GOOD').length,
  emailOnly: studentsData.filter(s => s.emailStatus === 'VERIFIED' && s.phoneStatus !== 'VERIFIED').length,
  phoneOnly: studentsData.filter(s => s.phoneStatus === 'VERIFIED' && s.emailStatus !== 'VERIFIED').length,
  totalValid: studentsData.length,
  withSourceUrl: studentsData.filter(s => s.sourceUrl).length
};

// Filtres pour l'interface
export const countries = [
  "Bénin", "Burkina Faso", "Burundi", "Cameroun", "Cap-Vert", "République Centrafricaine",
  "Comores", "Congo-Brazzaville", "Congo-Kinshasa", "Gabon", "Guinée", "Guinée-Bissau",
  "Guinée équatoriale", "Madagascar", "Mali", "Maroc", "Mauritanie", "Mozambique",
  "Niger", "Rwanda", "Sénégal", "Tchad", "Togo", "Côte d'Ivoire", "Tunisie"
].sort();

export const domains = [
  "Informatique", "Management", "Finance", "Marketing Digital",
  "Commerce", "Ressources Humaines", "Business Intelligence", "Big Data", "Comptabilité"
];

export const levels = ["Baccalauréat", "Licence", "Master"];

export const residencyStatus = [
  { id: 'resident', label: 'Résident au Maroc' },
  { id: 'non-resident', label: 'International' },
];

export const contactQualityFilters = [
  { id: 'excellent', label: 'Contact Excellent (Email + Téléphone)' },
  { id: 'good', label: 'Contact Valide (Email ou Téléphone)' },
  { id: 'email-only', label: 'Email Vérifié Uniquement' },
  { id: 'phone-only', label: 'Téléphone Vérifié Uniquement' }
];

export const emailProviders = [
  'gmail', 'yahoo', 'outlook', 'educational', 'other'
];

// Domaines d'email vérifiés disponibles
export const verifiedEmailDomains = [
  ...new Set(
    studentsData
      .filter(s => s.emailStatus === 'VERIFIED' && s.email)
      .map(s => s.email.split('@')[1])
  )
].sort();

// Domaines sources pour filtrage
export const sourceDomains = [
  ...new Set(
    studentsData
      .filter(s => s.sourceDomain)
      .map(s => s.sourceDomain)
  )
].sort();