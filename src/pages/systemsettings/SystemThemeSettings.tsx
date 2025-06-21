import React, { useState } from 'react';
import './SystemSettings.css';

const themes = [
  { key: 'light', name: 'Светлая', icon: 'bi-sun' },
  { key: 'dark', name: 'Тёмная', icon: 'bi-moon' },
  { key: 'auto', name: 'Авто', icon: 'bi-circle-half' }
];

const accentColors = [
  { key: 'primary', name: 'Синий', color: '#0d6efd' },
  { key: 'success', name: 'Зелёный', color: '#198754' },
  { key: 'danger', name: 'Красный', color: '#dc3545' },
  { key: 'warning', name: 'Жёлтый', color: '#ffc107' },
  { key: 'info', name: 'Голубой', color: '#0dcaf0' },
  { key: 'purple', name: 'Фиолетовый', color: '#6f42c1' }
];

const SystemThemeSettings: React.FC = () => {
  const [theme, setTheme] = useState('auto');
  const [accent, setAccent] = useState('primary');

  const handleSave = () => {
    console.log('Сохранение темы:', { theme, accent });
  };

  return (
    <div className="system-settings-page">
      <h1 className="mb-4">
        <i className="bi bi-palette text-primary me-2"></i>
        Внешний вид
      </h1>
      <div className="mb-3 text-muted" style={{ maxWidth: '600px' }}>
        Настройте тему оформления и акцентные цвета для всей системы. Изменения будут применяться для всех пользователей.
      </div>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0"><i className="bi bi-brightness-high me-2"></i>Тема интерфейса</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3">
                {themes.map(t => (
                  <button
                    key={t.key}
                    type="button"
                    className={`btn btn-outline-primary d-flex flex-column align-items-center ${theme === t.key ? 'active' : ''}`}
                    style={{ minWidth: 90 }}
                    onClick={() => setTheme(t.key)}
                  >
                    <i className={`bi ${t.icon} mb-1`} style={{ fontSize: '1.5rem' }}></i>
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0"><i className="bi bi-droplet-half me-2"></i>Акцентный цвет</h5>
            </div>
            <div className="card-body">
              <div className="d-flex gap-3 flex-wrap">
                {accentColors.map(c => (
                  <button
                    key={c.key}
                    type="button"
                    className={`btn btn-outline-secondary d-flex flex-column align-items-center ${accent === c.key ? 'active' : ''}`}
                    style={{ minWidth: 90 }}
                    onClick={() => setAccent(c.key)}
                  >
                    <span className="rounded-circle d-block mb-1" style={{ width: 28, height: 28, background: c.color, border: accent === c.key ? '3px solid #000' : '2px solid #ccc' }}></span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed-save-btn">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <i className="bi bi-save me-2"></i>
          Сохранить
        </button>
      </div>
    </div>
  );
};

export default SystemThemeSettings; 