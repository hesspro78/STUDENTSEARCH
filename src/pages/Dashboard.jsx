import React, { useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Heart, Eye, Users, TrendingUp, Star, MapPin, GraduationCap, Mail, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { studentsData, emailValidationStats } from '@/data/enhanced-students';
import { toast } from '@/components/ui/use-toast';
import { useSettings } from '@/hooks/useSettings';
import EmailVerificationBadge from '@/components/EmailVerificationBadge';
import EmailValidationStats from '@/components/EmailValidationStats';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { favorites, viewedProfiles, contactedProfiles, toggleFavorite, addToContacted } = useFavorites();

  useEffect(() => {
    if (!user) {
      navigate('/connexion');
    }
  }, [user, navigate]);

  const favoriteStudents = useMemo(() => studentsData.filter(student => favorites.includes(student.id)), [favorites]);
  
  const recommendedProfiles = useMemo(() => {
    if (favoriteStudents.length === 0) {
      // Return verified email profiles first
      return studentsData
        .filter(student => student.emailStatus === 'VERIFIED')
        .slice(0, 3);
    }
    
    const favoriteDomains = favoriteStudents.reduce((acc, student) => {
        acc[student.domain] = (acc[student.domain] || 0) + 1;
        return acc;
    }, {});

    const topDomain = Object.keys(favoriteDomains).sort((a,b) => favoriteDomains[b] - favoriteDomains[a])[0];

    return studentsData.filter(student => 
        student.domain === topDomain && 
        !favorites.includes(student.id) &&
        student.emailStatus === 'VERIFIED'
    ).slice(0, 3);
  }, [favorites, favoriteStudents]);

  if (!user) {
    return null;
  }

  const verifiedContactsCount = studentsData.filter(s => s.emailStatus === 'VERIFIED').length;
  const stats = [
    { title: "Profils Consultés", value: viewedProfiles.length, icon: Eye, color: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "Favoris", value: favorites.length, icon: Heart, color: "text-red-600", bgColor: "bg-red-100" },
    { title: "Contacts Initiés", value: contactedProfiles.length, icon: Mail, color: "text-green-600", bgColor: "bg-green-100" },
    { title: "Contacts Vérifiés", value: verifiedContactsCount, icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100" }
  ];

  const handleRemoveFavorite = (studentId) => {
    toggleFavorite(studentId);
    toast({ title: "Retiré des favoris", description: "L'étudiant a été retiré de vos favoris." });
  };

  const handleContactClick = (student) => {
    if (!user) {
      toast({ title: "Connexion requise", description: "Veuillez vous connecter pour contacter un étudiant.", variant: "destructive" });
      return;
    }
    if (!student.email || student.emailStatus !== 'VERIFIED') {
      toast({ title: "Contact non vérifié", description: "L'adresse email de cet étudiant n'est pas vérifiée.", variant: "destructive" });
      return;
    }

    const subject = `Invitation de ${settings.senderName || (user ? user.schoolName : 'votre école')}`;
    const body = (settings.messageTemplate || `Bonjour ${student.firstName},\n\nVotre profil a retenu notre attention.`)
      .replace(/\[Prénom Étudiant\]/g, student.firstName)
      .replace(/\[Nom de l'école\]/g, settings.senderName || (user ? user.schoolName : 'votre école'));
    const mailtoLink = `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    addToContacted(student.id);
    toast({ title: "Client de messagerie ouvert", description: `La rédaction d'un email pour ${student.firstName} est prête.`, variant: "success" });
    window.location.href = mailtoLink;
  };

  const StudentCard = ({ student, type }) => {
    return (
      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-white">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
          <span className="text-xl font-bold text-blue-600">{student.firstName[0]}{student.lastName[0]}</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{student.firstName} {student.lastName}</h4>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{student.country}</span>
          </div>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs mr-2">{student.domain}</Badge>
            <EmailVerificationBadge 
              email={student.email}
              status={student.emailStatus}
              className="inline-block"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {type === 'favorite' ? (
            <>
              <Button 
                size="sm" 
                onClick={() => handleContactClick(student)} 
                disabled={student.emailStatus !== 'VERIFIED'} 
                className="text-xs"
              >
                {student.emailStatus === 'VERIFIED' ? 'Contacter' : 'Non vérifié'}
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleRemoveFavorite(student.id)} className="text-xs text-red-600 hover:text-red-700">Retirer</Button>
            </>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link to={`/profil/${student.id}`}>Voir Profil</Link>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Tableau de Bord - EduConnect Maroc</title>
        <meta name="description" content="Gérez vos recherches d'étudiants, consultez vos favoris et suivez vos statistiques de recrutement sur EduConnect Maroc." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tableau de Bord</h1>
              <p className="text-xl text-gray-600">Bienvenue, <span className="font-semibold">{user.schoolName}</span></p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`${stat.bgColor} p-3 rounded-full`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mb-8">
            <EmailValidationStats stats={emailValidationStats} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center space-x-2"><Heart className="h-5 w-5 text-red-600" /><span>Mes Favoris ({favorites.length})</span></CardTitle></CardHeader>
                <CardContent>
                  {favoriteStudents.length > 0 ? (
                    <div className="space-y-4">
                      {favoriteStudents.slice(0, 3).map((student) => <StudentCard key={student.id} student={student} type="favorite" />)}
                      {favoriteStudents.length > 3 && <div className="text-center pt-4"><Button variant="outline" onClick={() => navigate('/rechercher')}>Voir tous les favoris</Button></div>}
                    </div>
                  ) : (
                    <div className="text-center py-8"><Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-600 mb-4">Aucun favori pour le moment</p><Button onClick={() => navigate('/rechercher')}>Découvrir des profils</Button></div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <Card>
                <CardHeader><CardTitle className="flex items-center space-x-2"><Star className="h-5 w-5 text-yellow-500" /><span>Profils Recommandés</span></CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                      {recommendedProfiles.map((student) => <StudentCard key={student.id} student={student} type="recommendation" />)}
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;