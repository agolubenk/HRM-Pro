import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { moduleSubmenus } from '../constants';
import { SubmenuItem } from '../types';

const ModuleSubmenu: React.FC = () => {
    const { state } = useAppContext();
    const { activeModule } = state;
    const [activeItem, setActiveItem] = useState<string | null>(null);
    
    const submenuItems = useMemo(() => {
        return activeModule && moduleSubmenus[activeModule] ? moduleSubmenus[activeModule] : [];
    }, [activeModule]);

    React.useEffect(() => {
        if (submenuItems.length > 0) {
            const defaultActive = submenuItems.find(item => item.active)?.text;
            setActiveItem(defaultActive || submenuItems[0]?.text || null);
        } else {
            setActiveItem(null);
        }
    }, [submenuItems]);
    
    const isVisible = activeModule && submenuItems.length > 0;

    return (
        <div className={`module-submenu ${isVisible ? 'show' : ''}`}>
            <div className="submenu-items">
                {submenuItems.map((item: SubmenuItem) => (
                    <a href="/#" 
                       key={item.text} 
                       className={`submenu-item ${activeItem === item.text ? 'active' : ''}`}
                       onClick={(e) => { e.preventDefault(); setActiveItem(item.text); }}>
                        <i className={`bi ${item.icon}`}></i>
                        <span>{item.text}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default ModuleSubmenu;
