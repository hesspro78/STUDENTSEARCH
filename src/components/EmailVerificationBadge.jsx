import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, ShieldAlert, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getEmailProvider, EMAIL_PROVIDERS } from '@/lib/email-validator';

const EmailVerificationBadge = ({ email, status, verifiedAt, source, className }) => {
  if (!email && status !== 'MANUAL_VERIFICATION_NEEDED') {
    return null;
  }

  const getBadgeConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle,
          text: '📧 Verified Contact',
          variant: 'verified',
          color: 'text-green-600'
        };
      case 'PENDING_VERIFICATION':
        return {
          icon: Clock,
          text: '⏳ Verification Pending',
          variant: 'warning',
          color: 'text-yellow-600'
        };
      case 'INVALID':
        return {
          icon: XCircle,
          text: '❌ Invalid Email',
          variant: 'destructive',
          color: 'text-red-600'
        };
      case 'MANUAL_VERIFICATION_NEEDED':
        return {
          icon: AlertTriangle,
          text: '⚠️ Email unavailable - requires manual verification',
          variant: 'manual',
          color: 'text-amber-600'
        };
      default:
        return {
          icon: ShieldAlert,
          text: 'Unknown Status',
          variant: 'secondary',
          color: 'text-gray-600'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;
  const provider = email ? getEmailProvider(email) : null;
  const providerConfig = provider ? EMAIL_PROVIDERS[provider] : null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        <span>{config.text}</span>
      </Badge>
      
      {email && status === 'VERIFIED' && (
        <div className="flex flex-wrap gap-1">
          {providerConfig && (
            <Badge variant="outline" className={`text-xs ${providerConfig.color}`}>
              {providerConfig.name}
            </Badge>
          )}
          {verifiedAt && (
            <Badge variant="outline" className="text-xs text-gray-600">
              Verified {new Date(verifiedAt).toLocaleDateString()}
            </Badge>
          )}
          {source && (
            <Badge variant="outline" className="text-xs text-blue-600">
              Source: {source}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailVerificationBadge;