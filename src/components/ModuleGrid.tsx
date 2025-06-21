import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getModuleData } from '../utils';
import { Module } from '../types';
import { ContextMenu } from './ContextMenu';

const ModuleCard: React.FC<{ module: Module; onContextMenu: (e: React.MouseEvent, module: Module) => void; isFavorite: boolean }> = ({ module, onContextMenu, isFavorite }) => {
    const { state, dispatch } = useAppContext();
    
    return (
        <a href="/#" className={`module-card ${state.activeModule === module.key ? 'active' : ''}`} 
           onClick={(e) => { e.preventDefault(); dispatch({ type: 'SET_ACTIVE_MODULE', payload: module.key }); }}
           onContextMenu={(e) => onContextMenu(e, module)}>
            
            <div className="module-icon-wrapper">
                {isFavorite && <i className="bi bi-star-fill favorite-star"></i>}
                <i className={`bi ${module.icon} module-icon ${module.color}`}></i>
            </div>
            <div className="module-name">{module.name}</div>
            <div className="module-count">{module.count}</div>
        </a>
    );
};

const ModuleGrid: React.FC = () => {
    const { state } = useAppContext();
    const modules = getModuleData();
    const { favoriteModules } = state;

    const [contextMenu, setContextMenu] = useState<{
        visible: boolean;
        position: { top: number; left: number };
        selectedModule: Module | null;
    }>({
        visible: false,
        position: { top: 0, left: 0 },
        selectedModule: null
    });

    const handleContextMenu = (e: React.MouseEvent, module: Module) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            selectedModule: module
        });
    };

    const closeContextMenu = () => {
        setContextMenu({
            visible: false,
            position: { top: 0, left: 0 },
            selectedModule: null
        });
    };

    return (
        <>
            <div className="module-grid">
                {modules.map(module => 
                    <ModuleCard 
                        key={module.key} 
                        module={module} 
                        onContextMenu={handleContextMenu} 
                        isFavorite={favoriteModules.includes(module.key)} 
                    />
                )}
            </div>
            <ContextMenu 
                isVisible={contextMenu.visible}
                position={contextMenu.position}
                items={[]}
                onClose={closeContextMenu}
                selectedModule={contextMenu.selectedModule || undefined}
            />
        </>
    );
};

export default ModuleGrid;
