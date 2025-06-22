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
    SELECTED_THEME: 'selected-theme',
    SELECTED_ACCENT: 'selected-accent',
    PINNED_TASKS: 'hrm_pinned_tasks',
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
  pinnedTasks: number[];
  pinnedNotifications: number[];
  selectedWidgetIds: string[];
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'REMOVE_TASK'; payload: number }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_THEME'; payload: Theme }
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
  | { type: 'PIN_TASK'; payload: number }
  | { type: 'UNPIN_TASK'; payload: number }
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
  tasks: storage.get(STORAGE_KEYS.TASKS) || defaultTasks,
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
  notifications: storage.get('hrm_notifications') || [],
  theme: storage.get(STORAGE_KEYS.THEME) || 'light',
  language: storage.get(STORAGE_KEYS.LANGUAGE) || 'ru',
  quickPanelOpen: false,
  mobileSearchOpen: false,
  activeModule: null,
  favoriteModules: storage.get(STORAGE_KEYS.FAVORITE_MODULES) || [],
  pinnedTasks: storage.get(STORAGE_KEYS.PINNED_TASKS) || [1, 2, 3, 11, 15],
  pinnedNotifications: storage.get(STORAGE_KEYS.PINNED_NOTIFICATIONS) || [],
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
      // Также убираем из закрепленных задач
      const newPinnedTasksRemove = state.pinnedTasks.filter(id => id !== action.payload);
      storage.set(STORAGE_KEYS.PINNED_TASKS, newPinnedTasksRemove);
      return { ...state, tasks: newTasksRemove, pinnedTasks: newPinnedTasksRemove };
    case 'TOGGLE_THEME':
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      storage.set(STORAGE_KEYS.THEME, newTheme);
      return { ...state, theme: newTheme };
    case 'SET_THEME':
      storage.set(STORAGE_KEYS.THEME, action.payload);
      return { ...state, theme: action.payload };
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
      const newNotifications = [...state.notifications, action.payload];
      storage.set('hrm_notifications', newNotifications);
      return { ...state, notifications: newNotifications };
    case 'REMOVE_NOTIFICATION':
      const removedNotifications = state.notifications.filter(n => n.id !== action.payload);
      storage.set('hrm_notifications', removedNotifications);
      return { ...state, notifications: removedNotifications };
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
      const newPinnedTasksPin = [...state.pinnedTasks, newTask.id];
      storage.set(STORAGE_KEYS.PINNED_TASKS, newPinnedTasksPin);
      return { ...state, tasks: newTasksPin, pinnedTasks: newPinnedTasksPin };
    case 'PIN_NOTIFICATION':
      const newPinnedNotifications = [...state.pinnedNotifications, action.payload];
      storage.set(STORAGE_KEYS.PINNED_NOTIFICATIONS, newPinnedNotifications);
      return { ...state, pinnedNotifications: newPinnedNotifications };
    case 'UNPIN_NOTIFICATION':
      const unpinnedNotifications = state.pinnedNotifications.filter(id => id !== action.payload);
      storage.set(STORAGE_KEYS.PINNED_NOTIFICATIONS, unpinnedNotifications);
      return { ...state, pinnedNotifications: unpinnedNotifications };
    case 'PIN_TASK':
      const newPinnedTasks = [...state.pinnedTasks, action.payload];
      storage.set(STORAGE_KEYS.PINNED_TASKS, newPinnedTasks);
      return { ...state, pinnedTasks: newPinnedTasks };
    case 'UNPIN_TASK':
      const unpinnedTasks = state.pinnedTasks.filter(id => id !== action.payload);
      storage.set(STORAGE_KEYS.PINNED_TASKS, unpinnedTasks);
      return { ...state, pinnedTasks: unpinnedTasks };
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
    selectedTheme: string;
    selectedAccent: string;
    setSelectedTheme: (theme: string) => void;
    setSelectedAccent: (accent: string) => void;
    applyThemeAndAccent: (theme: string, accent: string) => void;
    saveAllData: () => void;
    testStorage: () => boolean;
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
    const [selectedWidgetIds, setSelectedWidgetIdsState] = useState<string[]>(initialState.selectedWidgetIds);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [tasks, setTasks] = useState<ToastMessage[]>(storage.get(STORAGE_KEYS.MINIMIZED_NOTIFICATIONS) || []);
    const [selectedTheme, setSelectedTheme] = useState('auto');
    const [selectedAccent, setSelectedAccent] = useState('primary');

    // Функция для принудительного сохранения всех данных
    const saveAllData = useCallback(() => {
        storage.set(STORAGE_KEYS.TASKS, state.tasks);
        storage.set(STORAGE_KEYS.PINNED_TASKS, state.pinnedTasks);
        storage.set(STORAGE_KEYS.PINNED_NOTIFICATIONS, state.pinnedNotifications);
        storage.set(STORAGE_KEYS.MINIMIZED_NOTIFICATIONS, tasks);
        storage.set('hrm_notifications', state.notifications);
        storage.set(STORAGE_KEYS.FAVORITE_MODULES, state.favoriteModules);
        storage.set(STORAGE_KEYS.SELECTED_WIDGETS, selectedWidgetIds);
        storage.set(STORAGE_KEYS.THEME, state.theme);
        storage.set(STORAGE_KEYS.LANGUAGE, state.language);
    }, [state, tasks, selectedWidgetIds]);

    // Сохраняем данные при каждом изменении состояния
    useEffect(() => {
        saveAllData();
    }, [saveAllData]);

    // Автоматически закрепляем тестовое уведомление только если нет сохраненных
    useEffect(() => {
        if (tasks.length === 0 && state.pinnedNotifications.length === 0) {
            const testNotification: ToastMessage = {
                id: Date.now(),
                message: 'Тестовое уведомление для трея',
                type: 'info',
                title: 'Тестовое уведомление'
            };
            setTasks([testNotification]);
            dispatch({ type: 'PIN_NOTIFICATION', payload: testNotification.id });
        }
    }, [tasks.length, state.pinnedNotifications.length, dispatch]);

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

    // Функция для конвертации HEX в RGB
    const hexToRgb = useCallback((hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '13, 110, 253';
    }, []);

    // Функция для конвертации HEX в HSL
    const hexToHsl = useCallback((hex: string): { h: number; s: number; l: number } | null => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return null;
        
        const r = parseInt(result[1], 16) / 255;
        const g = parseInt(result[2], 16) / 255;
        const b = parseInt(result[3], 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;
        
        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }, []);

    // Функция для затемнения цвета
    const darkenColor = useCallback((hex: string, percent: number): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        
        const r = Math.max(0, parseInt(result[1], 16) - Math.round(255 * percent / 100));
        const g = Math.max(0, parseInt(result[2], 16) - Math.round(255 * percent / 100));
        const b = Math.max(0, parseInt(result[3], 16) - Math.round(255 * percent / 100));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }, []);

    // Применяем тему и акцентный цвет ко всему приложению
    const applyThemeAndAccent = useCallback((theme: string, accent: string) => {
        // Новый список акцентных цветов (solid + градиенты + кастом)
        const accentColors = [
            { key: 'primary', color: '#0d6efd', type: 'solid' },
            { key: 'success', color: '#198754', type: 'solid' },
            { key: 'danger', color: '#dc3545', type: 'solid' },
            { key: 'warning', color: '#fd7e14', type: 'solid' },
            { key: 'info', color: '#0dcaf0', type: 'solid' },
            { key: 'purple', color: '#6f42c1', type: 'solid' },
            { key: 'pink', color: '#d63384', type: 'solid' },
            { key: 'teal', color: '#20c997', type: 'solid' },
            // Градиенты:
            { key: 'blue-violet', color: 'linear-gradient(90deg, #0d6efd 0%, #6f42c1 100%)', type: 'gradient' },
            { key: 'green-yellow', color: 'linear-gradient(90deg, #198754 0%, #fd7e14 100%)', type: 'gradient' },
            { key: 'pink-orange', color: 'linear-gradient(90deg, #d63384 0%, #fd7e14 100%)', type: 'gradient' }
        ];

        // Определяем выбранный цвет
        let accentColor = accent;
        let accentType: 'solid' | 'gradient' = 'solid';
        
        const found = accentColors.find(c => c.key === accent);
        if (found) {
            accentColor = found.color;
            accentType = found.type as 'solid' | 'gradient';
        } else if (accent.startsWith('linear-gradient')) {
            accentType = 'gradient';
        } else if (accent.startsWith('#')) {
            // Кастомный hex цвет
            accentColor = accent;
            accentType = 'solid';
        }

        // Применяем solid-цвет как раньше
        if (accentType === 'solid') {
            document.documentElement.style.setProperty('--bs-primary', accentColor);
            document.documentElement.style.setProperty('--bs-primary-rgb', hexToRgb(accentColor));
            
            // Дополнительные цвета на основе акцентного
            const hsl = hexToHsl(accentColor);
            if (hsl) {
                document.documentElement.style.setProperty('--bs-primary-subtle', `hsl(${hsl.h}, ${hsl.s}%, 95%)`);
                document.documentElement.style.setProperty('--bs-primary-bg-subtle', `hsl(${hsl.h}, ${hsl.s}%, 97%)`);
                document.documentElement.style.setProperty('--bs-primary-border-subtle', `hsl(${hsl.h}, ${hsl.s}%, 85%)`);
            }
            
            document.documentElement.style.setProperty('--bs-btn-primary-bg', accentColor);
            document.documentElement.style.setProperty('--bs-btn-primary-border-color', accentColor);
            document.documentElement.style.setProperty('--bs-btn-primary-hover-bg', darkenColor(accentColor, 10));
            document.documentElement.style.setProperty('--bs-btn-primary-hover-border-color', darkenColor(accentColor, 10));
            document.documentElement.style.setProperty('--bs-link-color', accentColor);
            document.documentElement.style.setProperty('--bs-link-hover-color', darkenColor(accentColor, 15));
            document.documentElement.style.setProperty('--bs-focus-ring-color', `${accentColor}40`);
            
            // Очищаем градиент для совместимости
            document.documentElement.style.setProperty('--tray-gradient', '');
        } else {
            // Для градиента: задаем переменную --tray-gradient и fallback для --bs-primary
            document.documentElement.style.setProperty('--tray-gradient', accentColor);
            
            // Для совместимости: основной цвет для текста и иконок — берем первый цвет из градиента
            const firstColor = accentColor.match(/#([0-9a-fA-F]{6})/g)?.[0] || '#0d6efd';
            document.documentElement.style.setProperty('--bs-primary', firstColor);
            document.documentElement.style.setProperty('--bs-primary-rgb', hexToRgb(firstColor));
            
            const hsl = hexToHsl(firstColor);
            if (hsl) {
                document.documentElement.style.setProperty('--bs-primary-subtle', `hsl(${hsl.h}, ${hsl.s}%, 95%)`);
                document.documentElement.style.setProperty('--bs-primary-bg-subtle', `hsl(${hsl.h}, ${hsl.s}%, 97%)`);
                document.documentElement.style.setProperty('--bs-primary-border-subtle', `hsl(${hsl.h}, ${hsl.s}%, 85%)`);
            }
            
            document.documentElement.style.setProperty('--bs-btn-primary-bg', firstColor);
            document.documentElement.style.setProperty('--bs-btn-primary-border-color', firstColor);
            document.documentElement.style.setProperty('--bs-btn-primary-hover-bg', darkenColor(firstColor, 10));
            document.documentElement.style.setProperty('--bs-btn-primary-hover-border-color', darkenColor(firstColor, 10));
            document.documentElement.style.setProperty('--bs-link-color', firstColor);
            document.documentElement.style.setProperty('--bs-link-hover-color', darkenColor(firstColor, 15));
            document.documentElement.style.setProperty('--bs-focus-ring-color', `${firstColor}40`);
        }
    }, [hexToRgb, hexToHsl, darkenColor]);

    // Загружаем сохраненные настройки при монтировании
    useEffect(() => {
        const savedTheme = localStorage.getItem(STORAGE_KEYS.SELECTED_THEME) || 'auto';
        const savedAccent = localStorage.getItem(STORAGE_KEYS.SELECTED_ACCENT) || 'primary';
        
        setSelectedTheme(savedTheme);
        setSelectedAccent(savedAccent);
        
        // Применяем сохраненные настройки
        applyThemeAndAccent(savedTheme, savedAccent);
    }, [applyThemeAndAccent]);

    // Применяем тему при изменении
    useEffect(() => {
        applyThemeAndAccent(selectedTheme, selectedAccent);
    }, [selectedTheme, selectedAccent, applyThemeAndAccent]);

    // Применяем тему из state при изменении
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', state.theme);
    }, [state.theme]);

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
        closeTask,
        selectedTheme,
        selectedAccent,
        setSelectedTheme,
        setSelectedAccent,
        applyThemeAndAccent,
        saveAllData,
        testStorage: () => {
            try {
                const testData = { test: 'data', timestamp: Date.now() };
                storage.set('test_key', testData);
                const retrieved = storage.get('test_key');
                storage.remove('test_key');
                return JSON.stringify(retrieved) === JSON.stringify(testData);
            } catch {
                return false;
            }
        }
    };

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