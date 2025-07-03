import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const EmailValidationStats = ({ stats }) => {
  const validationStats = [
    {
      label: 'Verified Emails',
      value: stats.verified || 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Invalid Emails',
      value: stats.invalid || 0,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      label: 'Pending Verification',
      value: stats.pending || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Manual Review Required',
      value: stats.manualReview || 0,
      icon: AlertTriangle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    }
  ];

  const totalEmails = validationStats.reduce((sum, stat) => sum + stat.value, 0);
  const verificationRate = totalEmails > 0 ? ((stats.verified || 0) / totalEmails * 100).toFixed(1) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Email Validation Statistics</span>
          <Badge variant="info" className="text-sm">
            {verificationRate}% Verified
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {validationStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${stat.bgColor} p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>
        
        {totalEmails > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total Contacts</span>
              <span className="font-semibold">{totalEmails}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Verification Success Rate</span>
              <span className="font-semibold">{verificationRate}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailValidationStats;