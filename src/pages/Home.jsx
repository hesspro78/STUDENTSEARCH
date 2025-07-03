
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search, Users, Globe, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const features = [
    {
      icon: Search,
      title: "Recherche Avancée",
      description: "Trouvez facilement des étudiants par domaine, pays et niveau d'études"
    },
    {
      icon: Users,
      title: "Profils Qualifiés",
      description: "Accédez à une base de données d'étudiants africains francophones motivés"
    },
    {
      icon: Globe,
      title: "Couverture Panafricaine",
      description: "Étudiants de plus de 23 pays africains francophones"
    },
    {
      icon: TrendingUp,
      title: "Statistiques Détaillées",
      description: "Suivez vos recherches et optimisez votre recrutement"
    }
  ];

  const domains = [
    "Informatique & Développement",
    "Management & Finance",
    "Marketing Digital",
    "Commerce International",
    "Ressources Humaines",
    "Business Intelligence",
    "Big Data & IA",
    "Cybersécurité"
  ];

  return (
    <>
      <Helmet>
        <title>EduConnect Maroc - Trouvez des Étudiants Africains Francophones</title>
        <meta name="description" content="Plateforme dédiée aux écoles supérieures marocaines pour rechercher et contacter des étudiants africains francophones souhaitant poursuivre leurs études au Maroc." />
      </Helmet>

      <div className="min-h-screen">
        <section className="gradient-bg text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-bold mb-6"
              >
                Connectez-vous aux
                <span className="block text-yellow-300">Talents Africains</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                La plateforme de référence pour les écoles supérieures marocaines 
                qui recherchent des étudiants africains francophones qualifiés
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/rechercher">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                    <Search className="mr-2 h-5 w-5" />
                    Commencer la Recherche
                  </Button>
                </Link>
                
                <Link to="/connexion">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg font-semibold"
                  >
                    Connexion École
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir EduConnect Maroc ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Une solution complète pour faciliter le recrutement d'étudiants africains
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center p-6 rounded-lg border border-gray-200 card-hover"
                  >
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Domaines d'Études Disponibles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Trouvez des étudiants spécialisés dans les secteurs qui vous intéressent
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {domains.map((domain, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-3 card-hover"
                >
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{domain}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à Découvrir de Nouveaux Talents ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez les écoles qui font confiance à EduConnect Maroc pour leur recrutement international
              </p>
              <Link to="/rechercher">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                  <Search className="mr-2 h-5 w-5" />
                  Explorer les Profils
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
