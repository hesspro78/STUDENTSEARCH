import { studentsData as rawProfiles } from '@/data/student-profiles';
import { processStudentData } from '@/lib/enhanced-data-processor';

// Process all student data with enhanced email validation
const { profiles: processedProfiles, validationStats } = processStudentData(rawProfiles);

export const studentsData = processedProfiles;
export const emailValidationStats = validationStats;

// Export filtering utilities
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

export const emailStatuses = [
  { id: 'verified', label: 'Email vérifié' },
  { id: 'invalid', label: 'Email invalide' },
  { id: 'manual', label: 'Vérification manuelle requise' }
];

export const emailDomains = [
  'gmail.com', 'yahoo.com', 'yahoo.fr', 'outlook.com', 'hotmail.com', 'hotmail.fr'
];