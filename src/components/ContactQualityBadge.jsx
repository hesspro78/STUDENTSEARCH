import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Phone, AlertTriangle, Shield, ExternalLink } from 'lucide-react';

const ContactQualityBadge = ({ student, className, showSourceUrl = false }) => {
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

  const handleSourceClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (student.sourceUrl) {
      window.open(student.sourceUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
      
      <div className="flex flex-wrap gap-1">
        {student.emailProvider && student.emailStatus === 'VERIFIED' && (
          <Badge variant="outline" className="text-xs">
            {student.emailProvider.charAt(0).toUpperCase() + student.emailProvider.slice(1)}
          </Badge>
        )}
        
        {showSourceUrl && student.sourceUrl && (
          <Badge 
            variant="secondary" 
            className="text-xs cursor-pointer hover:bg-gray-200 flex items-center gap-1"
            onClick={handleSourceClick}
            title={`Source: ${student.sourceDomain || 'URL disponible'}`}
          >
            <ExternalLink className="h-2 w-2" />
            <span>Source</span>
          </Badge>
        )}
        
        {student.extractedAt && (
          <Badge variant="outline" className="text-xs">
            Extrait: {new Date(student.extractedAt).toLocaleDateString()}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ContactQualityBadge;