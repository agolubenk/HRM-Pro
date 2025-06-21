import React, { useState } from 'react';
import './SystemSettings.css';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'error';
  lastSync?: string;
  config?: any;
}

const SystemIntegrationsSettings: React.FC = () => {
  const [integrations] = useState<Integration[]>([
    {
      id: '1c',
      name: '1С:Предприятие',
      description: 'Синхронизация данных с 1С',
      icon: 'bi-calculator',
      status: 'active',
      lastSync: '2024-01-15 14:30'
    },
    {
      id: 'bitrix24',
      name: 'Bitrix24',
      description: 'Интеграция с CRM системой',
      icon: 'bi-building',
      status: 'active',
      lastSync: '2024-01-15 13:45'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Уведомления в Slack',
      icon: 'bi-chat-dots',
      status: 'inactive'
    },
    {
      id: 'email',
      name: 'Email сервер',
      description: 'SMTP настройки для рассылок',
      icon: 'bi-envelope',
      status: 'active',
      lastSync: '2024-01-15 12:00'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Синхронизация календарей',
      icon: 'bi-calendar-event',
      status: 'error',
      lastSync: '2024-01-14 18:20'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Уведомления в Telegram',
      icon: 'bi-telegram',
      status: 'inactive'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Активна</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Неактивна</span>;
      case 'error':
        return <span className="badge bg-danger">Ошибка</span>;
      default:
        return <span className="badge bg-secondary">Неизвестно</span>;
    }
  };

  const handleIntegrationToggle = (integration: Integration) => {
    console.log('Переключение интеграции:', integration.id);
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleTestConnection = (integration: Integration) => {
    console.log('Тестирование соединения:', integration.id);
  };

  const handleSyncNow = (integration: Integration) => {
    console.log('Синхронизация:', integration.id);
  };

  return (
    <div className="system-settings-page">
      <h1 className="mb-4">
        <i className="bi bi-plug text-primary me-2"></i>
        Интеграции системы
      </h1>
      
      <div className="mb-3 text-muted" style={{ maxWidth: '600px' }}>
        Управляйте внешними интеграциями системы. Настройте подключения к CRM, календарям, мессенджерам и другим сервисам.
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Доступные интеграции</h5>
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-plus me-2"></i>
                Добавить интеграцию
              </button>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '50px' }}></th>
                      <th>Интеграция</th>
                      <th>Статус</th>
                      <th>Последняя синхронизация</th>
                      <th style={{ width: '120px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {integrations.map(integration => (
                      <tr key={integration.id}>
                        <td>
                          <i className={`bi ${integration.icon} fs-4 text-primary`}></i>
                        </td>
                        <td>
                          <div>
                            <div className="fw-semibold">{integration.name}</div>
                            <div className="text-muted small">{integration.description}</div>
                          </div>
                        </td>
                        <td>{getStatusBadge(integration.status)}</td>
                        <td>
                          {integration.lastSync ? (
                            <span className="text-muted small">{integration.lastSync}</span>
                          ) : (
                            <span className="text-muted small">Не синхронизировалась</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-secondary"
                              title="Настроить"
                              onClick={() => handleConfigure(integration)}
                            >
                              <i className="bi bi-gear"></i>
                            </button>
                            {integration.status === 'active' && (
                              <>
                                <button 
                                  className="btn btn-outline-info"
                                  title="Тест соединения"
                                  onClick={() => handleTestConnection(integration)}
                                >
                                  <i className="bi bi-arrow-clockwise"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-success"
                                  title="Синхронизировать сейчас"
                                  onClick={() => handleSyncNow(integration)}
                                >
                                  <i className="bi bi-arrow-repeat"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Статистика интеграций */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Статистика интеграций</h6>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Активные интеграции</span>
                <span className="badge bg-success">
                  {integrations.filter(i => i.status === 'active').length}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Неактивные</span>
                <span className="badge bg-secondary">
                  {integrations.filter(i => i.status === 'inactive').length}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>С ошибками</span>
                <span className="badge bg-danger">
                  {integrations.filter(i => i.status === 'error').length}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Всего</span>
                <span className="badge bg-primary">{integrations.length}</span>
              </div>
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">Быстрые действия</h6>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary w-100 mb-2">
                <i className="bi bi-arrow-repeat me-2"></i>
                Синхронизировать все
              </button>
              <button className="btn btn-outline-warning w-100 mb-2">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Проверить ошибки
              </button>
              <button className="btn btn-outline-info w-100">
                <i className="bi bi-download me-2"></i>
                Экспорт логов
              </button>
            </div>
          </div>

          {/* Популярные интеграции */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Популярные интеграции</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-2 p-2 border rounded">
                <i className="bi bi-microsoft text-primary me-2"></i>
                <div className="flex-grow-1">
                  <div className="small fw-semibold">Microsoft Teams</div>
                  <div className="small text-muted">Уведомления в Teams</div>
                </div>
                <button className="btn btn-sm btn-outline-primary">Добавить</button>
              </div>
              <div className="d-flex align-items-center mb-2 p-2 border rounded">
                <i className="bi bi-google text-success me-2"></i>
                <div className="flex-grow-1">
                  <div className="small fw-semibold">Google Workspace</div>
                  <div className="small text-muted">Полная интеграция</div>
                </div>
                <button className="btn btn-sm btn-outline-primary">Добавить</button>
              </div>
              <div className="d-flex align-items-center p-2 border rounded">
                <i className="bi bi-whatsapp text-success me-2"></i>
                <div className="flex-grow-1">
                  <div className="small fw-semibold">WhatsApp Business</div>
                  <div className="small text-muted">Уведомления в WhatsApp</div>
                </div>
                <button className="btn btn-sm btn-outline-primary">Добавить</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно конфигурации */}
      {showConfigModal && selectedIntegration && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${selectedIntegration.icon} me-2`}></i>
                  Настройка {selectedIntegration.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowConfigModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">URL сервера</label>
                  <input type="text" className="form-control" placeholder="https://api.example.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">API ключ</label>
                  <input type="password" className="form-control" placeholder="Введите API ключ" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Секретный ключ</label>
                  <input type="password" className="form-control" placeholder="Введите секретный ключ" />
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="enableSync" />
                  <label className="form-check-label" htmlFor="enableSync">
                    Включить автоматическую синхронизацию
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowConfigModal(false)}
                >
                  Отмена
                </button>
                <button type="button" className="btn btn-primary">
                  Сохранить настройки
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemIntegrationsSettings; 