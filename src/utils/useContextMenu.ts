import { useState } from 'react';
import { useFloating, offset, flip, shift, autoUpdate, useDismiss } from '@floating-ui/react';
import { Module } from '../types';

export const useContextMenu = () => {
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; selectedModule: Module | null; }>({ visible: false, selectedModule: null });

    const { x, y, refs, strategy, context } = useFloating({
        open: contextMenu.visible,
        onOpenChange: (isOpen) => {
            // This is called by useDismiss to close the menu
            setContextMenu(prev => ({ ...prev, visible: isOpen }));
        },
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip(),
            shift({ padding: 8 }),
        ],
    });

    // Handles Escape key and clicks outside the floating element
    useDismiss(context);

    const handleContextMenu = (e: React.MouseEvent, module: Module) => {
        e.preventDefault();
        refs.setReference({
            getBoundingClientRect: () => ({
                x: e.clientX,
                y: e.clientY,
                width: 0,
                height: 0,
                top: e.clientY,
                right: e.clientX,
                bottom: e.clientY,
                left: e.clientX,
            }),
        });
        setContextMenu({ visible: true, selectedModule: module });
    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, selectedModule: null });
    };

    return {
        contextMenu,
        closeContextMenu,
        handleContextMenu,
        floating: {
            ref: refs.setFloating,
            style: {
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                zIndex: 1100, // z-index выше чем у других элементов
            },
            context,
        }
    };
}; 