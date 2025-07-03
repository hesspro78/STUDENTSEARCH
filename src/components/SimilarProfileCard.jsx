
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SimilarProfileCard = ({ student }) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Link to={`/profil/${student.id}`} className="block h-full">
        <Card className="h-full card-hover">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
                    <span className="text-xl font-bold text-blue-600">{student.firstName[0]}{student.lastName[0]}</span>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h4 className="font-semibold text-gray-900 mt-3">{student.firstName} {student.lastName}</h4>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{student.country}</span>
              </div>
            </div>
            <div className="mt-3">
              <Badge variant="outline" className="text-xs">{student.domain}</Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

export default SimilarProfileCard;
