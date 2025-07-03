import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [viewedProfiles, setViewedProfiles] = useState([]);
  const [contactedProfiles, setContactedProfiles] = useState([]);

  useEffect(() => {
    if (user) {
      const savedFavorites = localStorage.getItem('educonnect_favorites');
      const savedViewed = localStorage.getItem('educonnect_viewed_profiles');
      const savedContacted = localStorage.getItem('educonnect_contacted_profiles');
      
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
      if (savedViewed) setViewedProfiles(JSON.parse(savedViewed));
      if (savedContacted) setContactedProfiles(JSON.parse(savedContacted));
    } else {
      setFavorites([]);
      setViewedProfiles([]);
      setContactedProfiles([]);
    }
  }, [user]);

  const toggleFavorite = (studentId) => {
    if (!user) return;
    const newFavorites = favorites.includes(studentId)
      ? favorites.filter(id => id !== studentId)
      : [...favorites, studentId];
    setFavorites(newFavorites);
    localStorage.setItem('educonnect_favorites', JSON.stringify(newFavorites));
    return newFavorites.includes(studentId);
  };
  
  const addToViewed = (studentId) => {
    if (!user) return;
    if (!viewedProfiles.includes(studentId)) {
      const newViewed = [...viewedProfiles, studentId];
      setViewedProfiles(newViewed);
      localStorage.setItem('educonnect_viewed_profiles', JSON.stringify(newViewed));
    }
  };
  
  const addToContacted = (studentId) => {
    if (!user) return;
    if (!contactedProfiles.includes(studentId)) {
        const newContacted = [...contactedProfiles, studentId];
        setContactedProfiles(newContacted);
        localStorage.setItem('educonnect_contacted_profiles', JSON.stringify(newContacted));
    }
  };

  const isFavorite = (studentId) => favorites.includes(studentId);

  const value = {
    favorites,
    viewedProfiles,
    contactedProfiles,
    toggleFavorite,
    addToViewed,
    isFavorite,
    addToContacted,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};