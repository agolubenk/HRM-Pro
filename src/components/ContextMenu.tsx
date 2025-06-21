import React from 'react';
import './ContextMenu.css';
import { useAppContext } from '../context/AppContext';
import { Module } from '../types';

interface ContextMenuItem {
    label: string;
    icon: string;
    action: () => void;
    isDestructive?: boolean;
}

interface ContextMenuProps {
    isVisible: boolean;
    position: { top: number; left: number };
    items: ContextMenuItem[];
    onClose: () => void;
    selectedModule?: Module;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ isVisible, position, items, onClose, selectedModule }) => {
    const { state, dispatch } = useAppContext();
    const { favoriteModules } = state;

    if (!isVisible || !selectedModule) {
        return null;
    }

    const handleToggleFavorite = (moduleKey: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE_MODULE', payload: moduleKey });
        onClose();
    };
    
    const handlePinModule = (module: Module) => {
        dispatch({ type: 'PIN_MODULE_AS_TASK', payload: module.name });
        onClose();
    };
    
    const isFavorite = favoriteModules.includes(selectedModule.key);

    return (
        <div style={{ position: 'absolute', top: position.top, left: position.left }} className="context-menu">
            <a href="/#" className="context-item" onClick={(e) => { e.preventDefault(); handleToggleFavorite(selectedModule.key); }}>
                <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}`}></i>
                <span>{isFavorite ? 'Убрать из избранного' : 'Добавить в избранное'}</span>
            </a>
            <a href="/" target="_blank" rel="noopener noreferrer" className="context-item" onClick={onClose}>
                <i className="bi bi-box-arrow-up-right"></i>
                <span>Открыть в новой вкладке</span>
            </a>
            <div className="context-divider"></div>
            <a href="/#" className="context-item" onClick={(e) => { e.preventDefault(); handlePinModule(selectedModule); }}>
                <i className="bi bi-pin-angle"></i>
                <span>Закрепить внизу</span>
            </a>
        </div>
    );
};

export default ContextMenu; 