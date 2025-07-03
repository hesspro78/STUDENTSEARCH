
import { studentsData as profiles } from '@/data/student-profiles';
import { enhanceStudentData } from '@/lib/data-enhancer';

export const studentsData = enhanceStudentData(profiles);

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
