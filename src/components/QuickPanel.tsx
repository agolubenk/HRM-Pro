import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { storage, getModuleData } from '../utils';
import { STORAGE_KEYS } from '../constants';
import './QuickPanel.css';
import { ContextMenu } from './ContextMenu';
import { Module } from '../types';

const CollapsibleSection: React.FC<{ title: string; sectionId: string; children: React.ReactNode }> = ({ title, sectionId, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const collapsedSections = storage.get(STORAGE_KEYS.COLLAPSED_SECTIONS) || {};
    if (collapsedSections[sectionId]) {
      setIsCollapsed(true);
    }
  }, [sectionId]);

  const toggleCollapse = () => {
    const collapsedSections = storage.get(STORAGE_KEYS.COLLAPSED_SECTIONS) || {};
    collapsedSections[sectionId] = !isCollapsed;
    storage.set(STORAGE_KEYS.COLLAPSED_SECTIONS, collapsedSections);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="collapsible-section">
      <div className="section-header" onClick={toggleCollapse}>
        <h6 className="section-title">{title}</h6>
        <i className={`bi bi-chevron-down section-toggle ${isCollapsed ? 'collapsed' : ''}`}></i>
      </div>
      {!isCollapsed && <div className="section-content">{children}</div>}
    </div>
  );
};

const QuickPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const allModules = getModuleData();
  const { favoriteModules } = state;
  
  const favoriteModuleObjects = allModules.filter(m => favoriteModules.includes(m.key));

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

  const handleModuleSelect = (module: Module) => {
    dispatch({ type: 'SET_ACTIVE_MODULE', payload: module.key });
    dispatch({ type: 'SET_QUICK_PANEL', payload: false });
  };

  return (
    <>
      <div className={`panel-overlay ${state.quickPanelOpen ? 'show' : ''}`} onClick={() => dispatch({ type: 'SET_QUICK_PANEL', payload: false })}></div>
      <div className={`quick-panel ${state.quickPanelOpen ? 'show' : ''}`}>
        <CollapsibleSection title="Недавние" sectionId="recent">
            <div className="d-flex flex-column gap-2">
                 <a href="/#" className="action-card">
                     <div className="action-icon info"><i className="bi bi-person"></i></div>
                     <div className="action-content">
                         <div className="action-title">Иван Петров</div>
                         <div className="action-desc">Просмотрен 5 мин назад</div>
                     </div>
                 </a>
                 <a href="/#" className="action-card">
                     <div className="action-icon success"><i className="bi bi-file-text"></i></div>
                     <div className="action-content">
                         <div className="action-title">Отчет по KPI</div>
                         <div className="action-desc">Изменен час назад</div>
                     </div>
                 </a>
            </div>
        </CollapsibleSection>

        <CollapsibleSection title="Избранное" sectionId="favorites">
             <div className="d-flex flex-column gap-1">
                {favoriteModuleObjects.length > 0 ? (
                    favoriteModuleObjects.map(module => (
                        <a href="/#" key={module.key} className="favorite-item" 
                           onClick={() => handleModuleSelect(module)} 
                           onContextMenu={(e) => handleContextMenu(e, module)}>
                            <i className="bi bi-star-fill text-warning"></i>
                            <span>{module.name}</span>
                        </a>
                    ))
                ) : (
                    <div className="text-muted text-center p-2" style={{ fontSize: '0.875rem' }}>Нет избранных модулей</div>
                )}
             </div>
        </CollapsibleSection>

        <CollapsibleSection title="Модули" sectionId="modules">
          <div className="quick-module-list">
            {allModules.map(module => (
              <a href="/#" key={module.key} className="quick-module-item" 
                 onClick={() => handleModuleSelect(module)}
                 onContextMenu={(e) => handleContextMenu(e, module)}>
                <i className={`bi ${module.icon} quick-module-icon ${module.color}`}></i>
                <span>{module.name}</span>
              </a>
            ))}
          </div>
        </CollapsibleSection>
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

export default QuickPanel;
