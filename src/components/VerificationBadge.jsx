import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, ShieldAlert, AlertTriangle } from 'lucide-react';

const VerificationBadge = ({ status, className }) => {
  if (status === 'verified') {
    return <Badge variant="verified" className={className}><Mail className="h-3 w-3 mr-1" /> Contact vérifié</Badge>;
  }
  if (status === 'uncertain') {
    return <Badge variant="warning" className={className}><ShieldAlert className="h-3 w-3 mr-1" /> Données Incertaines</Badge>;
  }
  if (status === 'manual_verification_needed') {
    return <Badge variant="manual" className={className}><AlertTriangle className="h-3 w-3 mr-1" /> Email indisponible - vérifier manuellement</Badge>;
  }
  return null;
};

export default VerificationBadge;