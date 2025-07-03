import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Search as SearchIcon, Filter, MapPin, GraduationCap, Mail, Heart, Eye, X, Linkedin, Rss, Loader2, History, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { studentsData, countries, domains, levels, residencyStatus, emailStatuses, emailDomains, emailValidationStats } from '@/data/enhanced-students';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useSettings } from '@/hooks/useSettings';
import EmailVerificationBadge from '@/components/EmailVerificationBadge';
import EmailValidationStats from '@/components/EmailValidationStats';
import { getEmailDomain, getEmailProvider, EMAIL_PROVIDERS } from '@/lib/email-validator';

const Search = () => {
  const { user } = useAuth();
  const { toggleFavorite, isFavorite, addToViewed, addToContacted } = useFavorites();
  const { settings } = useSettings();
  const { history, addSearchTerm } = useSearchHistory();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedResidency, setSelectedResidency] = useState([]);
  const [selectedEmailStatuses, setSelectedEmailStatuses] = useState([]);
  const [selectedEmailDomains, setSelectedEmailDomains] = useState([]);
  const [showOnlyVerifiedEmails, setShowOnlyVerifiedEmails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidationStats, setShowValidationStats] = useState(false);

  const handleFilterChange = (setter, value) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };
  
  const executeSearch = () => {
    addSearchTerm(searchTerm);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedCountries, selectedDomains, selectedLevels, selectedResidency, selectedEmailStatuses, selectedEmailDomains, showOnlyVerifiedEmails]);

  const filteredStudents = useMemo(() => {
    return studentsData.filter(student => {
      const matchesSearch = searchTerm === '' || 
        `${student.firstName} ${student.lastName} ${student.domain} ${student.specialization} ${student.country} ${student.bio}`
        .toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(student.country);
      const matchesDomain = selectedDomains.length === 0 || selectedDomains.includes(student.domain);
      const matchesLevel = selectedLevels.length === 0 || selectedLevels.includes(student.level);
      const matchesResidency = selectedResidency.length === 0 ||
        (selectedResidency.includes('resident') && student.residentInMorocco) ||
        (selectedResidency.includes('non-resident') && !student.residentInMorocco);
      
      // Email status filtering
      const matchesEmailStatus = selectedEmailStatuses.length === 0 || 
        selectedEmailStatuses.some(status => {
          switch (status) {
            case 'verified': return student.emailStatus === 'VERIFIED';
            case 'invalid': return student.emailStatus === 'INVALID';
            case 'manual': return student.emailStatus === 'MANUAL_VERIFICATION_NEEDED';
            default: return false;
          }
        });

      // Email domain filtering
      const matchesEmailDomain = selectedEmailDomains.length === 0 || 
        (student.email && selectedEmailDomains.some(domain => student.email.includes(domain)));

      const matchesVerifiedEmails = !showOnlyVerifiedEmails || student.emailStatus === 'VERIFIED';

      return matchesSearch && matchesCountry && matchesDomain && matchesLevel && 
             matchesResidency && matchesEmailStatus && matchesEmailDomain && matchesVerifiedEmails;
    }).sort((a, b) => {
      // Sort by email verification status first, then by name
      if (a.emailStatus === 'VERIFIED' && b.emailStatus !== 'VERIFIED') return -1;
      if (a.emailStatus !== 'VERIFIED' && b.emailStatus === 'VERIFIED') return 1;
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
  }, [searchTerm, selectedCountries, selectedDomains, selectedLevels, selectedResidency, selectedEmailStatuses, selectedEmailDomains, showOnlyVerifiedEmails]);
  
  const getFilterCounts = useCallback(() => {
    const counts = { countries: {}, domains: {}, levels: {}, emailDomains: {} };
    
    studentsData.forEach(s => {
      counts.countries[s.country] = (counts.countries[s.country] || 0) + 1;
      counts.domains[s.domain] = (counts.domains[s.domain] || 0) + 1;
      counts.levels[s.level] = (counts.levels[s.level] || 0) + 1;
      
      if (s.email && s.emailStatus === 'VERIFIED') {
        const domain = getEmailDomain(s.email);
        if (domain) {
          counts.emailDomains[domain] = (counts.emailDomains[domain] || 0) + 1;
        }
      }
    });

    return counts;
  }, []);

  const filterCounts = getFilterCounts();

  const handleFavoriteToggle = (studentId) => {
    if (!user) { toast({ title: "Connexion requise", description: "Veuillez vous connecter pour ajouter des favoris.", variant: "destructive" }); return; }
    const isNowFavorite = toggleFavorite(studentId);
    toast({ title: isNowFavorite ? "Ajouté aux favoris" : "Retiré des favoris" });
  };

  const handleViewProfile = (studentId) => { if (user) { addToViewed(studentId); } };

  const clearFilters = () => {
    setSearchTerm(''); 
    setSelectedCountries([]); 
    setSelectedDomains([]); 
    setSelectedLevels([]); 
    setSelectedResidency([]);
    setSelectedEmailStatuses([]);
    setSelectedEmailDomains([]);
    setShowOnlyVerifiedEmails(false);
  };

  const quickSearch = (term) => { setSearchTerm(term); addSearchTerm(term); };

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

  const FilterGroup = ({ title, items, selectedItems, onchange, counts, isResidency = false, isEmailStatus = false }) => (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="max-h-60 overflow-y-auto pr-2">
        {items.map(item => {
          const id = (isResidency || isEmailStatus) ? item.id : item;
          const label = (isResidency || isEmailStatus) ? item.label : item;
          const count = counts ? counts[label] || counts[item] : 0;
          return (
            <div key={id} className="flex items-center justify-between space-x-2 py-1">
              <div className="flex items-center space-x-2">
                <Checkbox id={`${title}-${id}`} checked={selectedItems.includes(id)} onCheckedChange={() => onchange(id)} />
                <Label htmlFor={`${title}-${id}`} className="font-normal text-gray-700 cursor-pointer">{label}</Label>
              </div>
              {counts && <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
  
  const SourceBadge = ({ source }) => {
    switch (source) {
      case 'linkedin': return <Badge variant="info"><Linkedin className="h-3 w-3 mr-1" /> LinkedIn</Badge>;
      case 'web': return <Badge variant="success"><Rss className="h-3 w-3 mr-1" /> Web</Badge>;
      case 'internal': return <Badge variant="secondary">Interne</Badge>;
      default: return null;
    }
  };

  return (
    <>
      <Helmet><title>Rechercher des Étudiants - EduConnect Maroc</title><meta name="description" content="Recherchez et trouvez des étudiants africains francophones avec validation email avancée." /></Helmet>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Recherche de Profils Étudiants</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Notre moteur de recherche avancé avec validation email stricte vous connecte aux meilleurs talents.</p>
            <div className="mt-4 flex justify-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowValidationStats(!showValidationStats)}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>{showValidationStats ? 'Masquer' : 'Voir'} les statistiques de validation</span>
              </Button>
            </div>
          </div>

          {showValidationStats && (
            <div className="mb-8">
              <EmailValidationStats stats={emailValidationStats} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <div className="relative mb-2">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input type="text" placeholder="Spécialisation, compétence..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleKeyDown} className="pl-10 text-base py-2"/>
                </div>
                <Button onClick={executeSearch} className="w-full mb-4">Rechercher</Button>
                
                {history.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center"><History className="w-4 h-4 mr-1"/>Recherches récentes</h4>
                    <div className="flex flex-wrap gap-1">
                      {history.map((term, i) => <Button key={i} variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" onClick={() => quickSearch(term)}>{term}</Button>)}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center mb-4 border-t pt-4">
                  <h2 className="text-lg font-bold flex items-center"><Filter className="h-5 w-5 mr-2"/>Filtres</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-600 hover:bg-red-50"><X className="h-4 w-4 mr-1" />Effacer</Button>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">Validation Email</h3>
                    <div className="flex items-center space-x-2 py-1">
                      <Checkbox id="show-verified-emails" checked={showOnlyVerifiedEmails} onCheckedChange={() => setShowOnlyVerifiedEmails(prev => !prev)} />
                      <Label htmlFor="show-verified-emails" className="font-normal text-gray-700 cursor-pointer">Emails vérifiés uniquement</Label>
                    </div>
                  </div>
                  
                  <FilterGroup title="Statut Email" items={emailStatuses} selectedItems={selectedEmailStatuses} onchange={(value) => handleFilterChange(setSelectedEmailStatuses, value)} isEmailStatus={true} />
                  <FilterGroup title="Domaine Email" items={emailDomains} selectedItems={selectedEmailDomains} onchange={(value) => handleFilterChange(setSelectedEmailDomains, value)} counts={filterCounts.emailDomains} />
                  <FilterGroup title="Statut" items={residencyStatus} selectedItems={selectedResidency} onchange={(value) => handleFilterChange(setSelectedResidency, value)} isResidency={true} />
                  <FilterGroup title="Pays d'origine" items={countries} selectedItems={selectedCountries} onchange={(value) => handleFilterChange(setSelectedCountries, value)} counts={filterCounts.countries}/>
                  <FilterGroup title="Domaine" items={domains} selectedItems={selectedDomains} onchange={(value) => handleFilterChange(setSelectedDomains, value)} counts={filterCounts.domains}/>
                  <FilterGroup title="Niveau" items={levels} selectedItems={selectedLevels} onchange={(value) => handleFilterChange(setSelectedLevels, value)} counts={filterCounts.levels}/>
                </div>
              </Card>
            </aside>
            
            <main className="lg:col-span-3">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  <span className="font-semibold">{filteredStudents.length}</span> profil(s) trouvé(s)
                  {showOnlyVerifiedEmails && <Badge variant="verified" className="ml-2">Emails vérifiés</Badge>}
                </p>
                <AnimatePresence>
                  {isLoading && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center text-sm text-blue-600"><Loader2 className="h-4 w-4 mr-2 animate-spin"/>Recherche en cours...</motion.div>}
                </AnimatePresence>
              </div>
              
              <AnimatePresence>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (<Card key={i} className="p-6 h-[320px] bg-gray-100 animate-pulse"></Card>))}
                  </div>
                ) : filteredStudents.length > 0 ? (
                  <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredStudents.map((student) => (
                      <motion.div key={student.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20}} transition={{ duration: 0.3 }}>
                        <Card className="p-6 card-hover relative h-full flex flex-col bg-white">
                          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                            <SourceBadge source={student.source} />
                            <button onClick={() => handleFavoriteToggle(student.id)} className="p-2 rounded-full bg-white/50 hover:bg-gray-100 transition-colors">
                              <Heart className={`h-5 w-5 ${isFavorite(student.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                            </button>
                          </div>
                          
                          <div className="flex-1 flex flex-col">
                            <div className="text-center mb-4">
                              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-4 border-white shadow-md">
                                <span className="text-3xl font-bold text-blue-600">{student.firstName[0]}{student.lastName[0]}</span>
                              </div>
                              <h3 className="text-xl font-semibold text-gray-900 mt-3 mb-1">{student.firstName} {student.lastName}</h3>
                              <div className="flex items-center justify-center text-gray-600 text-sm mb-2">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                <span>{student.city}, {student.country}</span>
                              </div>
                              <EmailVerificationBadge 
                                email={student.email}
                                status={student.emailStatus}
                                verifiedAt={student.emailVerifiedAt}
                                source={student.emailSource}
                              />
                            </div>
                            
                            <div className="space-y-3 mb-4 flex-grow">
                              <Badge variant="secondary" className="w-full justify-center py-1">{student.domain}</Badge>
                              <p className="text-sm text-center text-gray-600 px-2 h-10">{student.specialization}</p>
                              <div className="flex items-center justify-center text-sm text-gray-600 pt-1">
                                <GraduationCap className="h-4 w-4 mr-1" />
                                <span>Niveau souhaité : {student.level}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mt-auto pt-4 border-t">
                            <Button asChild variant="outline" className="w-full flex items-center justify-center space-x-2">
                              <Link to={`/profil/${student.id}`} onClick={() => handleViewProfile(student.id)}>
                                <Eye className="h-4 w-4" /><span>Voir le profil</span>
                              </Link>
                            </Button>
                            <Button 
                              onClick={() => handleContactClick(student)} 
                              disabled={student.emailStatus !== 'VERIFIED'} 
                              className="w-full flex items-center justify-center space-x-2"
                            >
                              <Mail className="h-4 w-4" />
                              <span>{student.emailStatus === 'VERIFIED' ? 'Contacter' : 'Email non vérifié'}</span>
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-16">
                    <SearchIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun profil ne correspond</h3>
                    <p className="text-gray-600 mb-4">Essayez d'élargir votre recherche ou d'ajuster les filtres.</p>
                    <Button onClick={clearFilters} variant="outline">Réinitialiser les filtres</Button>
                  </div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;