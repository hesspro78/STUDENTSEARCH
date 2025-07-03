import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { ArrowLeft, MapPin, GraduationCap, Mail, Phone, Heart, Info, Linkedin, Rss, Users, Shield, CheckCircle, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { studentsData } from '@/data/real-students-data';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { findSimilarProfiles } from '@/lib/scoring';
import SimilarProfileCard from '@/components/SimilarProfileCard';
import { useSettings } from '@/hooks/useSettings';
import ContactQualityBadge from '@/components/ContactQualityBadge';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings } = useSettings();
  const { toggleFavorite, isFavorite, addToViewed, addToContacted } = useFavorites();

  const student = studentsData.find(s => s.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (student && user) {
      addToViewed(student.id);
    }
  }, [student, user, addToViewed, id]);
  
  const similarProfiles = useMemo(() => {
    if (!student) return [];
    return findSimilarProfiles(student, studentsData, 3);
  }, [student]);

  const SourceBadge = ({ source }) => {
    switch (source) {
      case 'linkedin':
        return <Badge variant="info"><Linkedin className="h-3 w-3 mr-1" /> Source: LinkedIn</Badge>;
      case 'web':
        return <Badge variant="success"><Rss className="h-3 w-3 mr-1" /> Source: Web</Badge>;
      case 'internal':
        return <Badge variant="secondary">Source: Interne</Badge>;
      default:
        return null;
    }
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profil non trouvé</h2>
          <Button onClick={() => navigate('/rechercher')}>
            Retour à la recherche
          </Button>
        </div>
      </div>
    );
  }

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour ajouter des favoris.",
        variant: "destructive"
      });
      return;
    }
    const isNowFavorite = toggleFavorite(student.id);
    toast({
      title: isNowFavorite ? "Ajouté aux favoris" : "Retiré des favoris",
    });
  };

  const handleContactClick = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour contacter un étudiant.",
        variant: "destructive"
      });
      return;
    }
    
    if (student.emailStatus !== 'VERIFIED') {
      toast({ 
        title: "Email non vérifié", 
        description: "Seuls les emails vérifiés peuvent être contactés.", 
        variant: "destructive" 
      });
      return;
    }

    const subject = `Invitation de ${settings.senderName || (user ? user.schoolName : 'votre école')}`;
    const body = (settings.messageTemplate || `Bonjour ${student.firstName},\n\nVotre profil a retenu notre attention.`)
      .replace(/\[Prénom Étudiant\]/g, student.firstName)
      .replace(/\[Nom de l'école\]/g, settings.senderName || (user ? user.schoolName : 'votre école'));
    const mailtoLink = `mailto:${student.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    addToContacted(student.id);
    toast({
      title: "Client de messagerie ouvert",
      description: `La rédaction d'un email pour ${student.firstName} est prête.`,
      variant: "success",
    });
    window.location.href = mailtoLink;
  };

  const handleSourceClick = () => {
    if (student.sourceUrl) {
      window.open(student.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${student.firstName} ${student.lastName} - Profil Étudiant - EduConnect Maroc`}</title>
        <meta name="description" content={`Découvrez le profil de ${student.firstName} ${student.lastName}, étudiant en ${student.domain} de ${student.country}, avec contact vérifié et source tracée.`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Retour</span>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg">
                      <span className="text-5xl font-bold text-blue-600">{student.firstName[0]}{student.lastName[0]}</span>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {student.firstName} {student.lastName}
                    </h1>
                    <div className="flex items-center justify-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{student.city}, {student.country}</span>
                    </div>
                    <div className="mb-3">
                      <SourceBadge source={student.source} />
                    </div>
                    <ContactQualityBadge student={student} showSourceUrl={true} />
                    {student.hasValidContact && (
                      <Badge variant="verified" className="mt-2 flex items-center gap-1 justify-center">
                        <CheckCircle className="h-3 w-3" />
                        Contact Authentique Vérifié
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Button 
                      onClick={handleContactClick} 
                      disabled={student.emailStatus !== 'VERIFIED'} 
                      className="w-full flex items-center justify-center space-x-2 py-3"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{student.emailStatus === 'VERIFIED' ? 'Contacter l\'Étudiant' : 'Email non vérifié'}</span>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleFavoriteToggle} 
                      className={`w-full flex items-center justify-center space-x-2 py-3 ${isFavorite(student.id) ? 'text-red-600 border-red-200 hover:bg-red-50' : 'hover:bg-gray-50'}`}
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(student.id) ? 'fill-current' : ''}`} />
                      <span>{isFavorite(student.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                    </Button>

                    {student.sourceUrl && (
                      <Button 
                        variant="outline" 
                        onClick={handleSourceClick}
                        className="w-full flex items-center justify-center space-x-2 py-3 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Voir la Source</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Info className="h-5 w-5 text-gray-600" />
                      <span>À propos de {student.firstName}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{student.bio}</p>
                </CardContent>
              </Card>

              {/* Nouvelle section Traçabilité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                    <span>Traçabilité et Source</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <ExternalLink className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm text-purple-600 font-medium">URL Source</p>
                        <p className="font-mono text-sm text-gray-700 break-all">
                          {student.sourceUrl || 'Non disponible'}
                        </p>
                        {student.sourceDomain && (
                          <p className="text-xs text-purple-500 mt-1">
                            Domaine: {student.sourceDomain}
                          </p>
                        )}
                      </div>
                      {student.sourceUrl && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleSourceClick}
                          className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        >
                          Visiter
                        </Button>
                      )}
                    </div>
                    
                    {student.extractedAt && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Date d'extraction</p>
                          <p className="font-medium text-gray-900">
                            {new Date(student.extractedAt).toLocaleDateString('fr-FR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>Informations de Contact Vérifiées</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">
                            {student.emailStatus === 'VERIFIED' ? student.email : 'Non disponible'}
                          </p>
                          {student.emailStatus === 'VERIFIED' && student.emailVerifiedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Vérifié le {new Date(student.emailVerifiedAt).toLocaleDateString()}
                            </p>
                          )}
                          {student.emailSourceUrl && (
                            <p className="text-xs text-blue-600 mt-1 font-mono">
                              Source: {student.emailSourceUrl}
                            </p>
                          )}
                        </div>
                        <ContactQualityBadge student={student} className="ml-auto" />
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-600">Téléphone</p>
                          <p className="font-medium text-gray-900">
                            {student.phoneStatus === 'VERIFIED' ? student.phone : 'Non disponible'}
                          </p>
                          {student.phoneSourceUrl && (
                            <p className="text-xs text-blue-600 mt-1 font-mono">
                              Source: {student.phoneSourceUrl}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Connectez-vous pour accéder aux informations de contact vérifiées</p>
                      <Button onClick={() => navigate('/connexion')}>Se connecter</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <GraduationCap className="h-5 w-5 text-green-600" />
                    <span>Projet Académique</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Domaine d'Études</h4>
                      <p className="text-gray-700">{student.domain}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Spécialisation</h4>
                      <p className="text-gray-700">{student.specialization}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Niveau Souhaité</h4>
                      <p className="text-gray-700">{student.level}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Pays d'Origine</h4>
                      <p className="text-gray-700">{student.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
               
              {similarProfiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span>Profils Similaires avec Contacts Vérifiés</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {similarProfiles.map(p => <SimilarProfileCard key={p.id} student={p} />)}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfile;