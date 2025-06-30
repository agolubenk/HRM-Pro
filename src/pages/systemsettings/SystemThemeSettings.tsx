import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import './SystemSettings.css';

interface AccentColor {
  key: string;
  name: string;
  color: string;
  preview: string;
}

const allAccentColors: AccentColor[] = [
  // Solid
  { key: 'primary', name: 'Синий', color: '#0d6efd', preview: '#0d6efd' },
  { key: 'success', name: 'Зелёный', color: '#198754', preview: '#198754' },
  { key: 'danger', name: 'Красный', color: '#dc3545', preview: '#dc3545' },
  { key: 'warning', name: 'Оранжевый', color: '#fd7e14', preview: '#fd7e14' },
  { key: 'info', name: 'Голубой', color: '#0dcaf0', preview: '#0dcaf0' },
  { key: 'purple', name: 'Фиолетовый', color: '#6f42c1', preview: '#6f42c1' },
  { key: 'pink', name: 'Розовый', color: '#d63384', preview: '#d63384' },
  { key: 'teal', name: 'Бирюзовый', color: '#20c997', preview: '#20c997' },
  // Gradients
  { key: 'blue-violet', name: 'Индиго', color: 'linear-gradient(90deg, #0d6efd 0%, #6f42c1 100%)', preview: 'linear-gradient(90deg, #0d6efd 0%, #6f42c1 100%)' },
  { key: 'green-yellow', name: 'Лайм', color: 'linear-gradient(90deg, #198754 0%, #fd7e14 100%)', preview: 'linear-gradient(90deg, #198754 0%, #fd7e14 100%)' },
  { key: 'pink-orange', name: 'Закат', color: 'linear-gradient(90deg, #d63384 0%, #fd7e14 100%)', preview: 'linear-gradient(90deg, #d63384 0%, #fd7e14 100%)' },
];

const SystemThemeSettings: React.FC = () => {
  const { 
    selectedAccent, 
    setSelectedAccent,
    addToast
  } = useAppContext();

  const [customColor, setCustomColor] = useState(
    !allAccentColors.some(c => c.key === selectedAccent) ? selectedAccent : '#475c7b'
  );

  const [showCustomColorPopover, setShowCustomColorPopover] = useState(false);

  // Загружаем сохраненные настройки из localStorage или используем значения по умолчанию
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem('theme-settings');
    const savedAccent = localStorage.getItem('selected-accent') || selectedAccent;
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        ...parsed,
        accentColor: savedAccent // Приоритет отдаем сохраненному акцентному цвету
      };
    }
    
    return {
      accentColor: savedAccent,
      animations: 'enabled',
      gridDisplay: 'auto',
      borderRadius: 'medium',
      shadows: true,
      transitions: true
    };
  };

  const [baseSettings, setBaseSettings] = useState(loadSavedSettings);
  const [settings, setSettings] = useState(baseSettings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setSelectedAccent(settings.accentColor);
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(baseSettings);
    setIsDirty(hasChanges);
  }, [settings, baseSettings, setSelectedAccent]);

  const handleSettingsChange = (field: keyof typeof settings, value: any) => {
    setSettings((prev: typeof settings) => ({ ...prev, [field]: value }));
    if (field === 'accentColor' && value.startsWith('#')) {
      setCustomColor(value);
    }
  };
  
  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCustomColor(newColor);
    handleSettingsChange('accentColor', newColor);
  };

  const handleCustomColorCardClick = () => {
    setShowCustomColorPopover(!showCustomColorPopover);
  };

  const handleCustomColorApply = () => {
    handleSettingsChange('accentColor', customColor);
    setShowCustomColorPopover(false);
  };

  const handleSave = () => {
    localStorage.setItem('selected-accent', settings.accentColor);
    localStorage.setItem('theme-settings', JSON.stringify(settings));
    setBaseSettings(settings);
    addToast('Настройки внешнего вида успешно сохранены.', { type: 'success', title: 'Сохранено' });
    console.log('Настройки сохранены:', settings);
  };

  const handleCancel = () => {
    setSettings(baseSettings);
    addToast('Изменения отменены.', { type: 'info', title: 'Отмена' });
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
    
    // Устанавливаем настройки по умолчанию
    setSettings(defaultSettings);
    setBaseSettings(defaultSettings);
    
    // Сразу сохраняем в localStorage
    localStorage.setItem('selected-accent', 'primary');
    localStorage.setItem('theme-settings', JSON.stringify(defaultSettings));
    
    // Обновляем акцентный цвет в контексте
    setSelectedAccent('primary');
    
    addToast('Настройки сброшены к значениям по умолчанию.', { type: 'info', title: 'Сброс' });
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
        <div className="settings-grid">
          <div className="settings-section h-100">
            <div className="settings-section-header">
              <i className="bi bi-droplet-half"></i>
              <h3>Акцентный цвет</h3>
            </div>
            <div className="accent-colors-grid">
              {allAccentColors.map(color => (
                <div
                  key={color.key}
                  className={`accent-color-card ${settings.accentColor === color.key ? 'active' : ''}`}
                  onClick={() => handleSettingsChange('accentColor', color.key)}
                >
                  <div className="accent-preview" style={{ background: color.preview }}>
                    <div className="accent-preview-content">
                      <div className="preview-button"></div>
                      <div className="preview-link"></div>
                    </div>
                  </div>
                  <div className="accent-info">
                    <span className="accent-name">{color.name}</span>
                    {settings.accentColor === color.key && <i className="bi bi-check-circle-fill accent-selected"></i>}
                  </div>
                </div>
              ))}
              {/* Кастомный цвет как карточка с popover */}
              <div className="custom-color-wrapper" style={{ position: 'relative' }}>
                <div
                  className={`accent-color-card ${settings.accentColor.startsWith('#') || settings.accentColor.startsWith('linear-gradient') ? 'active' : ''}`}
                  onClick={handleCustomColorCardClick}
                >
                  <div className="accent-preview" style={{ background: customColor }}>
                    <div className="accent-preview-content">
                      <div className="preview-button"></div>
                      <div className="preview-link"></div>
                    </div>
                  </div>
                  <div className="accent-info">
                    <span className="accent-name">Свой цвет</span>
                    {(settings.accentColor.startsWith('#') || settings.accentColor.startsWith('linear-gradient')) && (
                      <i className="bi bi-check-circle-fill accent-selected"></i>
                    )}
                  </div>
                </div>
                
                {/* Popover для настройки кастомного цвета */}
                {showCustomColorPopover && (
                  <div className="custom-color-popover">
                    <div className="popover-header">
                      <h6>Цвет</h6>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowCustomColorPopover(false)}
                        aria-label="Закрыть"
                      ></button>
                    </div>
                    <div className="popover-body">
                      <div className="form-group">
                        <input
                          type="color"
                          className="form-control form-control-color"
                          value={customColor.startsWith('#') ? customColor : '#475c7b'}
                          onChange={handleCustomColorChange}
                          title="Выбрать цвет"
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="#475c7b или linear-gradient(...)"
                          value={customColor}
                          onChange={handleCustomColorChange}
                        />
                      </div>
                    </div>
                    <div className="popover-footer">
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={handleCustomColorApply}
                      >
                        Применить
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-light btn-sm"
                        onClick={() => setShowCustomColorPopover(false)}
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="settings-section h-100">
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

      {/* Плавающий элемент с кнопками действий */}
      {isDirty && (
        <div className="settings-actions">
          <button
            type="button"
            className="btn btn-light btn-lg me-3"
            onClick={handleCancel}
          >
            Отмена
          </button>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={handleSave}
          >
            Сохранить изменения
          </button>
          <button 
            type="button" 
            className="btn btn-link text-secondary ms-3"
            onClick={handleReset}
          >
            Сбросить настройки
          </button>
        </div>
      )}
    </div>
  );
};

export default SystemThemeSettings; 