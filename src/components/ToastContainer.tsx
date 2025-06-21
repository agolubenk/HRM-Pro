import React from 'react';
import { useAppContext } from '../context/AppContext';
import Toast from './Toast';
import './Toast.css';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast, minimizeToast, pinToast } = useAppContext();

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onDismiss={removeToast}
                    onMinimize={minimizeToast}
                    onPin={pinToast}
                />
            ))}
        </div>
    );
};

export default ToastContainer; 