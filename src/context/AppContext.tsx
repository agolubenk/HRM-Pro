import React, { createContext, useContext, useReducer, ReactNode, useCallback, useState, useEffect } from 'react';
import { Task, User, Notification, Language, ToastMessage, ToastType } from '../types';
import { storage } from '../utils';

export const STORAGE_KEYS = {
    TASKS: 'hrm_tasks',
    THEME: 'hrm_theme',
    LANGUAGE: 'hrm_language',
    FAVORITE_MODULES: 'hrm_favorite_modules',
    COLLAPSED_SECTIONS: 'hrm_collapsed_sections',
    SELECTED_WIDGETS: 'hrm_selected_widgets',
    PINNED_NOTIFICATIONS: 'hrm_pinned_notifications',
    MINIMIZED_NOTIFICATIONS: 'hrm_minimized_notifications',
};

type Theme = 'light' | 'dark';

interface AppState {
  tasks: Task[];
  currentUser: User;
  notifications: Notification[];
  theme: Theme;
  language: Language;
  quickPanelOpen: boolean;
  mobileSearchOpen: boolean;
  activeModule: string | null;
  favoriteModules: string[];
  pinnedTasks: string[];
  pinnedNotifications: number[];
  selectedWidgetIds: string[];
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'CHANGE_LANGUAGE'; payload: Language }
  | { type: 'TOGGLE_QUICK_PANEL' }
  | { type: 'SET_QUICK_PANEL'; payload: boolean }
  | { type: 'TOGGLE_MOBILE_SEARCH' }
  | { type: 'SET_ACTIVE_MODULE'; payload: string | null }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: number }
  | { type: 'TOGGLE_FAVORITE_MODULE'; payload: string }
  | { type: 'PIN_MODULE_AS_TASK'; payload: string }
  | { type: 'PIN_NOTIFICATION'; payload: number }
  | { type: 'UNPIN_NOTIFICATION'; payload: number }
  | { type: 'SET_SELECTED_WIDGETS'; payload: string[] };

const defaultTasks: Task[] = [
    // 15 Задач
    { id: 1, text: 'Финальное интервью: Смирнов В.А. - Team Lead' },
    { id: 2, text: 'Подготовить презентацию для собрания' },
    { id: 3, text: 'Оценка 360: завершить опросы до 30.05' },
    { id: 4, text: 'Заказать пропуска для 3 новых сотрудников' },
    { id: 5, text: 'Проверить больничные: 3 новых листа' },
    { id: 6, text: 'Актуализировать оргструктуру отдела продаж' },
    { id: 7, text: '1-й день адаптации: Козлов Д.А. (встретить в 9:00)' },
    { id: 8, text: 'Телефонное интервью: Иванова М.П. в 11:00' },
    { id: 9, text: 'Согласовать премии за Q2 2025' },
    { id: 10, text: 'Рассмотреть 5 заявок на корп. обучение' },
    { id: 19, text: 'Провести 1-on-1 с Петровым А.С.' },
    { id: 20, text: 'Обновить должностные инструкции' },
    { id: 21, text: 'Проверить KPI за май 2025' },
    { id: 22, text: 'Согласовать график отпусков на июль' },
    { id: 23, text: 'Подготовить отчет по текучести кадров' },
    // 8 Статей
    { id: 11, text: 'Статья: Новые тренды в подборе персонала в IT' },
    { id: 12, text: 'Статья: Как нематериальная мотивация влияет на команду' },
    { id: 13, text: 'Статья: Юридические аспекты удаленной работы' },
    { id: 14, text: 'Статья: Обзор современных HRM-систем' },
    { id: 24, text: 'Статья: Эффективные методы рекрутинга' },
    { id: 25, text: 'Статья: Управление конфликтами в команде' },
    { id: 26, text: 'Статья: Развитие лидерских качеств' },
    { id: 27, text: 'Статья: Современные подходы к оценке персонала' },
    // 8 Встреч
    { id: 15, text: 'Встреча: Еженедельная планерка HR-отдела' },
    { id: 16, text: 'Встреча: Обсуждение бюджета на следующий квартал' },
    { id: 17, text: 'Встреча: Синхронизация с отделом разработки' },
    { id: 18, text: 'Встреча: Ретроспектива по итогам онбординга' },
    { id: 28, text: 'Встреча: Обсуждение новой системы мотивации' },
    { id: 29, text: 'Встреча: Планирование корпоративных мероприятий' },
    { id: 30, text: 'Встреча: Анализ эффективности обучения' },
    { id: 31, text: 'Встреча: Подготовка к аудиту персонала' },
];

const initialState: AppState = {
  tasks: defaultTasks,
  currentUser: {
    id: 'user-001',
    name: 'Админ Иванов',
    email: 'admin@company.com',
    position: 'HR Manager',
    role: 'Главный по тарелочкам в этой компании',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    firstName: 'Админ',
    lastName: 'Иванов',
    bio: 'Главный по тарелочкам в этой компании.',
    phone: '+7 (999) 123-45-67',
    telegram: '@ivanov_admin'
  },
  notifications: [],
  theme: storage.get(STORAGE_KEYS.THEME) || 'light',
  language: storage.get(STORAGE_KEYS.LANGUAGE) || 'ru',
  quickPanelOpen: false,
  mobileSearchOpen: false,
  activeModule: null,
  favoriteModules: storage.get(STORAGE_KEYS.FAVORITE_MODULES) || [],
  pinnedTasks: [],
  pinnedNotifications: storage.get(STORAGE_KEYS.PINNED_NOTIFICATIONS) || [1, 2, 3],
  selectedWidgetIds: storage.get(STORAGE_KEYS.SELECTED_WIDGETS) || ['salary', 'vacation', 'courses'],
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      const newTasksAdd = [action.payload, ...state.tasks];
      storage.set(STORAGE_KEYS.TASKS, newTasksAdd);
      return { ...state, tasks: newTasksAdd };
    case 'REMOVE_TASK':
      const newTasksRemove = state.tasks.filter(task => task.id !== action.payload);
      storage.set(STORAGE_KEYS.TASKS, newTasksRemove);
      return { ...state, tasks: newTasksRemove };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      storage.set(STORAGE_KEYS.THEME, newTheme);
      return { ...state, theme: newTheme };
    case 'CHANGE_LANGUAGE':
      storage.set(STORAGE_KEYS.LANGUAGE, action.payload);
      return { ...state, language: action.payload };
    case 'TOGGLE_QUICK_PANEL':
      return { ...state, quickPanelOpen: !state.quickPanelOpen };
    case 'SET_QUICK_PANEL':
        return { ...state, quickPanelOpen: action.payload };
    case 'TOGGLE_MOBILE_SEARCH':
      return { ...state, mobileSearchOpen: !state.mobileSearchOpen };
    case 'SET_ACTIVE_MODULE':
      return { ...state, activeModule: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'TOGGLE_FAVORITE_MODULE':
      const newFavorites = state.favoriteModules.includes(action.payload)
        ? state.favoriteModules.filter(m => m !== action.payload)
        : [...state.favoriteModules, action.payload];
      storage.set(STORAGE_KEYS.FAVORITE_MODULES, newFavorites);
      return { ...state, favoriteModules: newFavorites };
    case 'PIN_MODULE_AS_TASK':
      const newTask: Task = {
        id: Date.now(),
        text: `Модуль: ${action.payload}`
      };
      const newTasksPin = [newTask, ...state.tasks];
      storage.set(STORAGE_KEYS.TASKS, newTasksPin);
      return { ...state, tasks: newTasksPin, pinnedTasks: [...state.pinnedTasks, action.payload] };
    case 'PIN_NOTIFICATION':
      const newPinnedNotifications = [...state.pinnedNotifications, action.payload];
      storage.set(STORAGE_KEYS.PINNED_NOTIFICATIONS, newPinnedNotifications);
      return { ...state, pinnedNotifications: newPinnedNotifications };
    case 'UNPIN_NOTIFICATION':
      const unpinnedNotifications = state.pinnedNotifications.filter(id => id !== action.payload);
      storage.set(STORAGE_KEYS.PINNED_NOTIFICATIONS, unpinnedNotifications);
      return { ...state, pinnedNotifications: unpinnedNotifications };
    case 'SET_SELECTED_WIDGETS':
      storage.set(STORAGE_KEYS.SELECTED_WIDGETS, action.payload);
      return { ...state, selectedWidgetIds: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
    selectedWidgetIds: string[];
    setSelectedWidgetIds: (ids: string[]) => void;
    toasts: ToastMessage[];
    tasks: ToastMessage[];
    addToast: (message: string, options?: { type?: ToastType, title?: string }) => void;
    removeToast: (id: number) => void;
    minimizeToast: (toastId: number) => void;
    pinToast: (toastId: number) => void;
    restoreTask: (taskId: number) => void;
    closeTask: (taskId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getDefaultTitle = (type: ToastType): string => {
    switch (type) {
        case 'success': return 'Успех';
        case 'error': return 'Ошибка';
        case 'info': return 'Информация';
        case 'message': return 'Новое сообщение';
        case 'mention': return 'Вас упомянули';
        case 'task': return 'Новая задача';
        case 'calendar': return 'Напоминание';
        default: return 'Уведомление';
    }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const [selectedWidgetIds, setSelectedWidgetIdsState] = useState<string[]>(state.selectedWidgetIds);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [tasks, setTasks] = useState<ToastMessage[]>(() => storage.get(STORAGE_KEYS.MINIMIZED_NOTIFICATIONS) || [
        {
            id: 1,
            title: 'Новое сообщение от HR-директора',
            message: 'Пожалуйста, подготовьте отчет по текучести кадров до конца недели.',
            type: 'message',
            timestamp: Date.now() - 3600000
        },
        {
            id: 2,
            title: 'Напоминание о встрече',
            message: 'Через 30 минут начинается еженедельная планерка HR-отдела.',
            type: 'calendar',
            timestamp: Date.now() - 1800000
        },
        {
            id: 3,
            title: 'Новая задача',
            message: 'Вам назначена задача: "Провести интервью с кандидатом на позицию Senior Developer".',
            type: 'task',
            timestamp: Date.now() - 900000
        }
    ]);

    useEffect(() => {
        storage.set(STORAGE_KEYS.MINIMIZED_NOTIFICATIONS, tasks);
    }, [tasks]);

    const addToast = useCallback((message: string, options: { type?: ToastType, title?: string } = {}) => {
        const id = Date.now();
        const type = options.type || 'info';
        const title = options.title || getDefaultTitle(type);
        setToasts(currentToasts => [...currentToasts, { id, message, type, title }]);
    }, []);

    const removeToast = (id: number) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    };

    const minimizeToast = (toastId: number) => {
        const toastToMinimize = toasts.find(toast => toast.id === toastId);
        if (toastToMinimize) {
            setTasks(currentTasks => [...currentTasks, toastToMinimize]);
            removeToast(toastId);
            dispatch({ type: 'PIN_NOTIFICATION', payload: toastId });
        }
    };

    const pinToast = (toastId: number) => {
        const toastToPin = toasts.find(toast => toast.id === toastId);
        if (toastToPin) {
            setTasks(currentTasks => [...currentTasks, toastToPin]);
            removeToast(toastId);
            dispatch({ type: 'PIN_NOTIFICATION', payload: toastId });
        }
    };

    const restoreTask = (taskId: number) => {
        const taskToRestore = tasks.find(task => task.id === taskId);
        if (taskToRestore) {
            setToasts(currentToasts => [...currentToasts, taskToRestore]);
            setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
            dispatch({ type: 'UNPIN_NOTIFICATION', payload: taskId });
        }
    };
    
    const closeTask = (taskId: number) => {
        setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
        dispatch({ type: 'UNPIN_NOTIFICATION', payload: taskId });
    };

    const contextValue: AppContextType = {
        state,
        dispatch,
        selectedWidgetIds,
        setSelectedWidgetIds: setSelectedWidgetIdsState,
        toasts,
        tasks,
        addToast,
        removeToast,
        minimizeToast,
        pinToast,
        restoreTask,
        closeTask
    };

    React.useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', state.theme);
    }, [state.theme]);

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// Экспортируем useApp как алиас для useAppContext для обратной совместимости
export const useApp = useAppContext; 