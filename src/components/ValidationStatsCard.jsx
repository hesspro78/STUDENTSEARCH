import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, AlertTriangle, Users, ExternalLink, Database } from 'lucide-react';

const ValidationStatsCard = ({ stats, contactStats, sourceDomainStats }) => {
  const topSourceDomains = sourceDomainStats ? 
    Object.entries(sourceDomainStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5) : [];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <span>Qualité des Contacts - Validation Stricte avec Traçabilité</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{contactStats.totalValid}</p>
            <p className="text-sm text-gray-600">Contacts Valides</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{contactStats.excellent}</p>
            <p className="text-sm text-gray-600">Excellents</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{stats.totalRejected}</p>
            <p className="text-sm text-gray-600">Rejetés</p>
          </div>
          
          <div className="text-center">
            <div className="bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.manualReviewPending}</p>
            <p className="text-sm text-gray-600">Vérif. Manuelle</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
              <Database className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">{stats.sourceUrlsTracked || 0}</p>
            <p className="text-sm text-gray-600">URLs Tracées</p>
          </div>
        </div>

        <div className="border-t pt-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Répartition par Qualité</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="verified" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Excellent: {contactStats.excellent}
            </Badge>
            <Badge variant="info" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Email: {contactStats.emailOnly}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Téléphone: {contactStats.phoneOnly}
            </Badge>
          </div>
        </div>

        {topSourceDomains.length > 0 && (
          <div className="border-t pt-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Top Sources de Données
            </h4>
            <div className="flex flex-wrap gap-2">
              {topSourceDomains.map(([domain, count]) => (
                <Badge key={domain} variant="outline" className="flex items-center gap-1">
                  <span className="font-mono text-xs">{domain}</span>
                  <span className="bg-gray-200 text-gray-700 px-1 rounded text-xs">{count}</span>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>✅ Traçabilité Complète:</strong> Chaque contact dispose d'une URL source vérifiée. 
            Tous les emails fictifs ont été supprimés et seuls les contacts avec source authentique sont affichés.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValidationStatsCard;