import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Search, LogIn, LayoutDashboard, LogOut, User, Compass, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt sur EduConnect Maroc !",
    });
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Accueil', icon: GraduationCap },
    { path: '/rechercher', label: 'Rechercher Étudiant', icon: Search },
    { path: '/guide-recherche', label: 'Guide Recherche', icon: Compass },
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">EduConnect Maroc</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/tableau-de-bord">
                  <Button
                    variant={location.pathname === '/tableau-de-bord' ? 'default' : 'outline'}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden sm:inline">Tableau de bord</span>
                  </Button>
                </Link>
                <Link to="/parametres">
                  <Button
                    variant={location.pathname === '/parametres' ? 'default' : 'outline'}
                    size="icon"
                    className="sm:hidden"
                    aria-label="Paramètres"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                   <Button
                    variant={location.pathname === '/parametres' ? 'default' : 'outline'}
                    size="sm"
                    className="hidden sm:flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">Paramètres</span>
                  </Button>
                </Link>
                <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-600 border-l pl-2 ml-2">
                  <User className="h-4 w-4" />
                  <span>{user.schoolName}</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Link to="/connexion">
                <Button
                  variant={location.pathname === '/connexion' ? 'default' : 'outline'}
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;