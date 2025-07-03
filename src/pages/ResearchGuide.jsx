
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Globe, Map, Search, Terminal, Lightbulb, CheckCircle, Linkedin, Rss, Shield, Bot, Server } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ResearchGuide = () => {
  return (
    <>
      <Helmet>
        <title>Guide de Recherche Avancée - EduConnect Maroc</title>
        <meta name="description" content="Apprenez à optimiser vos recherches d'étudiants sur EduConnect Maroc avec notre guide spécialisé, incluant des stratégies de sourcing de données." />
      </Helmet>
      <div className="min-h-screen bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Guide de Recherche & Sourcing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Maîtrisez nos outils et découvrez des stratégies pour trouver les talents parfaits.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center space-x-2"><Search className="text-green-600" /><span>Utilisation des Filtres</span></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-gray-700">Combinez nos filtres pour un ciblage chirurgical :</p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><span className="font-semibold">Score de Pertinence :</span> Identifiez rapidement les meilleurs profils.</li>
                    <li><span className="font-semibold">Filtres Multiples :</span> Sélectionnez plusieurs pays, domaines et niveaux.</li>
                    <li><span className="font-semibold">Historique de Recherche :</span> Relancez vos requêtes fréquentes en un clic.</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center space-x-2"><Lightbulb className="text-yellow-500" /><span>Conseils de Pro</span></CardTitle></CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-800 mb-2">Élargir la recherche :</h4>
                  <p className="text-gray-700 mb-3">Utilisez des termes généraux (ex: "Informatique") et sélectionnez plusieurs pays.</p>
                  <h4 className="font-semibold text-gray-800 mb-2">Affiner la recherche :</h4>
                  <p className="text-gray-700">Utilisez des spécialisations précises (ex: "Chef de produit numérique") et ciblez un pays et un niveau spécifiques.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Bot className="text-purple-600 h-8 w-8" />
                  <span>Stratégie de Sourcing Externe (Scraping)</span>
                </CardTitle>
                <p className="text-gray-600 pt-2">Pour aller plus loin, voici une stratégie conceptuelle pour collecter des profils depuis des sources publiques. <span className="font-bold">Ceci est un guide théorique.</span></p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><Globe className="h-5 w-5 mr-2 text-blue-500"/>Sources Potentielles</h3>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="info">LinkedIn (profils publics)</Badge>
                        <Badge variant="destructive">Forums étudiants (Etudesaumaroc.net)</Badge>
                        <Badge variant="default">Groupes Facebook/WhatsApp publics</Badge>
                        <Badge variant="secondary">Google Search (avec opérateurs avancés)</Badge>
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><Terminal className="h-5 w-5 mr-2 text-gray-700"/>Exemples de Requêtes (Google Dorking)</h3>
                    <ul className="space-y-2 text-sm">
                        <li><code className="bg-gray-200 p-1 rounded">site:linkedin.com/in "étudiant en informatique" "recherche master au Maroc"</code></li>
                        <li><code className="bg-gray-200 p-1 rounded">inurl:etudesaumaroc.net "licence en management"</code></li>
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center"><Shield className="h-5 w-5 mr-2 text-red-500"/>Considérations Techniques (Anti-Blocage)</h3>
                     <p className="text-gray-700 mb-2">Un scraping éthique et efficace nécessite :</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><span className="font-semibold">Rotation de Proxies/IP :</span> Pour ne pas être bloqué par les serveurs.</li>
                        <li><span className="font-semibold">User-Agents variés :</span> Pour simuler des navigateurs différents.</li>
                        <li><span className="font-semibold">Délais Aléatoires :</span> Pour imiter un comportement humain et ne pas surcharger les sites.</li>
                    </ul>
                </div>
                 <p className="mt-4 text-sm text-gray-600 italic">Note : Le scraping doit toujours respecter les conditions d'utilisation des plateformes cibles et les lois sur la protection des données (RGPD, etc.). Cette stratégie est fournie à titre indicatif.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ResearchGuide;
