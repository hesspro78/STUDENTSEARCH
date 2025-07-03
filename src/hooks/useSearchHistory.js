
import { useState, useCallback } from 'react';

const MAX_HISTORY = 5;
const HISTORY_KEY = 'educonnect_search_history';

export const useSearchHistory = () => {
  const [history, setHistory] = useState(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error('Error reading search history from localStorage', error);
      return [];
    }
  });

  const addSearchTerm = useCallback((term) => {
    if (!term || term.trim() === '') return;
    
    setHistory(prevHistory => {
      const newHistory = [term, ...prevHistory.filter(item => item !== term)].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error('Error saving search history to localStorage', error);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing search history from localStorage', error);
    }
  }, []);

  return { history, addSearchTerm, clearHistory };
};
