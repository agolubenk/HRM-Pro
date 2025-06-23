import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { MODULES } from '../constants';

export const useActiveModule = () => {
  const { state, dispatch } = useAppContext();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Определяем активный модуль на основе URL
    let activeModule: string | null = null;
    
    if (path.startsWith('/cb')) {
      activeModule = MODULES.CB;
    } else if (path.startsWith('/settings')) {
      activeModule = MODULES.SETTINGS;
    } else if (path.startsWith('/employees')) {
      activeModule = MODULES.EMPLOYEES;
    } else if (path.startsWith('/recruiting')) {
      activeModule = MODULES.RECRUITING;
    } else if (path.startsWith('/adaptation')) {
      activeModule = MODULES.ADAPTATION;
    } else if (path.startsWith('/hrops')) {
      activeModule = MODULES.HROPS;
    } else if (path.startsWith('/ld')) {
      activeModule = MODULES.LD;
    } else if (path.startsWith('/performance')) {
      activeModule = MODULES.PERFORMANCE;
    } else if (path.startsWith('/okr')) {
      activeModule = MODULES.OKR;
    } else if (path.startsWith('/time')) {
      activeModule = MODULES.TIME;
    } else if (path.startsWith('/projects')) {
      activeModule = MODULES.PROJECTS;
    } else if (path.startsWith('/wiki')) {
      activeModule = MODULES.WIKI;
    } else if (path.startsWith('/corporate')) {
      activeModule = MODULES.CORPORATE;
    } else if (path.startsWith('/reports')) {
      activeModule = MODULES.REPORTS;
    } else if (path === '/') {
      activeModule = MODULES.DASHBOARD;
    }
    
    // Устанавливаем активный модуль только если он изменился
    if (activeModule !== state.activeModule) {
      dispatch({ type: 'SET_ACTIVE_MODULE', payload: activeModule });
    }
  }, [location.pathname, state.activeModule, dispatch]);

  return state.activeModule;
}; 