import React, { Suspense, lazy } from 'react';
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
import ResetPasswordPage from './pages/ResetPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ToastContainer from './components/ToastContainer';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SystemSettingsPage from './pages/systemsettings/SystemSettingsPage';
import QuickPanel from './components/QuickPanel';
import FloatingActions from './components/FloatingActions';
import ModuleSubmenu from './components/ModuleSubmenu';
import CommandCenter from './components/CommandCenter';
import StatWidgets from './components/StatWidgets';
import Tray from './components/Tray';

// Lazy loading для страниц, которые не загружаются сразу
const ActivityLogPage = lazy(() => import('./pages/ActivityLogPage'));

// Компонент загрузки
const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Загрузка...</span>
    </div>
  </div>
);

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
        path: "/settings/*",
        element: <SystemSettingsPage />,
      },
      {
        path: "/account/activity-log",
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ActivityLogPage />
          </Suspense>
        )
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
    <AppWithProviders />
  );
}

export default App;
