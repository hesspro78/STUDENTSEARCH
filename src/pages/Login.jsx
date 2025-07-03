import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { GraduationCap, Mail, Lock, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    schoolName: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (formData.email && formData.password && formData.schoolName) {
        const userData = {
          email: formData.email,
          schoolName: formData.schoolName,
          loginTime: new Date().toISOString()
        };
        
        login(userData);
        
        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${formData.schoolName} sur EduConnect Maroc`,
        });
        
        navigate('/tableau-de-bord');
      } else {
        toast({
          title: "Erreur de connexion",
          description: "Veuillez remplir tous les champs",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Connexion École - EduConnect Maroc</title>
        <meta name="description" content="Connectez-vous à votre compte école pour accéder aux profils d'étudiants et gérer vos favoris sur EduConnect Maroc." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">EduConnect Maroc</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Connexion École
              </h2>
              <p className="text-gray-600">
                Accédez à votre espace de recherche d'étudiants
              </p>
            </div>

            <Card className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'École
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="schoolName"
                      name="schoolName"
                      type="text"
                      required
                      placeholder="Ex: École Supérieure de Commerce de Casablanca"
                      value={formData.schoolName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="contact@votre-ecole.ma"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de Passe
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 text-lg font-semibold"
                >
                  {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Pas encore de compte ?{' '}
                  <Link 
                    to="/inscription"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Créer un compte
                  </Link>
                </p>
              </div>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                🎯 Version Démo
              </h3>
              <p className="text-sm text-blue-700">
                Remplissez simplement tous les champs avec n'importe quelles valeurs pour accéder à la démo.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Login;