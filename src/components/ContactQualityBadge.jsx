import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Phone, AlertTriangle, Shield } from 'lucide-react';

const ContactQualityBadge = ({ student, className }) => {
  const getQualityConfig = () => {
    if (student.emailStatus === 'VERIFIED' && student.phoneStatus === 'VERIFIED') {
      return {
        icon: Shield,
        text: '🛡️ Contact Excellent',
        variant: 'verified',
        color: 'text-green-600'
      };
    }
    
    if (student.emailStatus === 'VERIFIED') {
      return {
        icon: Mail,
        text: '📧 Email Vérifié',
        variant: 'verified',
        color: 'text-blue-600'
      };
    }
    
    if (student.phoneStatus === 'VERIFIED') {
      return {
        icon: Phone,
        text: '📞 Téléphone Vérifié',
        variant: 'info',
        color: 'text-purple-600'
      };
    }

    return {
      icon: AlertTriangle,
      text: '⚠️ Contact Incomplet',
      variant: 'warning',
      color: 'text-amber-600'
    };
  };

  const config = getQualityConfig();
  const Icon = config.icon;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
      
      {student.emailProvider && student.emailStatus === 'VERIFIED' && (
        <Badge variant="outline" className="text-xs">
          {student.emailProvider.charAt(0).toUpperCase() + student.emailProvider.slice(1)}
        </Badge>
      )}
    </div>
  );
};

export default ContactQualityBadge;