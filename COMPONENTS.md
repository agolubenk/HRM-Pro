# Переиспользуемые компоненты HRM-Pro

## Обзор

Этот документ описывает универсальные компоненты, созданные для переиспользования в различных модулях HRM-системы.

## Демонстрационная страница

Посмотреть все компоненты в действии можно по адресу: `/components/demo`

## Компоненты

### 1. DataTable

Универсальная таблица данных с расширенным функционалом.

#### Возможности:
- ✅ Сортировка по колонкам
- ✅ Поиск по всем полям
- ✅ Фильтрация по колонкам
- ✅ Пагинация
- ✅ Выбор строк (checkbox)
- ✅ Массовые операции
- ✅ Кастомные рендереры для ячеек
- ✅ Адаптивный дизайн

#### Использование:

```tsx
import DataTable from './components/DataTable/DataTable';

const columns = [
  { key: 'name', label: 'Имя', sortable: true },
  { key: 'position', label: 'Должность', sortable: true },
  { key: 'status', label: 'Статус', sortable: true }
];

const data = [
  { id: 1, name: 'Иван Петров', position: 'Developer', status: 'active' },
  { id: 2, name: 'Мария Сидорова', position: 'Manager', status: 'inactive' }
];

<DataTable
  data={data}
  columns={columns}
  onRowClick={(row) => console.log('Клик по строке:', row)}
  selectable={true}
  onSelectionChange={(selectedIds) => console.log('Выбранные:', selectedIds)}
  bulkActions={[
    { label: 'Активировать', action: 'activate' },
    { label: 'Удалить', action: 'delete', variant: 'danger' }
  ]}
  onBulkAction={(action, selectedIds) => console.log(action, selectedIds)}
/>
```

### 2. DetailView

Компонент для отображения детальной информации с табами.

#### Возможности:
- ✅ Табы с контентом
- ✅ Действия (кнопки)
- ✅ Закрытие модального окна
- ✅ Кастомный заголовок
- ✅ Адаптивный дизайн

#### Использование:

```tsx
import DetailView from './components/DetailView/DetailView';

const tabs = [
  {
    id: 'general',
    label: 'Общая информация',
    content: <div>Основная информация...</div>
  },
  {
    id: 'history',
    label: 'История',
    content: <div>История изменений...</div>
  }
];

const actions = [
  { label: 'Редактировать', action: 'edit', variant: 'primary' },
  { label: 'Удалить', action: 'delete', variant: 'danger' }
];

<DetailView
  data={employeeData}
  tabs={tabs}
  actions={actions}
  onAction={(action) => console.log('Действие:', action)}
  onClose={() => setShowDetail(false)}
  title="Профиль сотрудника"
/>
```

### 3. FormBuilder

Универсальный конструктор форм с валидацией.

#### Поддерживаемые типы полей:
- `text` - текстовое поле
- `email` - поле для email
- `password` - поле для пароля
- `number` - числовое поле
- `date` - поле для даты
- `select` - выпадающий список
- `textarea` - многострочное поле
- `checkbox` - чекбокс
- `radio` - радиокнопки

#### Возможности:
- ✅ Валидация полей
- ✅ Кастомные правила валидации
- ✅ Обязательные поля
- ✅ Плейсхолдеры
- ✅ Опции для select/radio
- ✅ Ограничения для числовых полей
- ✅ Адаптивный дизайн

#### Использование:

```tsx
import FormBuilder from './components/FormBuilder/FormBuilder';

const fields = [
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
    validation: {
      pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
      message: 'Введите корректный email'
    }
  },
  {
    name: 'position',
    label: 'Должность',
    type: 'select',
    required: true,
    options: [
      { value: 'developer', label: 'Разработчик' },
      { value: 'manager', label: 'Менеджер' }
    ]
  },
  {
    name: 'notes',
    label: 'Примечания',
    type: 'textarea',
    rows: 4
  }
];

<FormBuilder
  fields={fields}
  onSubmit={(data) => console.log('Данные формы:', data)}
  onCancel={() => setShowForm(false)}
  submitLabel="Сохранить"
  cancelLabel="Отмена"
  initialData={{ name: 'Иван' }}
  title="Добавление сотрудника"
/>
```

### 4. BulkActions

Компонент для массовых операций с выбранными элементами.

#### Возможности:
- ✅ Отображение количества выбранных элементов
- ✅ Кнопки "Выбрать все" и "Снять выделение"
- ✅ Массовые действия с иконками
- ✅ Анимация появления
- ✅ Адаптивный дизайн

#### Использование:

```tsx
import BulkActions from './components/BulkActions/BulkActions';

const actions = [
  { label: 'Активировать', action: 'activate', variant: 'primary', icon: '✓' },
  { label: 'Удалить', action: 'delete', variant: 'danger', icon: '🗑' }
];

<BulkActions
  actions={actions}
  selectedCount={5}
  totalCount={20}
  onAction={(action) => console.log('Массовое действие:', action)}
  onSelectAll={() => console.log('Выбрать все')}
  onClearSelection={() => console.log('Снять выделение')}
/>
```

## Применение в модулях

### Сотрудники (`/employees`)
- **Список**: DataTable с колонками (имя, должность, отдел, статус)
- **Детали**: DetailView с табами (общая информация, история, документы)
- **Форма**: FormBuilder для создания/редактирования

### Вакансии (`/recruiting/vacancies`)
- **Список**: DataTable с колонками (название, отдел, локация, статус)
- **Детали**: DetailView с табами (описание, кандидаты, этапы)
- **Форма**: FormBuilder для создания вакансии

### Кандидаты (`/recruiting/candidates`)
- **Список**: DataTable с массовыми операциями
- **Детали**: DetailView с резюме и историей
- **Форма**: FormBuilder для добавления кандидата

### Курсы (`/learning/courses`)
- **Список**: DataTable с фильтрацией по категориям
- **Детали**: DetailView с программой курса
- **Форма**: FormBuilder для создания курса

### Проекты (`/projects`)
- **Список**: DataTable с прогрессом и участниками
- **Детали**: DetailView с задачами и документами
- **Форма**: FormBuilder для создания проекта

## Преимущества переиспользования

1. **Единообразие UI/UX** - все модули используют одинаковые компоненты
2. **Быстрая разработка** - не нужно создавать таблицы и формы с нуля
3. **Легкое сопровождение** - изменения в одном месте применяются везде
4. **Консистентность** - одинаковое поведение во всех модулях
5. **Масштабируемость** - легко добавлять новые функции

## Технические детали

### TypeScript
Все компоненты написаны на TypeScript с полной типизацией.

### CSS
Используются CSS модули для изоляции стилей.

### Адаптивность
Все компоненты адаптированы для мобильных устройств.

### Производительность
Компоненты оптимизированы с использованием React.memo и useMemo где необходимо. 