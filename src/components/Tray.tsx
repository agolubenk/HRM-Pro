import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Task, ToastMessage } from '../types';
import './Tray.css';

// Утилита для получения иконки по типу
const getItemIcon = (type: 'task' | 'notification' | 'module' | 'article' | 'meeting'): string => {
    const icons = {
        task: 'bi-check2-square',
        notification: 'bi-bell',
        module: 'bi-grid-1x2',
        article: 'bi-file-text',
        meeting: 'bi-calendar-event',
    };
    return icons[type] || 'bi-question-circle';
};

// Типизация для унифицированного элемента в трее
interface TrayItem {
    id: number | string;
    type: 'task' | 'notification' | 'module' | 'article' | 'meeting';
    text: string;
    icon: string;
    originalItem: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const Tray: React.FC = () => {
    const { state, dispatch, tasks: contextTasks, closeTask, restoreTask } = useAppContext();
    const { tasks: stateTasks, pinnedNotifications, language } = state;

    // 1. Унификация всех элементов для трея из контекста приложения
    const pinnedItems = useMemo((): TrayItem[] => {
        const truncate = (text: string, length = 35) => 
            text.length > length ? text.substring(0, length - 1) + '…' : text;

        // Задачи (включая статьи и встречи, определяются по префиксу)
        const taskItems: TrayItem[] = stateTasks.map(task => {
            let itemType: 'task' | 'article' | 'meeting' = 'task';
            let displayText = task.text;
            
            if (task.text.startsWith('Статья:')) {
                itemType = 'article';
                displayText = task.text.replace('Статья:', '').trim();
            } else if (task.text.startsWith('Встреча:')) {
                itemType = 'meeting';
                displayText = task.text.replace('Встреча:', '').trim();
            }
            
            return {
                id: task.id,
                type: itemType,
                text: truncate(displayText),
                icon: getItemIcon(itemType),
                originalItem: task,
            };
        });

        // Закрепленные уведомления
        const notificationItems: TrayItem[] = pinnedNotifications
            .map((id): TrayItem | null => {
                const notification = contextTasks.find(n => n.id === id);
                return notification ? {
                    id: notification.id,
                    type: 'notification' as const,
                    text: truncate(notification.title),
                    icon: getItemIcon('notification'),
                    originalItem: notification,
                } : null;
            })
            .filter((item): item is TrayItem => item !== null);

        // TODO: Добавить сюда логику для закрепленных модулей, когда она будет реализована
        
        const allItems = [...taskItems, ...notificationItems];
        return allItems.sort((a, b) => (b.id as number) - (a.id as number));
    }, [stateTasks, pinnedNotifications, contextTasks]);

    const [isDropdownVisible, setDropdownVisible] = useState(false);
    
    const trayRef = useRef<HTMLElement>(null);
    const moreButtonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const [visibleItems, setVisibleItems] = useState<TrayItem[]>([]);
    const [hiddenItems, setHiddenItems] = useState<TrayItem[]>([]);

    const calculateLayout = useCallback(() => {
        const container = trayRef.current;
        if (!container) return;

        const measureContainer = document.createElement('div');
        measureContainer.className = 'tray-measure-container';
        document.body.appendChild(measureContainer);

        const widths = pinnedItems.map(item => {
            const el = document.createElement('button');
            el.className = 'tray-badge';
            el.innerHTML = `<i class="bi ${item.icon}"></i> <span>${item.text}</span> <button class="tray-badge-close">×</button>`;
            measureContainer.appendChild(el);
            return el.offsetWidth;
        });

        document.body.removeChild(measureContainer);

        const containerWidth = container.offsetWidth;
        const moreButtonWidth = 80; 
        const gap = 4;
        let currentWidth = 0;
        let visibleCount = 0;

        for (let i = 0; i < pinnedItems.length; i++) {
            const itemWidth = widths[i] + gap;
            if (currentWidth + itemWidth < containerWidth - moreButtonWidth) {
                currentWidth += itemWidth;
                visibleCount++;
            } else {
                break;
            }
        }
        
        setVisibleItems(pinnedItems.slice(0, visibleCount));
        setHiddenItems(pinnedItems.slice(visibleCount));

    }, [pinnedItems]);

    useEffect(() => {
        calculateLayout();
        const observer = new ResizeObserver(calculateLayout);
        if (trayRef.current) {
            observer.observe(trayRef.current);
        }
        return () => observer.disconnect();
    }, [calculateLayout]);

    // Эффект для авто-прокрутки дропдауна вниз
    useEffect(() => {
        if (isDropdownVisible && dropdownRef.current) {
            const dropdown = dropdownRef.current;
            // Даем браузеру отрисовать элемент перед прокруткой
            requestAnimationFrame(() => {
                dropdown.scrollTop = dropdown.scrollHeight;
            });
        }
    }, [isDropdownVisible]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                moreButtonRef.current && !moreButtonRef.current.contains(event.target as Node) &&
                dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownVisible(false);
            }
        };

        if (isDropdownVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownVisible]);

    const handleRemoveItem = (item: TrayItem, e: React.MouseEvent) => {
        e.stopPropagation();
        if (item.type === 'task' || item.type === 'article' || item.type === 'meeting') {
            dispatch({ type: 'REMOVE_TASK', payload: item.id as number });
        } else if (item.type === 'notification') {
            closeTask(item.id as number); // Закрывает тост, если он еще открыт
            dispatch({ type: 'UNPIN_NOTIFICATION', payload: item.id as number });
        }
    };

    const handleRestoreItem = (item: TrayItem) => {
        // При клике на уведомление в трее - восстанавливаем его
        if (item.type === 'notification') {
            restoreTask(item.id as number);
            // Можно также убирать из трея после восстановления
            dispatch({ type: 'UNPIN_NOTIFICATION', payload: item.id as number });
        }
        // TODO: Добавить логику для клика по другим типам элементов
    };

    if (pinnedItems.length === 0) {
        return (
            <footer className="tray-empty">
                <span className="text-muted">© Иван Голубенко, 2023–2024 | HRM Pro v1.0</span>
                <span className="text-muted">{language === 'ru' ? '🇷🇺 Русский' : '🇬🇧 English'}</span>
            </footer>
        );
    }
    
    return (
        <>
            <footer ref={trayRef} className="tray">
                <div className="tray-items-container">
                    {visibleItems.map(item => (
                        <button key={item.id} className={`tray-badge type-${item.type}`} title={item.text} onClick={() => handleRestoreItem(item)}>
                            <i className={`bi ${item.icon} tray-badge-icon`}></i>
                            <span className="tray-badge-text">{item.text}</span>
                            <span className="tray-badge-close" onClick={(e) => handleRemoveItem(item, e)}>×</span>
                        </button>
                    ))}
                </div>

                {hiddenItems.length > 0 && (
                    <div className="tray-more-container">
                        <button 
                            ref={moreButtonRef}
                            className="tray-more-btn" 
                            onClick={() => setDropdownVisible(prev => !prev)}
                        >
                            <i className="bi bi-three-dots"></i>
                            <span className="tray-more-count">+{hiddenItems.length}</span>
                        </button>
                        {isDropdownVisible && (
                            <div ref={dropdownRef} className="tray-dropdown">
                                {hiddenItems.slice().reverse().map(item => (
                                    <div key={item.id} className={`tray-dropdown-item type-${item.type}`} title={item.text} onClick={() => handleRestoreItem(item)}>
                                        <i className={`bi ${item.icon} tray-dropdown-icon`}></i>
                                        <span className="tray-dropdown-text">{item.text}</span>
                                        <button className="tray-dropdown-remove" onClick={(e) => handleRemoveItem(item, e)}>
                                            <i className="bi bi-x"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </footer>
        </>
    );
};

export default Tray; 