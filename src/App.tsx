import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Navigation from './components/Navigation';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { moduleSubmenus } from './constants';
import ErrorPage from './pages/ErrorPage';
import LoginPage from './pages/LoginPage';
import ModuleGrid from './components/ModuleGrid';
import ActivityLogPage from './pages/ActivityLogPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ToastContainer from './components/ToastContainer';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LanguageSwitcher from './components/LanguageSwitcher';
import { I18nextProvider } from 'react-i18next';
import QuickPanel from './components/QuickPanel';
import FloatingActions from './components/FloatingActions';
import ModuleSubmenu from './components/ModuleSubmenu';
import CommandCenter from './components/CommandCenter';
import StatWidgets from './components/StatWidgets';
import Tray from './components/Tray';

// Компонент-обертка для главной страницы
const MainPage = () => {
  return (
    <>
      <CommandCenter />
      <StatWidgets />
      <ModuleGrid />
    </>
  );
};

// Компонент-обертка для страниц ошибок
const ErrorPageWrapper: React.FC<{ errorCode: number }> = ({ errorCode }) => {
  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <ErrorPage errorCode={errorCode} />
    </div>
  );
};

const AppLayout = () => {
  const { state } = useAppContext();
  const hasSubmenu = state.activeModule && moduleSubmenus[state.activeModule]?.length > 0;
  const mainContentClass = `main-content ${hasSubmenu ? 'with-submenu' : ''}`;

  return (
    <div className="app-container">
      <Navigation />
      <ModuleSubmenu />
      <QuickPanel />
      <main className={mainContentClass}>
        <Outlet />
      </main>
      <FloatingActions />
      <Tray />
    </div>
  );
};

const AppWithProviders = () => (
  <AppProvider>
    <ToastProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </ToastProvider>
  </AppProvider>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <MainPage />
      },
      {
        path: "/account/profile",
        element: <ProfilePage />,
      },
      {
        path: "/account/settings",
        element: <SettingsPage />,
      },
      {
        path: "/account/activity-log",
        element: <ActivityLogPage />
      },
      {
        path: "/401",
        element: <ErrorPageWrapper errorCode={401} />
      },
      {
        path: "/403",
        element: <ErrorPageWrapper errorCode={403} />
      },
      {
        path: "/404",
        element: <ErrorPageWrapper errorCode={404} />
      },
      {
        path: "/500",
        element: <ErrorPageWrapper errorCode={500} />
      },
      {
        path: "/503",
        element: <ErrorPageWrapper errorCode={503} />
      },
      {
        path: "*",
        element: <ErrorPageWrapper errorCode={404} />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/account/password/reset",
    element: <ResetPasswordPage />,
  },
  {
    path: "/account/password/new",
    element: <NewPasswordPage />,
  }
]);

function App() {
  return (
    <React.StrictMode>
      <AppWithProviders />
    </React.StrictMode>
  );
}

export default App;
