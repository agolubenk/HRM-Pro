import React, { useState } from 'react';
import './SystemSettings.css';

const SystemSecuritySettings: React.FC = () => {
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(5);
  const [lockoutDuration, setLockoutDuration] = useState(15);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [auditLogging, setAuditLogging] = useState(true);

  const handleSave = () => {
    console.log('Сохранение настроек безопасности:', {
      passwordMinLength,
      requireUppercase,
      requireLowercase,
      requireNumbers,
      requireSpecialChars,
      sessionTimeout,
      maxLoginAttempts,
      lockoutDuration,
      twoFactorAuth,
      ipWhitelist,
      auditLogging
    });
  };

  return (
    <div className="system-settings-page">
      <h1 className="mb-4">
        <i className="bi bi-shield-lock text-primary me-2"></i>
        Безопасность системы
      </h1>
      
      <div className="mb-3 text-muted" style={{ maxWidth: '600px' }}>
        Настройте параметры безопасности системы, включая политики паролей, управление сессиями, двухфакторную аутентификацию и аудит.
      </div>

      <div className="row">
        <div className="col-lg-8">
          {/* Политика паролей */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-key me-2"></i>
                Политика паролей
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="passwordMinLength" className="form-label">
                  Минимальная длина пароля
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="passwordMinLength"
                  min="6"
                  max="20"
                  value={passwordMinLength}
                  onChange={(e) => setPasswordMinLength(Number(e.target.value))}
                />
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requireUppercase"
                      checked={requireUppercase}
                      onChange={(e) => setRequireUppercase(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="requireUppercase">
                      Требовать заглавные буквы
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requireLowercase"
                      checked={requireLowercase}
                      onChange={(e) => setRequireLowercase(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="requireLowercase">
                      Требовать строчные буквы
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requireNumbers"
                      checked={requireNumbers}
                      onChange={(e) => setRequireNumbers(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="requireNumbers">
                      Требовать цифры
                    </label>
                  </div>
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requireSpecialChars"
                      checked={requireSpecialChars}
                      onChange={(e) => setRequireSpecialChars(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="requireSpecialChars">
                      Требовать специальные символы
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Управление сессиями */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                Управление сессиями
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="sessionTimeout" className="form-label">
                  Таймаут сессии (минуты)
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="sessionTimeout"
                  min="5"
                  max="480"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                />
                <div className="form-text">
                  Время неактивности, после которого пользователь будет автоматически разлогинен
                </div>
              </div>
            </div>
          </div>

          {/* Защита от брутфорса */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-shield-exclamation me-2"></i>
                Защита от брутфорса
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="maxLoginAttempts" className="form-label">
                      Максимум попыток входа
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxLoginAttempts"
                      min="3"
                      max="10"
                      value={maxLoginAttempts}
                      onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="lockoutDuration" className="form-label">
                      Время блокировки (минуты)
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="lockoutDuration"
                      min="5"
                      max="60"
                      value={lockoutDuration}
                      onChange={(e) => setLockoutDuration(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Двухфакторная аутентификация */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-phone me-2"></i>
                Двухфакторная аутентификация
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="twoFactorAuth"
                  checked={twoFactorAuth}
                  onChange={(e) => setTwoFactorAuth(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="twoFactorAuth">
                  Включить двухфакторную аутентификацию
                </label>
              </div>
              {twoFactorAuth && (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  Пользователи смогут настроить 2FA в своих профилях после включения этой опции.
                </div>
              )}
            </div>
          </div>

          {/* IP-фильтрация */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-globe me-2"></i>
                IP-фильтрация
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="ipWhitelist" className="form-label">
                  Белый список IP-адресов
                </label>
                <textarea
                  className="form-control"
                  id="ipWhitelist"
                  rows={3}
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                />
                <div className="form-text">
                  Один IP-адрес или подсеть на строку. Оставьте пустым для отключения фильтрации.
                </div>
              </div>
            </div>
          </div>

          {/* Аудит */}
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="bi bi-journal-text me-2"></i>
                Аудит и логирование
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="auditLogging"
                  checked={auditLogging}
                  onChange={(e) => setAuditLogging(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="auditLogging">
                  Включить подробное логирование действий пользователей
                </label>
              </div>
              {auditLogging && (
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Включение аудита может повлиять на производительность системы.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Статистика безопасности */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Статистика безопасности</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Активные сессии</span>
                <span className="badge bg-primary">24</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Заблокированные аккаунты</span>
                <span className="badge bg-danger">3</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Попытки входа сегодня</span>
                <span className="badge bg-info">156</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Подозрительная активность</span>
                <span className="badge bg-warning">2</span>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Быстрые действия</h6>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary w-100 mb-2">
                <i className="bi bi-download me-2"></i>
                Экспорт логов
              </button>
              <button className="btn btn-outline-warning w-100 mb-2">
                <i className="bi bi-shield-check me-2"></i>
                Сканирование безопасности
              </button>
              <button className="btn btn-outline-info w-100">
                <i className="bi bi-gear me-2"></i>
                Настройки уведомлений
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed-save-btn">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          <i className="bi bi-save me-2"></i>
          Сохранить настройки
        </button>
      </div>
    </div>
  );
};

export default SystemSecuritySettings; 