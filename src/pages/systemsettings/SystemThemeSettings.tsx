import React, { useState, useEffect } from 'react';
import './SystemSettings.css';

interface Theme {
  key: string;
  name: string;
  icon: string;
  description: string;
  preview: string;
}

interface AccentColor {
  key: string;
  name: string;
  color: string;
  preview: string;
}

const themes: Theme[] = [
  { 
    key: 'light', 
    name: 'Светлая', 
    icon: 'bi-sun', 
    description: 'Классическая светлая тема для комфортной работы днём',
    preview: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  },
  { 
    key: 'dark', 
    name: 'Тёмная', 
    icon: 'bi-moon', 
    description: 'Современная тёмная тема для работы в условиях низкой освещённости',
    preview: 'linear-gradient(135deg, #212529 0%, #343a40 100%)'
  },
  { 
    key: 'auto', 
    name: 'Авто', 
    icon: 'bi-circle-half', 
    description: 'Автоматическое переключение в зависимости от системных настроек',
    preview: 'linear-gradient(135deg, #f8f9fa 0%, #212529 50%, #343a40 100%)'
  }
];

const accentColors: AccentColor[] = [
  { key: 'primary', name: 'Синий', color: '#0d6efd', preview: '#0d6efd' },
  { key: 'success', name: 'Зелёный', color: '#198754', preview: '#198754' },
  { key: 'danger', name: 'Красный', color: '#dc3545', preview: '#dc3545' },
  { key: 'warning', name: 'Оранжевый', color: '#fd7e14', preview: '#fd7e14' },
  { key: 'info', name: 'Голубой', color: '#0dcaf0', preview: '#0dcaf0' },
  { key: 'purple', name: 'Фиолетовый', color: '#6f42c1', preview: '#6f42c1' },
  { key: 'pink', name: 'Розовый', color: '#d63384', preview: '#d63384' },
  { key: 'teal', name: 'Бирюзовый', color: '#20c997', preview: '#20c997' }
];

const SystemThemeSettings: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('auto');
  const [selectedAccent, setSelectedAccent] = useState('primary');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Применяем тему для превью
  useEffect(() => {
    if (isPreviewMode) {
      document.documentElement.setAttribute('data-bs-theme', selectedTheme);
      document.documentElement.style.setProperty('--bs-primary', accentColors.find(c => c.key === selectedAccent)?.color || '#0d6efd');
    }
  }, [selectedTheme, selectedAccent, isPreviewMode]);

  const handleSave = () => {
    // Применяем выбранную тему глобально
    document.documentElement.setAttribute('data-bs-theme', selectedTheme);
    document.documentElement.style.setProperty('--bs-primary', accentColors.find(c => c.key === selectedAccent)?.color || '#0d6efd');
    
    // Сохраняем в localStorage
    localStorage.setItem('selected-theme', selectedTheme);
    localStorage.setItem('selected-accent', selectedAccent);
    
    setIsPreviewMode(false);
    console.log('Тема сохранена:', { theme: selectedTheme, accent: selectedAccent });
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleReset = () => {
    setSelectedTheme('auto');
    setSelectedAccent('primary');
    setIsPreviewMode(false);
    
    // Возвращаем к исходным настройкам
    document.documentElement.setAttribute('data-bs-theme', 'auto');
    document.documentElement.style.setProperty('--bs-primary', '#0d6efd');
  };

  return (
    <div className="system-settings-page theme-settings-compact">
      <div className="settings-header theme-header-compact">
        <div className="settings-header-content">
          <div className="settings-title">
            <i className="bi bi-palette"></i>
            <h1>Внешний вид</h1>
          </div>
          <p className="settings-subtitle">
            Настройте тему оформления и акцентные цвета для всей системы.
          </p>
        </div>
      </div>

      <div className="settings-content-wrapper theme-content-compact">
        <div className="row g-3">
          {/* Темы интерфейса */}
          <div className="col-12 col-lg-4">
            <div className="settings-section theme-section-compact theme-section-standard">
              <div className="settings-section-header theme-header-compact">
                <i className="bi bi-brightness-high"></i>
                <h3>Тема интерфейса</h3>
                <div className="settings-header-actions">
                  <button 
                    type="button" 
                    className={`btn btn-sm preview-toggle-btn ${isPreviewMode ? 'btn-success' : 'btn-outline-primary'}`}
                    onClick={handlePreview}
                    title={isPreviewMode ? 'Скрыть превью' : 'Показать превью'}
                  >
                    <i className={`bi ${isPreviewMode ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    <span className="preview-text d-none d-sm-inline ms-1">{isPreviewMode ? 'Скрыть' : 'Превью'}</span>
                  </button>
                </div>
              </div>
              
              <div className="themes-grid themes-grid-compact themes-grid-standard">
                {themes.map(theme => (
                  <div
                    key={theme.key}
                    className={`theme-card theme-card-compact theme-card-standard ${selectedTheme === theme.key ? 'active' : ''}`}
                    onClick={() => setSelectedTheme(theme.key)}
                  >
                    <div className="theme-preview theme-preview-compact theme-preview-standard" style={{ background: theme.preview }}>
                      <div className="theme-preview-content theme-preview-content-compact">
                        <div className="preview-header preview-header-compact"></div>
                        <div className="preview-sidebar preview-sidebar-compact"></div>
                        <div className="preview-main preview-main-compact">
                          <div className="preview-card preview-card-compact"></div>
                          <div className="preview-card preview-card-compact"></div>
                        </div>
                      </div>
                    </div>
                    <div className="theme-info theme-info-compact theme-info-standard">
                      <div className="theme-icon theme-icon-compact">
                        <i className={`bi ${theme.icon}`}></i>
                      </div>
                      <div className="theme-details theme-details-compact">
                        <h5>{theme.name}</h5>
                        <p className="theme-description-compact">{theme.description}</p>
                      </div>
                      {selectedTheme === theme.key && (
                        <div className="theme-selected">
                          <i className="bi bi-check-circle-fill"></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Акцентные цвета */}
          <div className="col-12 col-lg-4">
            <div className="settings-section theme-section-compact theme-section-standard">
              <div className="settings-section-header theme-header-compact">
                <i className="bi bi-droplet-half"></i>
                <h3>Акцентный цвет</h3>
              </div>
              
              <div className="accent-colors-grid accent-colors-grid-compact accent-colors-grid-standard">
                {accentColors.map(color => (
                  <div
                    key={color.key}
                    className={`accent-color-card accent-color-card-compact accent-color-card-standard ${selectedAccent === color.key ? 'active' : ''}`}
                    onClick={() => setSelectedAccent(color.key)}
                  >
                    <div className="accent-preview accent-preview-compact accent-preview-standard" style={{ background: color.preview }}>
                      <div className="accent-preview-content accent-preview-content-compact">
                        <div className="preview-button preview-button-compact"></div>
                        <div className="preview-link preview-link-compact"></div>
                      </div>
                    </div>
                    <div className="accent-info accent-info-compact accent-info-standard">
                      <span className="accent-name accent-name-compact">{color.name}</span>
                      {selectedAccent === color.key && (
                        <i className="bi bi-check-circle-fill accent-selected"></i>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Дополнительные настройки */}
          <div className="col-12 col-lg-4">
            <div className="settings-section theme-section-compact theme-section-standard">
              <div className="settings-section-header theme-header-compact">
                <i className="bi bi-sliders"></i>
                <h3>Дополнительные настройки</h3>
              </div>
              
              <div className="additional-settings-content">
                <div className="setting-item">
                  <div className="setting-icon">
                    <i className="bi bi-fonts"></i>
                  </div>
                  <div className="setting-content">
                    <label className="setting-label">Размер шрифта</label>
                    <select className="form-select form-select-compact setting-select">
                      <option value="small">Мелкий</option>
                      <option value="medium" selected>Средний</option>
                      <option value="large">Крупный</option>
                    </select>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-icon">
                    <i className="bi bi-layout-text-window"></i>
                  </div>
                  <div className="setting-content">
                    <label className="setting-label">Плотность интерфейса</label>
                    <select className="form-select form-select-compact setting-select">
                      <option value="compact">Компактная</option>
                      <option value="normal" selected>Обычная</option>
                      <option value="spacious">Просторная</option>
                    </select>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-icon">
                    <i className="bi bi-eye"></i>
                  </div>
                  <div className="setting-content">
                    <label className="setting-label">Анимации</label>
                    <select className="form-select form-select-compact setting-select">
                      <option value="enabled" selected>Включены</option>
                      <option value="reduced">Уменьшенные</option>
                      <option value="disabled">Отключены</option>
                    </select>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-icon">
                    <i className="bi bi-grid-3x3-gap"></i>
                  </div>
                  <div className="setting-content">
                    <label className="setting-label">Отображение сетки</label>
                    <select className="form-select form-select-compact setting-select">
                      <option value="auto" selected>Авто</option>
                      <option value="compact">Компактная</option>
                      <option value="spacious">Просторная</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="settings-actions theme-actions-compact">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleReset}>
            <i className="bi bi-arrow-clockwise me-1"></i>
            <span className="d-none d-sm-inline">Сбросить</span>
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            <i className="bi bi-save me-1"></i>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemThemeSettings; 