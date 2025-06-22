import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import './SystemSettings.css';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  category: string;
  module: string;
  lastSync?: string;
  config?: any;
  priority: 'high' | 'medium' | 'low';
  type: 'api' | 'webhook' | 'oauth' | 'smtp' | 'database';
  isManual?: boolean;
}

const SystemIntegrationsSettings: React.FC = () => {
  const { addToast } = useAppContext();
  
  const [integrations] = useState<Integration[]>([
    // === СИСТЕМНЫЕ ИНТЕГРАЦИИ ===
    {
      id: '1c',
      name: '1С:Предприятие',
      description: 'Синхронизация данных с 1С',
      icon: 'bi-calculator',
      status: 'active',
      category: 'Системные',
      module: 'system',
      lastSync: '2024-01-15 14:30',
      priority: 'high',
      type: 'api'
    },
    {
      id: 'bitrix24',
      name: 'Bitrix24',
      description: 'Интеграция с CRM системой',
      icon: 'bi-building',
      status: 'active',
      category: 'Системные',
      module: 'system',
      lastSync: '2024-01-15 13:45',
      priority: 'high',
      type: 'api'
    },
    {
      id: 'email',
      name: 'Email сервер',
      description: 'SMTP настройки для рассылок',
      icon: 'bi-envelope',
      status: 'active',
      category: 'Системные',
      module: 'system',
      lastSync: '2024-01-15 12:00',
      priority: 'high',
      type: 'smtp'
    },
    {
      id: 'calendar',
      name: 'Google Calendar',
      description: 'Синхронизация календарей',
      icon: 'bi-calendar-event',
      status: 'error',
      category: 'Системные',
      module: 'system',
      lastSync: '2024-01-14 18:20',
      priority: 'medium',
      type: 'oauth'
    },

    // === СОТРУДНИКИ ===
    {
      id: 'adp',
      name: 'ADP Workforce',
      description: 'Интеграция с системой расчета зарплат',
      icon: 'bi-cash-stack',
      status: 'active',
      category: 'Сотрудники',
      module: 'employees',
      lastSync: '2024-01-15 09:15',
      priority: 'high',
      type: 'api'
    },
    {
      id: 'workday',
      name: 'Workday HCM',
      description: 'Интеграция с HR-системой',
      icon: 'bi-people',
      status: 'inactive',
      category: 'Сотрудники',
      module: 'employees',
      priority: 'medium',
      type: 'api'
    },
    {
      id: 'bamboo',
      name: 'BambooHR',
      description: 'Управление данными сотрудников',
      icon: 'bi-person-badge',
      status: 'pending',
      category: 'Сотрудники',
      module: 'employees',
      priority: 'low',
      type: 'api'
    },

    // === РЕКРУТИНГ ===
    {
      id: 'greenhouse',
      name: 'Greenhouse',
      description: 'ATS система для рекрутинга',
      icon: 'bi-person-plus',
      status: 'active',
      category: 'Рекрутинг',
      module: 'recruiting',
      lastSync: '2024-01-15 11:30',
      priority: 'high',
      type: 'api'
    },
    {
      id: 'lever',
      name: 'Lever',
      description: 'Платформа для найма',
      icon: 'bi-briefcase',
      status: 'inactive',
      category: 'Рекрутинг',
      module: 'recruiting',
      priority: 'medium',
      type: 'api'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Recruiter',
      description: 'Поиск кандидатов в LinkedIn',
      icon: 'bi-linkedin',
      status: 'active',
      category: 'Рекрутинг',
      module: 'recruiting',
      lastSync: '2024-01-15 10:45',
      priority: 'high',
      type: 'oauth'
    },

    // === C&B ===
    {
      id: 'gusto',
      name: 'Gusto',
      description: 'Расчет зарплат и налогов',
      icon: 'bi-calculator',
      status: 'active',
      category: 'C&B',
      module: 'cb',
      lastSync: '2024-01-15 08:00',
      priority: 'high',
      type: 'api'
    },
    {
      id: 'paychex',
      name: 'Paychex',
      description: 'Обработка платежных ведомостей',
      icon: 'bi-credit-card',
      status: 'inactive',
      category: 'C&B',
      module: 'cb',
      priority: 'medium',
      type: 'api'
    },

    // === L&D ===
    {
      id: 'coursera',
      name: 'Coursera for Business',
      description: 'Онлайн-курсы и обучение',
      icon: 'bi-mortarboard',
      status: 'active',
      category: 'L&D',
      module: 'ld',
      lastSync: '2024-01-15 16:20',
      priority: 'medium',
      type: 'api'
    },
    {
      id: 'udemy',
      name: 'Udemy Business',
      description: 'Платформа онлайн-обучения',
      icon: 'bi-book',
      status: 'inactive',
      category: 'L&D',
      module: 'ld',
      priority: 'low',
      type: 'api'
    },
    {
      id: 'skillshare',
      name: 'Skillshare',
      description: 'Креативные курсы',
      icon: 'bi-palette',
      status: 'pending',
      category: 'L&D',
      module: 'ld',
      priority: 'low',
      type: 'api'
    },

    // === ПРОИЗВОДИТЕЛЬНОСТЬ ===
    {
      id: 'okta',
      name: 'Okta',
      description: 'Единая система аутентификации',
      icon: 'bi-shield-lock',
      status: 'active',
      category: 'Производительность',
      module: 'performance',
      lastSync: '2024-01-15 07:30',
      priority: 'high',
      type: 'oauth'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      description: 'CRM и управление продажами',
      icon: 'bi-graph-up',
      status: 'active',
      category: 'Производительность',
      module: 'performance',
      lastSync: '2024-01-15 15:45',
      priority: 'high',
      type: 'api'
    },

    // === УЧЕТ ВРЕМЕНИ ===
    {
      id: 'toggl',
      name: 'Toggl Track',
      description: 'Учет рабочего времени',
      icon: 'bi-clock',
      status: 'active',
      category: 'Учет времени',
      module: 'time',
      lastSync: '2024-01-15 17:00',
      priority: 'medium',
      type: 'api'
    },
    {
      id: 'harvest',
      name: 'Harvest',
      description: 'Трекинг времени и проектов',
      icon: 'bi-stopwatch',
      status: 'inactive',
      category: 'Учет времени',
      module: 'time',
      priority: 'low',
      type: 'api'
    },

    // === КОММУНИКАЦИИ ===
    {
      id: 'slack',
      name: 'Slack',
      description: 'Уведомления в Slack',
      icon: 'bi-chat-dots',
      status: 'inactive',
      category: 'Коммуникации',
      module: 'corporate',
      priority: 'medium',
      type: 'webhook'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      description: 'Уведомления в Teams',
      icon: 'bi-microsoft',
      status: 'pending',
      category: 'Коммуникации',
      module: 'corporate',
      priority: 'medium',
      type: 'webhook'
    },
    {
      id: 'telegram',
      name: 'Telegram Bot',
      description: 'Уведомления в Telegram',
      icon: 'bi-telegram',
      status: 'inactive',
      category: 'Коммуникации',
      module: 'corporate',
      priority: 'low',
      type: 'webhook'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'Уведомления в WhatsApp',
      icon: 'bi-whatsapp',
      status: 'pending',
      category: 'Коммуникации',
      module: 'corporate',
      priority: 'low',
      type: 'api'
    },

    // === ДОКУМЕНТЫ ===
    {
      id: 'google_docs',
      name: 'Google Workspace',
      description: 'Полная интеграция с Google',
      icon: 'bi-google',
      status: 'active',
      category: 'Документы',
      module: 'hrops',
      lastSync: '2024-01-15 14:15',
      priority: 'high',
      type: 'oauth'
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Облачное хранилище документов',
      icon: 'bi-cloud',
      status: 'inactive',
      category: 'Документы',
      module: 'hrops',
      priority: 'medium',
      type: 'api'
    },
    {
      id: 'box',
      name: 'Box',
      description: 'Управление документами',
      icon: 'bi-folder2-open',
      status: 'pending',
      category: 'Документы',
      module: 'hrops',
      priority: 'low',
      type: 'api'
    },

    // === РУЧНЫЕ ИНТЕГРАЦИИ ===
    {
      id: 'custom_api_1',
      name: 'Кастомная API интеграция',
      description: 'Интеграция с внутренней системой',
      icon: 'bi-code-square',
      status: 'active',
      category: 'Ручные интеграции',
      module: 'custom',
      lastSync: '2024-01-15 16:45',
      priority: 'high',
      type: 'api',
      isManual: true
    },
    {
      id: 'webhook_1',
      name: 'Webhook для уведомлений',
      description: 'Кастомный webhook для внешних систем',
      icon: 'bi-arrow-left-right',
      status: 'inactive',
      category: 'Ручные интеграции',
      module: 'custom',
      priority: 'medium',
      type: 'webhook',
      isManual: true
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories = ['all', ...Array.from(new Set(integrations.map(i => i.category)))];
  const modules = ['all', ...Array.from(new Set(integrations.map(i => i.module)))];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="badge bg-success">Активна</span>;
      case 'inactive':
        return <span className="badge bg-secondary">Неактивна</span>;
      case 'error':
        return <span className="badge bg-danger">Ошибка</span>;
      case 'pending':
        return <span className="badge bg-warning">Ожидает</span>;
      default:
        return <span className="badge bg-secondary">Неизвестно</span>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="badge bg-danger bg-opacity-75">Высокий</span>;
      case 'medium':
        return <span className="badge bg-warning bg-opacity-75">Средний</span>;
      case 'low':
        return <span className="badge bg-info bg-opacity-75">Низкий</span>;
      default:
        return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <i className="bi bi-code-slash text-primary"></i>;
      case 'webhook':
        return <i className="bi bi-arrow-left-right text-success"></i>;
      case 'oauth':
        return <i className="bi bi-shield-check text-warning"></i>;
      case 'smtp':
        return <i className="bi bi-envelope text-info"></i>;
      case 'database':
        return <i className="bi bi-database text-secondary"></i>;
      default:
        return null;
    }
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesCategory = activeCategory === 'all' || integration.category === activeCategory;
    const matchesStatus = activeStatus === 'all' || integration.status === activeStatus;
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const groupedIntegrations = filteredIntegrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  const toggleCategory = (category: string) => {
    const newCollapsed = new Set(collapsedCategories);
    if (newCollapsed.has(category)) {
      newCollapsed.delete(category);
    } else {
      newCollapsed.add(category);
    }
    setCollapsedCategories(newCollapsed);
  };

  const handleIntegrationToggle = (integration: Integration) => {
    console.log('Переключение интеграции:', integration.id);
    addToast(`Интеграция ${integration.name} переключена`, { type: 'info', title: 'Обновлено' });
  };

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowConfigModal(true);
  };

  const handleTestConnection = (integration: Integration) => {
    console.log('Тестирование соединения:', integration.id);
    addToast(`Тестирование соединения с ${integration.name}...`, { type: 'info', title: 'Тест' });
  };

  const handleSyncNow = (integration: Integration) => {
    console.log('Синхронизация:', integration.id);
    addToast(`Синхронизация ${integration.name} запущена`, { type: 'success', title: 'Синхронизация' });
  };

  const handleSyncAll = () => {
    console.log('Синхронизация всех интеграций');
    addToast('Синхронизация всех интеграций запущена', { type: 'success', title: 'Массовая синхронизация' });
  };

  const handleCheckErrors = () => {
    console.log('Проверка ошибок');
    addToast('Проверка ошибок интеграций завершена', { type: 'info', title: 'Проверка' });
  };

  const handleAddIntegration = () => {
    addToast('Открытие каталога интеграций...', { type: 'info', title: 'Добавление' });
  };

  const handleCreateManualIntegration = () => {
    setShowCreateModal(true);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveCategory('all');
    setActiveStatus('all');
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-title">
            <i className="bi bi-plug"></i>
            <div>
              <h1>Интеграции</h1>
              <p className="settings-subtitle">
                Управляйте внешними интеграциями системы. Настройте подключения к CRM, календарям, мессенджерам и другим сервисам.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-content-wrapper">
        <div className="settings-layout">
          <div className="settings-main-content">
            {/* Фильтры и поиск в одну строку */}
            <div className="settings-section">
              <div className="settings-section-header">
                <i className="bi bi-funnel"></i>
                <h3>Фильтры и поиск</h3>
              </div>
              <div className="settings-form">
                <div className="d-flex gap-3 align-items-end">
                  <div className="flex-grow-1">
                    <label className="form-label">Поиск интеграций</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Название или описание..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div style={{ minWidth: '200px' }}>
                    <label className="form-label">Категория</label>
                    <select
                      className="form-select"
                      value={activeCategory}
                      onChange={(e) => setActiveCategory(e.target.value)}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'Все категории' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ minWidth: '150px' }}>
                    <label className="form-label">Статус</label>
                    <select 
                      className="form-select"
                      value={activeStatus}
                      onChange={(e) => setActiveStatus(e.target.value)}
                    >
                      <option value="all">Все статусы</option>
                      <option value="active">Активные</option>
                      <option value="inactive">Неактивные</option>
                      <option value="error">С ошибками</option>
                      <option value="pending">Ожидающие</option>
                    </select>
                  </div>
                  <div style={{ minWidth: '100px' }}>
                    <button className="btn btn-outline-secondary w-100" onClick={handleResetFilters}>
                      <i className="bi bi-arrow-clockwise"></i> Сброс
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка создания новых интеграций */}
            <div className="settings-section">
              <div className="settings-section-header">
                <i className="bi bi-plus-circle"></i>
                <h3>Создание интеграций</h3>
              </div>
              <div className="settings-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-catalog text-primary fs-2"></i>
                          </div>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Каталог интеграций</h5>
                        <p className="card-text text-muted mb-4">
                          Выберите готовую интеграцию из каталога популярных сервисов и CRM систем
                        </p>
                        <button className="btn btn-primary btn-lg w-100" onClick={handleAddIntegration}>
                          <i className="bi bi-search me-2"></i>Открыть каталог
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card h-100 border-0 shadow-sm hover-lift">
                      <div className="card-body text-center p-4">
                        <div className="mb-3">
                          <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                            <i className="bi bi-code-square text-success fs-2"></i>
                          </div>
                        </div>
                        <h5 className="card-title fw-bold mb-3">Ручная настройка</h5>
                        <p className="card-text text-muted mb-4">
                          Создайте интеграцию вручную, указав все необходимые параметры и настройки
                        </p>
                        <button className="btn btn-success btn-lg w-100" onClick={handleCreateManualIntegration}>
                          <i className="bi bi-plus-circle me-2"></i>Создать вручную
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ручные интеграции */}
            {groupedIntegrations['Ручные интеграции'] && (
              <div className="settings-section">
                <div className="settings-section-header">
                  <i className="bi bi-tools"></i>
                  <h3>Ручные интеграции</h3>
                  <div className="settings-header-actions">
                    <span className="badge bg-success">{groupedIntegrations['Ручные интеграции'].length}</span>
                    <button 
                      className="btn btn-sm btn-outline-secondary ms-2"
                      onClick={() => toggleCategory('Ручные интеграции')}
                    >
                      <i className={`bi ${collapsedCategories.has('Ручные интеграции') ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
                    </button>
                  </div>
                </div>
                {!collapsedCategories.has('Ручные интеграции') && (
                  <div className="settings-form">
                    {groupedIntegrations['Ручные интеграции'].map(integration => (
                      <div key={integration.id} className={`integration-item d-flex align-items-center justify-content-between p-3 border rounded-3 mb-2 ${
                        integration.status === 'error' ? 'border-danger bg-danger-subtle' :
                        integration.status === 'inactive' ? 'bg-light' : ''
                      }`}>
                        <div className="d-flex align-items-center flex-grow-1">
                          <div className="me-3">
                            <i className={`bi ${integration.icon} fs-4 ${
                              integration.status === 'active' ? 'text-primary' :
                              integration.status === 'error' ? 'text-danger' :
                              'text-muted'
                            }`}></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="fw-semibold">{integration.name}</span>
                              <span className="badge bg-success bg-opacity-75">Ручная</span>
                              {getPriorityBadge(integration.priority)}
                              {getTypeIcon(integration.type)}
                            </div>
                            <div className="text-muted small mb-1">{integration.description}</div>
                            <div className="d-flex align-items-center gap-3">
                              {getStatusBadge(integration.status)}
                              {integration.lastSync && (
                                <span className="text-muted small">
                                  Последняя синхронизация: {integration.lastSync}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleConfigure(integration)}
                            title="Настроить"
                          >
                            <i className="bi bi-gear"></i>
                          </button>
                          {integration.status === 'active' && (
                            <>
                              <button 
                                className="btn btn-outline-info btn-sm"
                                onClick={() => handleTestConnection(integration)}
                                title="Тест соединения"
                              >
                                <i className="bi bi-arrow-clockwise"></i>
                              </button>
                              <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={() => handleSyncNow(integration)}
                                title="Синхронизировать сейчас"
                              >
                                <i className="bi bi-arrow-repeat"></i>
                              </button>
                            </>
                          )}
                          {integration.status === 'inactive' && (
                            <button 
                              className="btn btn-outline-success btn-sm"
                              onClick={() => handleIntegrationToggle(integration)}
                              title="Активировать"
                            >
                              <i className="bi bi-play"></i>
                            </button>
                          )}
                          {integration.status === 'error' && (
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleTestConnection(integration)}
                              title="Проверить ошибку"
                            >
                              <i className="bi bi-exclamation-triangle"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Интеграции по категориям */}
            {Object.entries(groupedIntegrations)
              .filter(([category]) => category !== 'Ручные интеграции')
              .map(([category, categoryIntegrations]) => (
                <div key={category} className="settings-section">
                  <div className="settings-section-header">
                    <i className="bi bi-collection"></i>
                    <h3>{category}</h3>
                    <div className="settings-header-actions">
                      <span className="badge bg-primary">{categoryIntegrations.length}</span>
                      <button 
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() => toggleCategory(category)}
                      >
                        <i className={`bi ${collapsedCategories.has(category) ? 'bi-chevron-down' : 'bi-chevron-up'}`}></i>
                      </button>
                    </div>
                  </div>
                  {!collapsedCategories.has(category) && (
                    <div className="settings-form">
                      {categoryIntegrations.map(integration => (
                        <div key={integration.id} className={`integration-item d-flex align-items-center justify-content-between p-3 border rounded-3 mb-3 ${
                          integration.status === 'error' ? 'border-danger bg-danger-subtle' :
                          integration.status === 'inactive' ? 'bg-light' : ''
                        }`}>
                          <div className="d-flex align-items-center flex-grow-1">
                            <div className="me-3">
                              <i className={`bi ${integration.icon} fs-4 ${
                                integration.status === 'active' ? 'text-primary' :
                                integration.status === 'error' ? 'text-danger' :
                                'text-muted'
                              }`}></i>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-1">
                                <span className="fw-semibold">{integration.name}</span>
                                {getPriorityBadge(integration.priority)}
                                {getTypeIcon(integration.type)}
                              </div>
                              <div className="text-muted small mb-1">{integration.description}</div>
                              <div className="d-flex align-items-center gap-3">
                                {getStatusBadge(integration.status)}
                                {integration.lastSync && (
                                  <span className="text-muted small">
                                    Последняя синхронизация: {integration.lastSync}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <button 
                              className="btn btn-outline-secondary btn-sm"
                              onClick={() => handleConfigure(integration)}
                              title="Настроить"
                            >
                              <i className="bi bi-gear"></i>
                            </button>
                            {integration.status === 'active' && (
                              <>
                                <button 
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() => handleTestConnection(integration)}
                                  title="Тест соединения"
                                >
                                  <i className="bi bi-arrow-clockwise"></i>
                                </button>
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => handleSyncNow(integration)}
                                  title="Синхронизировать сейчас"
                                >
                                  <i className="bi bi-arrow-repeat"></i>
                                </button>
                              </>
                            )}
                            {integration.status === 'inactive' && (
                              <button 
                                className="btn btn-outline-success btn-sm"
                                onClick={() => handleIntegrationToggle(integration)}
                                title="Активировать"
                              >
                                <i className="bi bi-play"></i>
                              </button>
                            )}
                            {integration.status === 'error' && (
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleTestConnection(integration)}
                                title="Проверить ошибку"
                              >
                                <i className="bi bi-exclamation-triangle"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="settings-sidebar">
            <div className="settings-section">
              <div className="settings-section-header">
                <i className="bi bi-graph-up"></i>
                <h3>Статистика</h3>
              </div>
              <ul className="settings-stats-list">
                <li><span>Активные интеграции</span><span className="badge bg-success">{integrations.filter(i => i.status === 'active').length}</span></li>
                <li><span>Неактивные</span><span className="badge bg-secondary">{integrations.filter(i => i.status === 'inactive').length}</span></li>
                <li><span>С ошибками</span><span className="badge bg-danger">{integrations.filter(i => i.status === 'error').length}</span></li>
                <li><span>Ожидающие</span><span className="badge bg-warning">{integrations.filter(i => i.status === 'pending').length}</span></li>
                <li><span>Ручные интеграции</span><span className="badge bg-info">{integrations.filter(i => i.isManual).length}</span></li>
                <li><span>Всего интеграций</span><span className="badge bg-primary">{integrations.length}</span></li>
              </ul>
            </div>
            <div className="settings-section mt-4">
              <div className="settings-section-header">
                <i className="bi bi-play-circle"></i>
                <h3>Быстрые действия</h3>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" onClick={handleAddIntegration}>
                  <i className="bi bi-plus-circle me-2"></i>Добавить интеграцию
                </button>
                <button className="btn btn-success" onClick={handleCreateManualIntegration}>
                  <i className="bi bi-code-square me-2"></i>Создать вручную
                </button>
                <button className="btn btn-outline-primary" onClick={handleSyncAll}>
                  <i className="bi bi-arrow-repeat me-2"></i>Синхронизировать все
                </button>
                <button className="btn btn-outline-warning" onClick={handleCheckErrors}>
                  <i className="bi bi-exclamation-triangle me-2"></i>Проверить ошибки
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="bi bi-download me-2"></i>Экспорт логов
                </button>
              </div>
            </div>
            <div className="settings-section mt-4">
              <div className="settings-section-header">
                <i className="bi bi-star"></i>
                <h3>Популярные интеграции</h3>
              </div>
              <div className="d-grid gap-2">
                <div className="d-flex align-items-center p-2 border rounded">
                  <i className="bi bi-microsoft text-primary me-2"></i>
                  <div className="flex-grow-1">
                    <div className="small fw-semibold">Microsoft Teams</div>
                    <div className="small text-muted">Уведомления в Teams</div>
                  </div>
                  <button className="btn btn-sm btn-outline-primary">Добавить</button>
                </div>
                <div className="d-flex align-items-center p-2 border rounded">
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

      {/* Модальное окно создания интеграции */}
      {showCreateModal && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-code-square me-2"></i>
                  Создание новой интеграции
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Название интеграции</label>
                    <input type="text" className="form-control" placeholder="Введите название" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Тип интеграции</label>
                    <select className="form-select">
                      <option value="api">API</option>
                      <option value="webhook">Webhook</option>
                      <option value="oauth">OAuth</option>
                      <option value="smtp">SMTP</option>
                      <option value="database">Database</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Описание</label>
                    <textarea className="form-control" rows={3} placeholder="Описание интеграции"></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">URL сервера</label>
                    <input type="text" className="form-control" placeholder="https://api.example.com" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Приоритет</label>
                    <select className="form-select">
                      <option value="low">Низкий</option>
                      <option value="medium">Средний</option>
                      <option value="high">Высокий</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">API ключ</label>
                    <input type="password" className="form-control" placeholder="Введите API ключ" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Секретный ключ</label>
                    <input type="password" className="form-control" placeholder="Введите секретный ключ" />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Отмена
                </button>
                <button type="button" className="btn btn-success">
                  <i className="bi bi-plus-circle me-2"></i>Создать интеграцию
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