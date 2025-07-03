import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

const Home = lazy(() => import('@/pages/Home'));
const Search = lazy(() => import('@/pages/Search'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StudentProfile = lazy(() => import('@/pages/StudentProfile'));
const SignUp = lazy(() => import('@/pages/SignUp'));
const ResearchGuide = lazy(() => import('@/pages/ResearchGuide'));
const Settings = lazy(() => import('@/pages/Settings'));

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Helmet>
              <title>EduConnect Maroc - Plateforme de Recherche d'Étudiants</title>
              <meta name="description" content="Plateforme dédiée aux écoles supérieures marocaines pour rechercher et contacter des étudiants africains francophones souhaitant poursuivre leurs études au Maroc." />
            </Helmet>
            
            <Navbar />
            
            <main className="flex-grow">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/rechercher" element={<Search />} />
                  <Route path="/guide-recherche" element={<ResearchGuide />} />
                  <Route path="/connexion" element={<Login />} />
                  <Route path="/inscription" element={<SignUp />} />
                  <Route path="/tableau-de-bord" element={<Dashboard />} />
                  <Route path="/parametres" element={<Settings />} />
                  <Route path="/profil/:id" element={<StudentProfile />} />
                </Routes>
              </Suspense>
            </main>
            
            <Footer />
            <Toaster />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;