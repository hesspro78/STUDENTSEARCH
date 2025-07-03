import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">EduConnect Maroc</span>
            </Link>
            <p className="text-gray-500 text-base">
              La plateforme de référence pour connecter les écoles marocaines aux talents africains.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Solutions</p>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link to="/rechercher" className="text-base text-gray-500 hover:text-gray-900">
                      Recherche Étudiant
                    </Link>
                  </li>
                  <li>
                    <Link to="/tableau-de-bord" className="text-base text-gray-500 hover:text-gray-900">
                      Tableau de Bord
                    </Link>
                  </li>
                   <li>
                    <Link to="/guide-recherche" className="text-base text-gray-500 hover:text-gray-900">
                      Guide
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</p>
                <ul className="mt-4 space-y-4">
                   <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">Contact</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Entreprise</p>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">À propos</a>
                  </li>
                   <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">Partenaires</a>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Légal</p>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">Confidentialité</a>
                  </li>
                  <li>
                    <a href="#" className="text-base text-gray-500 hover:text-gray-900">Termes</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 xl:text-center">&copy; {new Date().getFullYear()} EduConnect Maroc. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;