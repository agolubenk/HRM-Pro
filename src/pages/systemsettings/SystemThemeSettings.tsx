import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './SystemSettings.css';

interface AccentColor {
  key: string;
  name: string;
  color: string;
  preview: string;
}

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
  const { 
    selectedAccent, 
    setSelectedAccent, 
    applyThemeAndAccent 
  } = useAppContext();
  
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleSave = () => {
    // Сохраняем в localStorage
    localStorage.setItem('selected-accent', selectedAccent);
    
    setIsPreviewMode(false);
    console.log('Акцентный цвет сохранен:', selectedAccent);
  };

  const handlePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const handleReset = () => {
    setSelectedAccent('primary');
    setIsPreviewMode(false);
    
    // Возвращаем к исходным настройкам
    applyThemeAndAccent('auto', 'primary');
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
            Настройте акцентные цвета и дополнительные параметры интерфейса.
          </p>
        </div>
      </div>

      <div className="settings-content-wrapper theme-content-compact">
        <div className="row g-3">
          {/* Акцентные цвета */}
          <div className="col-12 col-lg-6">
            <div className="settings-section theme-section-compact theme-section-standard">
              <div className="settings-section-header theme-header-compact">
                <i className="bi bi-droplet-half"></i>
                <h3>Акцентный цвет</h3>
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
          <div className="col-12 col-lg-6">
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

                <div className="setting-item">
                  <div className="setting-icon">
                    <i className="bi bi-brightness-high"></i>
                  </div>
                  <div className="setting-content">
                    <label className="setting-label">Тема интерфейса</label>
                    <select className="form-select form-select-compact setting-select">
                      <option value="auto" selected>Авто</option>
                      <option value="light">Светлая</option>
                      <option value="dark">Тёмная</option>
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