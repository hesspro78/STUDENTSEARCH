import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const defaultTemplate = `Bonjour [Prénom Étudiant],

Nous avons examiné votre profil avec grand intérêt et nous pensons qu'il correspond parfaitement à nos programmes.

Nous serions ravis d'échanger avec vous.

Cordialement,
[Nom de l'école]`;

const getSettingsKey = (userId) => `educonnect_settings_${userId}`;

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    senderName: '',
    senderEmail: '',
    messageTemplate: defaultTemplate,
    useCustomSmtp: false,
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: 'tls',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      try {
        const key = getSettingsKey(user.email);
        const storedSettings = localStorage.getItem(key);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({
            senderName: parsedSettings.senderName || user.schoolName || '',
            senderEmail: parsedSettings.senderEmail || user.email,
            messageTemplate: parsedSettings.messageTemplate || defaultTemplate,
            useCustomSmtp: parsedSettings.useCustomSmtp || false,
            smtpHost: parsedSettings.smtpHost || '',
            smtpPort: parsedSettings.smtpPort || '',
            smtpUser: parsedSettings.smtpUser || '',
            smtpPass: parsedSettings.smtpPass || '',
            smtpSecure: parsedSettings.smtpSecure || 'tls',
          });
        } else {
          setSettings({
            senderName: user.schoolName || '',
            senderEmail: user.email,
            messageTemplate: defaultTemplate,
            useCustomSmtp: false,
            smtpHost: '',
            smtpPort: '',
            smtpUser: '',
            smtpPass: '',
            smtpSecure: 'tls',
          });
        }
      } catch (error) {
        console.error('Error reading settings from localStorage', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [user]);

  const saveSettings = useCallback((newSettings) => {
    if (user) {
      try {
        const key = getSettingsKey(user.email);
        const updatedSettings = { ...settings, ...newSettings };
        localStorage.setItem(key, JSON.stringify(updatedSettings));
        setSettings(updatedSettings);
        return true;
      } catch (error) {
        console.error('Error saving settings to localStorage', error);
        return false;
      }
    }
    return false;
  }, [user, settings]);

  return { settings, saveSettings, loading };
};