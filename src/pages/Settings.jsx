
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Save, FileText, Info, Server, TestTube, Send, Loader2, Eye, EyeOff, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { toast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sendEmail, testSmtpConnection } from '@/lib/email';
import { getSmtpConfigFromEmail } from '@/lib/smtp-config';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { settings, saveSettings, loading } = useSettings();
  
  const [formData, setFormData] = useState(settings);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [isKnownProvider, setIsKnownProvider] = useState(false);
  
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isConnectionTested, setIsConnectionTested] = useState(false);
  const [connectionTestStatus, setConnectionTestStatus] = useState(null);

  const [testSendEmail, setTestSendEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleEmailChange = useCallback((email) => {
    const { config, isKnown } = getSmtpConfigFromEmail(email);
    setIsKnownProvider(isKnown);
    setConnectionTestStatus(null);
    setIsConnectionTested(false);
    
    if (isKnown) {
      setFormData(prev => ({ ...prev, senderEmail: email, ...config, smtpPass: prev.smtpPass }));
    } else {
       setFormData(prev => ({ ...prev, senderEmail: email, smtpHost: '', smtpPort: '', smtpSecure: 'tls' }));
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/connexion');
    }
    if (!loading && user) {
      const initialFormData = { ...settings };
      setFormData(initialFormData);
      handleEmailChange(initialFormData.senderEmail);
    }
  }, [user, loading, navigate, settings, handleEmailChange]);


  const handleFormValueChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setConnectionTestStatus(null);
    setIsConnectionTested(false);
  };
  
  const handleSelectChange = (value) => {
    setFormData({ ...formData, smtpSecure: value });
    setConnectionTestStatus(null);
    setIsConnectionTested(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnectionTested || connectionTestStatus !== 'success') {
      toast({
        title: "Test de connexion requis",
        description: "Veuillez d'abord tester la connexion SMTP avec succès avant d'enregistrer.",
        variant: "destructive"
      });
      return;
    }

    const success = saveSettings(formData);
    if (success) {
      toast({
        title: "Paramètres enregistrés",
        description: "Vos modifications ont été sauvegardées avec succès.",
        variant: "success",
      });
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres.",
        variant: "destructive"
      });
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    setConnectionTestStatus('testing');
    try {
      await testSmtpConnection(formData);
      setConnectionTestStatus('success');
      setIsConnectionTested(true);
      toast({ title: "Connexion réussie", description: "Vos paramètres SMTP sont corrects.", variant: "success" });
    } catch (error) {
      setConnectionTestStatus('error');
      setIsConnectionTested(false);
      toast({ title: "Échec de la connexion", description: error.message || "Veuillez vérifier vos paramètres.", variant: "destructive" });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleTestSend = async () => {
    if (!testSendEmail) {
      toast({ title: "Adresse email requise", description: "Veuillez saisir une adresse email pour le test.", variant: "destructive" });
      return;
    }

    if (!isConnectionTested || connectionTestStatus !== 'success') {
      toast({ title: "Configuration non validée", description: "Veuillez d'abord réussir le test de connexion dans l'onglet de configuration.", variant: "destructive" });
      return;
    }

    setIsSendingTest(true);
    try {
      await sendEmail({
        ...formData,
        to: testSendEmail,
        subject: "Email de test - EduConnect Maroc",
        body: "Ceci est un test pour vérifier la configuration d’envoi d’email de votre école."
      });
      toast({ title: "Email de test envoyé !", description: `Un email de test a été envoyé à ${testSendEmail}.`, variant: "success" });
    } catch (error) {
      toast({ title: "Échec de l'envoi", description: error.message || "Impossible d'envoyer l'email de test.", variant: "destructive" });
    } finally {
      setIsSendingTest(false);
    }
  };
  
  if (loading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Helmet>
        <title>Paramètres - EduConnect Maroc</title>
        <meta name="description" content="Gérez les paramètres de votre compte école sur EduConnect Maroc." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Paramètres</h1>
            <p className="text-xl text-gray-600">Gérez vos préférences et la configuration de l'envoi d'emails.</p>
          </motion.div>

          <Tabs defaultValue="config" className="mt-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config"><Server className="h-4 w-4 mr-2" />Configuration Email</TabsTrigger>
              <TabsTrigger value="general"><FileText className="h-4 w-4 mr-2" />Modèle de Message</TabsTrigger>
              <TabsTrigger value="test"><Send className="h-4 w-4 mr-2" />Test d'envoi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration SMTP Automatique</CardTitle>
                  <CardDescription>Saisissez votre email, et nous tenterons de configurer le reste pour vous.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">Adresse email d'envoi</Label>
                    <Input id="senderEmail" name="senderEmail" type="email" value={formData.senderEmail} onChange={(e) => handleEmailChange(e.target.value)} placeholder="contact@votre-ecole.ma" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Nom de l'expéditeur</Label>
                    <Input id="senderName" name="senderName" value={formData.senderName} onChange={handleFormValueChange} placeholder="Nom de votre école" />
                    <p className="text-sm text-muted-foreground">Ce nom apparaîtra dans les emails envoyés.</p>
                  </div>

                  <AnimatePresence>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden border-t pt-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="smtpHost">Serveur SMTP</Label>
                          <Input id="smtpHost" name="smtpHost" value={formData.smtpHost} onChange={handleFormValueChange} placeholder="smtp.example.com" disabled={isKnownProvider} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="smtpPort">Port</Label>
                          <Input id="smtpPort" name="smtpPort" value={formData.smtpPort} onChange={handleFormValueChange} placeholder="587" disabled={isKnownProvider}/>
                        </div>
                      </div>

                       <div className="space-y-2">
                        <Label htmlFor="smtpPass">Mot de passe d'application / SMTP</Label>
                        <div className="relative">
                          <Input id="smtpPass" name="smtpPass" type={showSmtpPass ? 'text' : 'password'} value={formData.smtpPass} onChange={handleFormValueChange} placeholder="••••••••" />
                          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowSmtpPass(!showSmtpPass)}>
                            {showSmtpPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="smtpSecure">Sécurité</Label>
                        <Select onValueChange={handleSelectChange} value={formData.smtpSecure} disabled={isKnownProvider}>
                          <SelectTrigger id="smtpSecure"><SelectValue placeholder="Choisir le type de sécurité" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tls">TLS</SelectItem>
                            <SelectItem value="ssl">SSL</SelectItem>
                            <SelectItem value="none">Aucune</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  
                  <div className="bg-sky-50 border border-sky-200 text-sky-800 text-sm rounded-md p-3 flex items-start space-x-3">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                          <p className="font-semibold">Alternative à la configuration manuelle</p>
                          <p className="mt-1">
                              Si vous rencontrez des difficultés, des services comme <strong>EmailJS, Brevo, ou SendGrid</strong> peuvent simplifier l'envoi d'emails.
                          </p>
                      </div>
                  </div>

                  <CardFooter className="flex-col items-start p-0 pt-4 gap-4">
                      <div className="flex items-center gap-4">
                         <Button type="button" onClick={handleTestConnection} disabled={isTestingConnection}>
                          {isTestingConnection ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TestTube className="h-4 w-4 mr-2" />}
                          {isTestingConnection ? 'Test en cours...' : 'Tester la connexion'}
                        </Button>
                        {connectionTestStatus === 'success' && <div className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-1"/>Connexion réussie</div>}
                        {connectionTestStatus === 'error' && <div className="flex items-center text-red-600"><XCircle className="h-4 w-4 mr-1"/>Échec de la connexion</div>}
                      </div>
                     <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md p-3 flex items-start space-x-3">
                       <HelpCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold">Mot de passe d'application requis</p>
                          <p className="mt-1">
                            Pour des raisons de sécurité, la plupart des services (comme Gmail) nécessitent un "mot de passe d'application" spécifique plutôt que votre mot de passe habituel.
                          </p>
                        </div>
                      </div>
                  </CardFooter>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="general">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Modèle de Message par Défaut</CardTitle>
                    <CardDescription>Ce texte sera pré-rempli lorsque vous contacterez un étudiant.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea id="messageTemplate" name="messageTemplate" rows={12} value={formData.messageTemplate} onChange={handleFormValueChange} />
                    <div className="mt-3 bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md p-3 flex items-start space-x-3">
                      <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Astuce : Utilisez des placeholders !</p>
                        <p className="mt-1">
                          <code className="bg-blue-200/50 p-1 rounded">[Prénom Étudiant]</code> et <code className="bg-blue-200/50 p-1 rounded">[Nom de l'école]</code> seront remplacés automatiquement.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                   <CardFooter>
                    <Button type="submit" disabled={!isConnectionTested || connectionTestStatus !== 'success'}>
                      <Save className="h-4 w-4 mr-2" />
                      Enregistrer les modifications
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="test">
              <Card>
                <CardHeader>
                  <CardTitle>Tester l'envoi d'email</CardTitle>
                  <CardDescription>
                    Envoyez un email de test pour vérifier que votre configuration fonctionne correctement.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="testSendEmail">Adresse email de destination</Label>
                    <Input
                      id="testSendEmail"
                      type="email"
                      value={testSendEmail}
                      onChange={(e) => setTestSendEmail(e.target.value)}
                      placeholder="adresse@test.com"
                    />
                  </div>
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm rounded-md p-3 flex items-start space-x-3">
                     <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
                     <p>L'envoi de test utilisera la configuration renseignée. Assurez-vous d'avoir testé la connexion avec succès avant d'envoyer.</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="button" onClick={handleTestSend} disabled={isSendingTest}>
                     {isSendingTest ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                     {isSendingTest ? "Envoi en cours..." : "Envoyer l'email de test"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Settings;
