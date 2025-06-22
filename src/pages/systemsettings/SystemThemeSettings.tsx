import React, { useState, useEffect, useMemo } from 'react';
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
    applyThemeAndAccent,
    addToast
  } = useAppContext();

  // Исходные настройки
  const initialSettings = useMemo(() => ({
    accentColor: selectedAccent,
    animations: 'enabled',
    gridDisplay: 'auto',
    borderRadius: 'medium',
    shadows: true,
    transitions: true
  }), [selectedAccent]);

  const [settings, setSettings] = useState(initialSettings);
  const [isDirty, setIsDirty] = useState(false);

  // Отслеживаем изменения в настройках
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(initialSettings);
    setIsDirty(hasChanges);
  }, [settings, initialSettings]);

  // Отслеживаем изменения акцентного цвета отдельно
  useEffect(() => {
    if (selectedAccent !== initialSettings.accentColor) {
      setIsDirty(true);
    }
  }, [selectedAccent, initialSettings.accentColor]);

  const handleSettingsChange = (field: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    
    // Если изменился акцентный цвет, применяем его сразу
    if (field === 'accentColor') {
      setSelectedAccent(value);
    }
  };

  const handleAccentColorChange = (colorKey: string) => {
    setSelectedAccent(colorKey);
    setSettings(prev => ({ ...prev, accentColor: colorKey }));
    setIsDirty(true);
  };

  const handleSave = () => {
    // Сохраняем в localStorage
    localStorage.setItem('selected-accent', settings.accentColor);
    localStorage.setItem('theme-settings', JSON.stringify(settings));
    
    setIsDirty(false);
    
    addToast('Настройки внешнего вида успешно сохранены.', { 
      type: 'success', 
      title: 'Сохранено' 
    });
    
    console.log('Настройки сохранены:', settings);
  };

  const handleCancel = () => {
    setSettings(initialSettings);
    setSelectedAccent(initialSettings.accentColor);
    setIsDirty(false);
    
    addToast('Изменения отменены.', { 
      type: 'info', 
      title: 'Отмена' 
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      accentColor: 'primary',
      animations: 'enabled',
      gridDisplay: 'auto',
      borderRadius: 'medium',
      shadows: true,
      transitions: true
    };
    
    setSettings(defaultSettings);
    setSelectedAccent('primary');
    setIsDirty(false);
    
    // Возвращаем к исходным настройкам
    applyThemeAndAccent('auto', 'primary');
    
    addToast('Настройки сброшены к значениям по умолчанию.', { 
      type: 'info', 
      title: 'Сброс' 
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-title">
            <i className="bi bi-palette"></i>
            <div>
              <h1>Внешний вид</h1>
              <p className="settings-subtitle">
                Настройте акцентные цвета и дополнительные параметры интерфейса для всей системы.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-content-wrapper">
        <div className="settings-layout">
          <div className="settings-main-content">
            <div className="row g-3">
              {/* Акцентные цвета */}
              <div className="col-12 col-lg-6">
                <div className="settings-section">
                  <div className="settings-section-header">
                    <i className="bi bi-droplet-half"></i>
                    <h3>Акцентный цвет</h3>
                  </div>
                  
                  <div className="accent-colors-grid accent-colors-grid-compact accent-colors-grid-standard">
                    {accentColors.map(color => (
                      <div
                        key={color.key}
                        className={`accent-color-card accent-color-card-compact accent-color-card-standard ${selectedAccent === color.key ? 'active' : ''}`}
                        onClick={() => handleAccentColorChange(color.key)}
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
                <div className="settings-section modules-section">
                  <div className="settings-section-header">
                    <i className="bi bi-gear"></i>
                    <h3>Дополнительные настройки</h3>
                  </div>
                  
                  <div className="settings-form">
                    <div className="form-group">
                      <label className="form-label">Анимации</label>
                      <select 
                        className="form-select" 
                        value={settings.animations}
                        onChange={(e) => handleSettingsChange('animations', e.target.value)}
                      >
                        <option value="enabled">Включены</option>
                        <option value="reduced">Уменьшенные</option>
                        <option value="disabled">Отключены</option>
                      </select>
                      <div className="form-text">Анимации переходов и эффектов в интерфейсе.</div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Отображение сетки</label>
                      <select 
                        className="form-select" 
                        value={settings.gridDisplay}
                        onChange={(e) => handleSettingsChange('gridDisplay', e.target.value)}
                      >
                        <option value="auto">Авто</option>
                        <option value="compact">Компактная</option>
                        <option value="spacious">Просторная</option>
                      </select>
                      <div className="form-text">Стиль отображения сеток и таблиц.</div>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Скругление углов</label>
                      <select 
                        className="form-select" 
                        value={settings.borderRadius}
                        onChange={(e) => handleSettingsChange('borderRadius', e.target.value)}
                      >
                        <option value="none">Без скругления</option>
                        <option value="small">Малое</option>
                        <option value="medium">Среднее</option>
                        <option value="large">Большое</option>
                      </select>
                      <div className="form-text">Скругление углов у карточек и кнопок.</div>
                    </div>
                    
                    <div className="form-group">
                      <div className="form-check form-switch form-check-lg">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="shadows" 
                          checked={settings.shadows} 
                          onChange={(e) => handleSettingsChange('shadows', e.target.checked)} 
                        />
                        <label className="form-check-label" htmlFor="shadows">Тени элементов</label>
                      </div>
                      <div className="form-text">Отображение теней у карточек и модальных окон.</div>
                    </div>
                    
                    <div className="form-group">
                      <div className="form-check form-switch form-check-lg">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          id="transitions" 
                          checked={settings.transitions} 
                          onChange={(e) => handleSettingsChange('transitions', e.target.checked)} 
                        />
                        <label className="form-check-label" htmlFor="transitions">Плавные переходы</label>
                      </div>
                      <div className="form-text">Плавные анимации при изменении состояний элементов.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-sidebar">
            <div className="settings-section">
              <div className="settings-section-header">
                <i className="bi bi-lightning"></i>
                <h3>Быстрые действия</h3>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-secondary" onClick={handleReset}>
                  <i className="bi bi-arrow-clockwise me-2"></i>Сбросить настройки
                </button>
                <button className="btn btn-outline-secondary" onClick={handleCancel} disabled={!isDirty}>
                  <i className="bi bi-x-circle me-2"></i>Отменить
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={!isDirty}>
                  <i className="bi bi-save me-2"></i>Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemThemeSettings; 