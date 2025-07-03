
import { getSmtpConfigFromEmail } from '@/lib/smtp-config';

const validateSmtpConfig = (config) => {
  console.log("DEBUG: Validation de la configuration SMTP:", config);

  if (!config.smtpHost || !config.smtpPort || !config.senderEmail || !config.smtpPass) {
    const errorMessage = "Configuration SMTP incomplète. Veuillez vérifier tous les champs dans les Paramètres.";
    console.error("DEBUG: " + errorMessage);
    throw new Error(errorMessage);
  }

  const { config: expectedConfig, isKnown } = getSmtpConfigFromEmail(config.senderEmail);

  if (isKnown) {
    if (config.smtpHost !== expectedConfig.smtpHost) {
      const errorMessage = `Serveur SMTP incorrect pour ${config.senderEmail}. Attendu: ${expectedConfig.smtpHost}`;
      console.error("DEBUG: " + errorMessage);
      throw new Error(errorMessage);
    }
    if (config.smtpPort !== expectedConfig.smtpPort) {
      const errorMessage = `Port SMTP incorrect pour ${config.senderEmail}. Attendu: ${expectedConfig.smtpPort}`;
      console.error("DEBUG: " + errorMessage);
      throw new Error(errorMessage);
    }
    if (config.smtpSecure !== expectedConfig.smtpSecure) {
      const errorMessage = `Type de sécurité incorrect pour ${config.senderEmail}. Attendu: ${expectedConfig.smtpSecure.toUpperCase()}`;
      console.error("DEBUG: " + errorMessage);
      throw new Error(errorMessage);
    }
  }

  if (config.smtpPass.length < 8 || config.smtpPass.toLowerCase() === 'password') {
    const errorMessage = "Échec de l'authentification. Le mot de passe d'application semble invalide ou trop faible. Veuillez utiliser un mot de passe d'application généré par votre fournisseur de messagerie.";
    console.error("DEBUG: " + errorMessage);
    throw new Error(errorMessage);
  }
  
  if (config.senderEmail.includes("fail-auth")) {
    const errorMessage = "Échec de l'authentification. Vérifiez votre nom d'utilisateur et mot de passe d'application.";
    console.error("DEBUG: " + errorMessage);
    throw new Error(errorMessage);
  }
};

export const testSmtpConnection = async (config) => {
  console.log("DEBUG: Lancement du test de connexion SMTP...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        validateSmtpConfig(config);
        console.log("DEBUG: Test de connexion SMTP simulé avec succès.");
        resolve({ success: true, message: "Connexion SMTP réussie." });
      } catch (error) {
        console.error("DEBUG: Échec du test de connexion SMTP simulé.", error.message);
        reject(error);
      }
    }, 1500);
  });
};

export const sendEmail = async (config) => {
  console.log("DEBUG: Tentative d'envoi d'email...", config);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!config.to) {
        const errorMessage = "L'adresse email du destinataire est manquante.";
        console.error("DEBUG: " + errorMessage);
        return reject(new Error(errorMessage));
      }

      try {
        validateSmtpConfig(config);
        
        console.log(`DEBUG: Envoi d'email simulé de ${config.senderEmail} à ${config.to} via ${config.smtpHost}.`);
        
        if (config.to.includes("network-error")) {
          const errorMessage = "Échec de l'envoi : Impossible de se connecter au serveur SMTP. Vérifiez votre connexion internet et les paramètres du pare-feu.";
          console.error("DEBUG: " + errorMessage);
          return reject(new Error(errorMessage));
        }

        console.log("DEBUG: Email simulé envoyé avec succès.");
        return resolve({ success: true, message: "Email envoyé avec succès." });

      } catch (error) {
        console.error("DEBUG: Échec de l'envoi d'email simulé.", error.message);
        return reject(error);
      }
    }, 1500);
  });
};
