import React, { useState } from 'react';
import './ComponentsDemoPage.css';

// Импорты для компонентов (будут созданы позже)
import DataTable from '../../components/DataTable/DataTable';
import DetailView from '../../components/DetailView/DetailView';
import FormBuilder from '../../components/FormBuilder/FormBuilder';
import BulkActions from '../../components/BulkActions/BulkActions';

interface Employee {
  id: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  hireDate: string;
}

interface Vacancy {
  id: number;
  title: string;
  department: string;
  location: string;
  salary: string;
  status: 'open' | 'closed' | 'draft';
  candidates: number;
  createdAt: string;
}

const ComponentsDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Моковые данные
  const employees: Employee[] = [
    {
      id: 1,
      name: 'Иван Петров',
      position: 'Frontend Developer',
      department: 'IT',
      email: 'ivan.petrov@company.com',
      phone: '+7 (999) 123-45-67',
      status: 'active',
      hireDate: '2023-01-15'
    },
    {
      id: 2,
      name: 'Мария Сидорова',
      position: 'HR Manager',
      department: 'HR',
      email: 'maria.sidorova@company.com',
      phone: '+7 (999) 234-56-78',
      status: 'active',
      hireDate: '2022-08-20'
    },
    {
      id: 3,
      name: 'Алексей Козлов',
      position: 'Project Manager',
      department: 'PMO',
      email: 'alexey.kozlov@company.com',
      phone: '+7 (999) 345-67-89',
      status: 'inactive',
      hireDate: '2021-12-10'
    }
  ];

  const vacancies: Vacancy[] = [
    {
      id: 1,
      title: 'Senior React Developer',
      department: 'IT',
      location: 'Москва',
      salary: '150,000 - 200,000 ₽',
      status: 'open',
      candidates: 12,
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'Санкт-Петербург',
      salary: '120,000 - 160,000 ₽',
      status: 'open',
      candidates: 8,
      createdAt: '2024-01-08'
    },
    {
      id: 3,
      title: 'Product Manager',
      department: 'Product',
      location: 'Москва',
      salary: '180,000 - 250,000 ₽',
      status: 'closed',
      candidates: 15,
      createdAt: '2023-12-20'
    }
  ];

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setShowDetail(true);
  };

  const handleBulkAction = (action: string) => {
    console.log(`Выполняется массовое действие: ${action} для элементов:`, selectedItems);
    // Здесь будет логика массовых операций
  };

  const handleFormSubmit = (data: any) => {
    console.log('Данные формы:', data);
    setShowForm(false);
  };

  const renderEmployeesTable = () => (
    <div className="demo-section">
      <div className="section-header">
        <h3>Сотрудники</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Добавить сотрудника
        </button>
      </div>
      
      <DataTable
        data={employees}
        columns={[
          { key: 'name', label: 'Имя', sortable: true },
          { key: 'position', label: 'Должность', sortable: true },
          { key: 'department', label: 'Отдел', sortable: true },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Статус', sortable: true },
          { key: 'hireDate', label: 'Дата найма', sortable: true }
        ]}
        onRowClick={handleRowClick}
        selectable={true}
        onSelectionChange={setSelectedItems}
        bulkActions={[
          { label: 'Активировать', action: 'activate' },
          { label: 'Деактивировать', action: 'deactivate' },
          { label: 'Удалить', action: 'delete' }
        ]}
        onBulkAction={handleBulkAction}
      />
    </div>
  );

  const renderVacanciesTable = () => (
    <div className="demo-section">
      <div className="section-header">
        <h3>Вакансии</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Создать вакансию
        </button>
      </div>
      
      <DataTable
        data={vacancies}
        columns={[
          { key: 'title', label: 'Название', sortable: true },
          { key: 'department', label: 'Отдел', sortable: true },
          { key: 'location', label: 'Локация', sortable: true },
          { key: 'salary', label: 'Зарплата' },
          { key: 'status', label: 'Статус', sortable: true },
          { key: 'candidates', label: 'Кандидаты', sortable: true },
          { key: 'createdAt', label: 'Дата создания', sortable: true }
        ]}
        onRowClick={handleRowClick}
        selectable={true}
        onSelectionChange={setSelectedItems}
        bulkActions={[
          { label: 'Открыть', action: 'open' },
          { label: 'Закрыть', action: 'close' },
          { label: 'Удалить', action: 'delete' }
        ]}
        onBulkAction={handleBulkAction}
      />
    </div>
  );

  const renderFormDemo = () => (
    <div className="demo-section">
      <h3>Универсальный конструктор форм</h3>
      <FormBuilder
        fields={[
          {
            name: 'name',
            label: 'Имя',
            type: 'text',
            required: true,
            placeholder: 'Введите имя'
          },
          {
            name: 'email',
            label: 'Email',
            type: 'email',
            required: true,
            placeholder: 'example@company.com'
          },
          {
            name: 'position',
            label: 'Должность',
            type: 'select',
            options: [
              { value: 'developer', label: 'Разработчик' },
              { value: 'designer', label: 'Дизайнер' },
              { value: 'manager', label: 'Менеджер' }
            ],
            required: true
          },
          {
            name: 'department',
            label: 'Отдел',
            type: 'select',
            options: [
              { value: 'it', label: 'IT' },
              { value: 'hr', label: 'HR' },
              { value: 'marketing', label: 'Маркетинг' }
            ],
            required: true
          },
          {
            name: 'hireDate',
            label: 'Дата найма',
            type: 'date',
            required: true
          },
          {
            name: 'notes',
            label: 'Примечания',
            type: 'textarea',
            placeholder: 'Дополнительная информация'
          }
        ]}
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
        submitLabel="Сохранить"
        cancelLabel="Отмена"
      />
    </div>
  );

  const renderDetailDemo = () => (
    <div className="demo-section">
      <h3>Детальная карточка</h3>
      <DetailView
        data={selectedItem}
        tabs={[
          {
            id: 'general',
            label: 'Общая информация',
            content: (
              <div className="detail-content">
                <div className="detail-row">
                  <span className="label">Имя:</span>
                  <span className="value">{selectedItem?.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Должность:</span>
                  <span className="value">{selectedItem?.position}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Отдел:</span>
                  <span className="value">{selectedItem?.department}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedItem?.email}</span>
                </div>
              </div>
            )
          },
          {
            id: 'history',
            label: 'История',
            content: (
              <div className="detail-content">
                <p>История изменений и активности</p>
              </div>
            )
          },
          {
            id: 'documents',
            label: 'Документы',
            content: (
              <div className="detail-content">
                <p>Список связанных документов</p>
              </div>
            )
          }
        ]}
        actions={[
          { label: 'Редактировать', action: 'edit', variant: 'primary' },
          { label: 'Удалить', action: 'delete', variant: 'danger' }
        ]}
        onAction={(action: string) => console.log('Действие:', action)}
        onClose={() => setShowDetail(false)}
      />
    </div>
  );

  return (
    <div className="components-demo-page">
      <div className="demo-header">
        <h1>Демонстрация переиспользуемых компонентов</h1>
        <p>Примеры CRUD-операций и универсальных компонентов</p>
      </div>

      <div className="demo-tabs">
        <button 
          className={`tab-button ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          Сотрудники
        </button>
        <button 
          className={`tab-button ${activeTab === 'vacancies' ? 'active' : ''}`}
          onClick={() => setActiveTab('vacancies')}
        >
          Вакансии
        </button>
        <button 
          className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          Формы
        </button>
        <button 
          className={`tab-button ${activeTab === 'detail' ? 'active' : ''}`}
          onClick={() => setActiveTab('detail')}
        >
          Детали
        </button>
      </div>

      <div className="demo-content">
        {activeTab === 'employees' && renderEmployeesTable()}
        {activeTab === 'vacancies' && renderVacanciesTable()}
        {activeTab === 'form' && renderFormDemo()}
        {activeTab === 'detail' && selectedItem && renderDetailDemo()}
      </div>

      {/* Модальные окна */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            {renderFormDemo()}
          </div>
        </div>
      )}

      {showDetail && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            {renderDetailDemo()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComponentsDemoPage; 