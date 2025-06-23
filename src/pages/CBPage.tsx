import React from 'react';
import './CBPage.css';
import { LineChart, Line, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, LabelList } from 'recharts';

const CBPage: React.FC = () => {
  // Моковые данные для задач
  const todoTasks = [
    {id:1, title:'Провести индексацию зарплат', desc:'Провести индексацию зарплат сотрудников согласно инфляции за первое полугодие. Срок: до 20 июня.', status:'На согласование', priority: 'high'},
    {id:2, title:'Проверить корректность начисления бонусов', desc:'Проверить начисления бонусов за май, выявить и исправить возможные ошибки. Срок: до 10 июня.', status:'На исполнение', priority: 'medium'},
    {id:3, title:'Согласовать бюджет на льготы', desc:'Провести согласование бюджета на корпоративные льготы на Q3. Срок: до 25 июня.', status:'На утверждение', priority: 'high'},
    {id:4, title:'Обновить грейды сотрудников', desc:'Провести пересмотр грейдов по итогам оценки эффективности. Срок: до 30 июня.', status:'Для информации', priority: 'low'}
  ];

  // Моковые данные для графиков (текущий и прошлый год)
  const payrollData = [
    { month: 'Янв', current: 45000000, prev: 41000000 },
    { month: 'Фев', current: 45200000, prev: 41500000 },
    { month: 'Мар', current: 45500000, prev: 42000000 },
    { month: 'Апр', current: 45800000, prev: 43000000 },
    { month: 'Май', current: 46000000, prev: 44000000 },
  ];
  const medianSalaryData = [
    { month: 'Янв', current: 420000, prev: 390000 },
    { month: 'Фев', current: 421000, prev: 395000 },
    { month: 'Мар', current: 422000, prev: 400000 },
    { month: 'Апр', current: 423000, prev: 410000 },
    { month: 'Май', current: 424000, prev: 415000 },
  ];
  const benefitsBudgetData = [
    { month: 'Янв', current: 5000000, prev: 4000000 },
    { month: 'Фев', current: 5100000, prev: 4200000 },
    { month: 'Мар', current: 5200000, prev: 4500000 },
    { month: 'Апр', current: 5300000, prev: 4800000 },
    { month: 'Май', current: 5400000, prev: 5000000 },
  ];

  // Функция для вычисления относительного изменения (в процентах)
  const getDelta = (curr: number, prev: number) => {
    if (!prev) return 0;
    return Math.round(((curr - prev) / prev) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'На согласование': return <span className='badge bg-info-subtle text-info me-2'>На согласование</span>;
      case 'На резолюции': return <span className='badge bg-primary-subtle text-primary me-2'>На резолюции</span>;
      case 'На утверждение': return <span className='badge bg-warning-subtle text-warning me-2'>На утверждение</span>;
      case 'На исполнение': return <span className='badge bg-success-subtle text-success me-2'>На исполнение</span>;
      case 'Для информации': return <span className='badge bg-secondary-subtle text-secondary me-2'>Для информации</span>;
      default: return <span className='badge bg-light text-dark me-2'>Без статуса</span>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high': return <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>;
      case 'medium': return <i className="bi bi-exclamation-circle text-warning me-2"></i>;
      case 'low': return <i className="bi bi-info-circle text-info me-2"></i>;
      default: return <i className="bi bi-circle text-muted me-2"></i>;
    }
  };

  const onTodoRowClick = (id: number) => {
    const task = todoTasks.find(t => t.id === id);
    if (task) {
      alert(`Задача: ${task.title}\n\n${task.desc}`);
    }
  };

  const completeTodoTask = (id: number) => {
    // В реальном приложении здесь была бы логика удаления задачи
    alert(`Задача ${id} завершена`);
  };

  return (
    <div className="cb-page-container">
      {/* KPI/SLA мини-карточки - первый ряд (4 карточки) */}
      <div className="card-grid">
        <div className="card-grid-item-4">
          <div className="card kpi-card border-success h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="kpi-icon-wrapper success">
                <i className="bi bi-clock-history"></i>
              </div>
              <div className="fw-semibold text-muted mb-1">SLA выплаты</div>
              <div className="fs-2 fw-bold text-success mb-2">98%</div>
              <small className="text-muted mb-3">Выполнено вовремя</small>
              <button className="btn btn-outline-success btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
        <div className="card-grid-item-4">
          <div className="card kpi-card border-primary h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="kpi-icon-wrapper primary">
                <i className="bi bi-graph-up-arrow"></i>
              </div>
              <div className="fw-semibold text-muted mb-1">KPI рост ЗП</div>
              <div className="fs-2 fw-bold text-primary mb-2">+7%</div>
              <small className="text-muted mb-3">Годовой прирост</small>
              <button className="btn btn-outline-primary btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
        <div className="card-grid-item-4">
          <div className="card kpi-card border-info h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="kpi-icon-wrapper info">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="fw-semibold text-muted mb-1">Бонусы вовремя</div>
              <div className="fs-2 fw-bold text-info mb-2">95%</div>
              <small className="text-muted mb-3">Выполнено</small>
              <button className="btn btn-outline-info btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
        <div className="card-grid-item-4">
          <div className="card kpi-card border-warning h-100">
            <div className="card-body text-center d-flex flex-column">
              <div className="kpi-icon-wrapper warning">
                <i className="bi bi-award"></i>
              </div>
              <div className="fw-semibold text-muted mb-1">Льготы</div>
              <div className="fs-2 fw-bold text-warning mb-2">7 дней</div>
              <small className="text-muted mb-3">Средний срок</small>
              <button className="btn btn-outline-warning btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Дашборды - второй ряд (3 карточки) */}
      <div className="card-grid">
        <div className="card-grid-item-3">
          <div className="card dashboard-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="dashboard-icon-wrapper primary me-3">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Фонд оплаты труда</h5>
                  <small className="text-muted">За месяц</small>
                </div>
              </div>
              <div className="mb-3">
                <h2 className="text-primary mb-0 d-inline-block fw-bold">{formatCurrency(45000000)}</h2>
              </div>
              <div className="mb-3" style={{height: 64}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={payrollData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis hide />
                    <Tooltip formatter={formatCurrency} labelFormatter={label => `Месяц: ${label}`} />
                    <Legend verticalAlign="top" height={24} iconType="circle"/>
                    <Bar dataKey="prev" fill="#e0e0e0" name="Прошлый год" maxBarSize={16} />
                    <Bar dataKey="current" fill="#1976d2" name="Текущий год" maxBarSize={16} >
                      <LabelList dataKey={d => getDelta(d.current, d.prev) + '%'} position="top" fill="#1976d2" fontSize={10} formatter={v => {
                        const num = typeof v === 'string' ? parseInt(v) : Number(v);
                        if (!isNaN(num)) return num > 0 ? `+${num}%` : `${num}%`;
                        return v;
                      }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <small className="text-muted">Рост: {getDelta(payrollData[payrollData.length-1].current, payrollData[payrollData.length-1].prev)}% к маю прошлого года</small>
              <button className="btn btn-outline-primary btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
        <div className="card-grid-item-3">
          <div className="card dashboard-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="dashboard-icon-wrapper success me-3">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Медианная зарплата</h5>
                  <small className="text-muted">По компании</small>
                </div>
              </div>
              <div className="mb-3">
                <h2 className="text-success mb-0 d-inline-block fw-bold">{formatCurrency(420000)}</h2>
              </div>
              <div className="mb-3" style={{height: 64}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={medianSalaryData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis hide />
                    <Tooltip formatter={formatCurrency} labelFormatter={label => `Месяц: ${label}`} />
                    <Legend verticalAlign="top" height={24} iconType="circle"/>
                    <Bar dataKey="prev" fill="#e0e0e0" name="Прошлый год" maxBarSize={16} />
                    <Bar dataKey="current" fill="#388e3c" name="Текущий год" maxBarSize={16} >
                      <LabelList dataKey={d => getDelta(d.current, d.prev) + '%'} position="top" fill="#388e3c" fontSize={10} formatter={v => {
                        const num = typeof v === 'string' ? parseInt(v) : Number(v);
                        if (!isNaN(num)) return num > 0 ? `+${num}%` : `${num}%`;
                        return v;
                      }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <small className="text-muted">Рост: {getDelta(medianSalaryData[medianSalaryData.length-1].current, medianSalaryData[medianSalaryData.length-1].prev)}% к маю прошлого года</small>
              <div className="mb-2">
                <div className="d-flex justify-content-between small text-muted mb-1">
                  <span>Год к году: <span className='fw-semibold text-success'>+22,000₸ (5.5%)</span></span>
                </div>
                <div className="d-flex justify-content-between small text-muted">
                  <span>Q2 к Q1: <span className='fw-semibold text-success'>+15,000₸ (3.7%)</span></span>
                </div>
              </div>
              <div className="mb-3">
                <div className="progress">
                  <div className="progress-bar bg-success" style={{width: '92%'}}></div>
                </div>
                <small className="text-muted">+3.7% за квартал</small>
              </div>
              <button className="btn btn-outline-success btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
        <div className="card-grid-item-3">
          <div className="card dashboard-card h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <div className="dashboard-icon-wrapper info me-3">
                  <i className="bi bi-award"></i>
                </div>
                <div>
                  <h5 className="card-title mb-1">Бюджет на льготы</h5>
                  <small className="text-muted">Ежемесячно</small>
                </div>
              </div>
              <div className="mb-3">
                <h2 className="text-info mb-0 d-inline-block fw-bold">{formatCurrency(5000000)}</h2>
              </div>
              <div className="mb-3" style={{height: 64}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benefitsBudgetData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis hide />
                    <Tooltip formatter={formatCurrency} labelFormatter={label => `Месяц: ${label}`} />
                    <Legend verticalAlign="top" height={24} iconType="circle"/>
                    <Bar dataKey="prev" fill="#e0e0e0" name="Прошлый год" maxBarSize={16} />
                    <Bar dataKey="current" fill="#0097a7" name="Текущий год" maxBarSize={16} >
                      <LabelList dataKey={d => getDelta(d.current, d.prev) + '%'} position="top" fill="#0097a7" fontSize={10} formatter={v => {
                        const num = typeof v === 'string' ? parseInt(v) : Number(v);
                        if (!isNaN(num)) return num > 0 ? `+${num}%` : `${num}%`;
                        return v;
                      }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <small className="text-muted">Рост: {getDelta(benefitsBudgetData[benefitsBudgetData.length-1].current, benefitsBudgetData[benefitsBudgetData.length-1].prev)}% к маю прошлого года</small>
              <div className="mb-3">
                <div className="progress">
                  <div className="progress-bar bg-info" style={{width: '78%'}}></div>
                </div>
                <small className="text-muted">78% использовано</small>
              </div>
              <button className="btn btn-outline-info btn-sm w-100 mt-auto">
                <i className="bi bi-arrow-right me-1"></i>
                Перейти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ToDo задачи */}
      <div className="card content-card mb-4">
        <div className="card-header d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="card-icon-wrapper me-3">
              <i className="bi bi-clipboard-check"></i>
            </div>
            <h5 className="mb-0">Задачи, требующие внимания</h5>
          </div>
          <button className="btn btn-primary btn-sm">
            <i className="bi bi-plus me-1"></i> 
            Новая задача
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {todoTasks.map(task => (
            <li key={task.id} 
                className="list-group-item d-flex justify-content-between align-items-center animated-row" 
                onClick={() => onTodoRowClick(task.id)}>
              <div className="d-flex align-items-center gap-3">
                {getPriorityIcon(task.priority)}
                <div>
                  <span className="fw-semibold d-block">{task.title}</span>
                  <small className="text-muted">{task.desc}</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                {getStatusBadge(task.status)}
                <button 
                  className="btn btn-success btn-sm" 
                  title="Завершить" 
                  onClick={(e) => {
                    e.stopPropagation();
                    completeTodoTask(task.id);
                  }}>
                  <i className="bi bi-check2"></i>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Таблица последних действий */}
      <div className="card content-card">
        <div className="card-header">
          <div className="d-flex align-items-center">
            <div className="card-icon-wrapper me-3">
              <i className="bi bi-clock-history"></i>
            </div>
            <h5 className="mb-0">Последние действия</h5>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Дата</th>
                  <th>Сотрудник</th>
                  <th>Тип</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                <tr className="animated-row">
                  <td><span className="fw-semibold">01.06.2024</span></td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm me-2">ИИ</div>
                      <span>Иванов Иван</span>
                    </div>
                  </td>
                  <td><span className="badge bg-warning-subtle text-warning">Премия</span></td>
                  <td className="fw-bold text-success">{formatCurrency(150000)}</td>
                  <td><span className="badge bg-success">Выплачено</span></td>
                </tr>
                <tr className="animated-row">
                  <td><span className="fw-semibold">28.05.2024</span></td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm me-2">ПП</div>
                      <span>Петров Петр</span>
                    </div>
                  </td>
                  <td><span className="badge bg-primary-subtle text-primary">Зарплата</span></td>
                  <td className="fw-bold text-success">{formatCurrency(450000)}</td>
                  <td><span className="badge bg-success">Выплачено</span></td>
                </tr>
                <tr className="animated-row">
                  <td><span className="fw-semibold">27.05.2024</span></td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm me-2">СА</div>
                      <span>Сидорова Анна</span>
                    </div>
                  </td>
                  <td><span className="badge bg-info-subtle text-info">Льгота</span></td>
                  <td className="fw-bold text-success">{formatCurrency(50000)}</td>
                  <td><span className="badge bg-warning">В обработке</span></td>
                </tr>
                <tr className="animated-row">
                  <td><span className="fw-semibold">25.05.2024</span></td>
                  <td>
                    <div className="d-flex align-items-center">
                      <div className="avatar-sm me-2">КА</div>
                      <span>Ким Алексей</span>
                    </div>
                  </td>
                  <td><span className="badge bg-secondary-subtle text-secondary">Грейд</span></td>
                  <td className="fw-bold">—</td>
                  <td><span className="badge bg-info">Обновлено</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CBPage; 