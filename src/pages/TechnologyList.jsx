import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTechnologies } from '../hooks/useTechnologies.jsx';
import RoadmapImporter from '../components/RoadmapImporter.jsx';
import TechnologySearch from '../components/TechnologySearch.jsx';
import BulkStatusEditor from '../components/BulkStatusEditor.jsx';
import ExportImportPanel from '../components/ExportImportPanel.jsx';
import './TechnologyList.css';

function TechnologyList() {
  const { technologies, setTechnologies } = useTechnologies();
  const [apiUrl, setApiUrl] = useState('https://dummyjson.com/products?limit=12&select=id,title,description,category,rating,thumbnail,images,brand');
  const [dataPath, setDataPath] = useState('products');

  const handleLocalImport = async (technology) => {
    setTechnologies(prev => {
      const exists = prev.some(item => String(item.id) === String(technology.id));
      // Если у технологии нет id или такой id уже существует — создаём уникальный целочисленный id
      const generatedId = (!technology.id || exists)
        ? Date.now() + Math.floor(Math.random() * 1000)
        : technology.id;
      const normalizedTech = {
        ...technology,
        id: generatedId,
        status: technology.status || 'not-started',
        notes: technology.notes || ''
      };
      return [...prev, normalizedTech];
    });
  };

  const handleApiUrlChange = (e) => {
    setApiUrl(e.target.value);
  };

  // 🔥 Статусы на русском
  const getStatusText = (status) => {
    const statusMap = {
      'not-started': '⏳ Не начато',
      'in-progress': '🔄 В процессе',
      'completed': '✅ Завершено'
    };
    return statusMap[status] || status;
  };

  // 🔥 Цвета для статусов
  const getStatusClass = (status) => {
    const statusClassMap = {
      'not-started': 'status-not-started',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed'
    };
    return statusClassMap[status] || '';
  };

  // Массовое обновление статусов
  const handleBulkUpdate = (ids, status) => {
    setTechnologies(prev =>
      prev.map(tech =>
        ids.includes(tech.id) ? { ...tech, status } : tech
      )
    );
  };

  // Импорт из файла
  const handleImportFromFile = (imported) => {
    // Слияние: не добавлять дубликаты по id
    setTechnologies(prev => {
      const existingIds = new Set(prev.map(t => String(t.id)));
      const filtered = imported.filter(t => !existingIds.has(String(t.id)));
      // Нормализуем импорт — если у импортируемого элемента нет id, сгенерируем
      const normalized = filtered.map(t => ({
        ...t,
        id: t.id ? t.id : Date.now() + Math.floor(Math.random() * 1000),
        status: t.status || 'not-started',
        notes: t.notes || ''
      }));
      return [...prev, ...normalized];
    });
  };

  return (
    <div className="page technology-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1>📚 Все технологии</h1>
          <p>Управляйте вашим прогрессом изучения технологий</p>
        </div>
        <Link to="/add-technology" className="btn btn-primary">
          ➕ Добавить технологию
        </Link>
      </div>

      {/* 🔥 Поле для URL API */}
      <div className="api-url-section">
        <h3>🌐 Источник данных</h3>
        <div className="url-inputs">
          <div className="input-group">
            <label>URL для загрузки технологий:</label>
            <input
              type="text"
              value={apiUrl}
              onChange={handleApiUrlChange}
              placeholder="https://dummyjson.com/products?limit=12"
              className="api-url-input"
            />
          </div>
        </div>
      </div>

      {/* 🔥 Импорт и поиск */}
      <div className="api-actions">
        {/* 🔥 Импорт всех технологий */}
        <div className="roadmap-import-section">
          <RoadmapImporter 
            apiUrl={apiUrl}
            dataPath={dataPath}
            onAddTechnology={handleLocalImport}
            buttonLabel="📥 Загрузить технологии"
          />
        </div>

        {/* 🔎 Поиск технологий */}
        <div className="technology-search-section">
          <TechnologySearch 
            onAdd={handleLocalImport}
            searchUrl={apiUrl}
            dataPath={dataPath}
            existingTechnologies={technologies}
          />
        </div>
      </div>


      {/* 🔥 Экспорт / Импорт данных */}
      <ExportImportPanel
        technologies={technologies}
        onImport={handleImportFromFile}
      />

      {/* 🔥 Массовое редактирование статусов */}
      <BulkStatusEditor
        technologies={technologies}
        onBulkUpdate={handleBulkUpdate}
      />

      {/* 🔥 Статистика */}
      <div className="stats-overview">
        <div className="stat-item">
          <span className="stat-number">{technologies.length}</span>
          <span className="stat-label">Всего технологий</span>
        </div>
        <div className="stat-item">
          <span className="stat-number completed">
            {technologies.filter(t => t.status === 'completed').length}
          </span>
          <span className="stat-label">Завершено</span>
        </div>
        <div className="stat-item">
          <span className="stat-number in-progress">
            {technologies.filter(t => t.status === 'in-progress').length}
          </span>
          <span className="stat-label">В процессе</span>
        </div>
        <div className="stat-item">
          <span className="stat-number not-started">
            {technologies.filter(t => t.status === 'not-started').length}
          </span>
          <span className="stat-label">Не начато</span>
        </div>
      </div>

      {/* 🔥 Сетка технологий */}
      <div className="technologies-grid">
        {technologies.map(tech => (
          <div key={tech.id} className="technology-card">
            <div className="card-header">
              <h3>{tech.title}</h3>
              <span className={`status ${getStatusClass(tech.status)}`}>
                {getStatusText(tech.status)}
              </span>
            </div>
            
            <p className="tech-description">{tech.description}</p>
            
            {tech.notes && (
              <div className="tech-notes-preview">
                <strong>📝 Заметки:</strong>
                <p>{tech.notes.length > 100 ? tech.notes.substring(0, 100) + '...' : tech.notes}</p>
              </div>
            )}

            <div className="card-footer">
              <Link to={`/technology/${tech.id}`} className="btn-link">
                🔍 Подробнее →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Состояние пустого списка */}
      {technologies.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>Технологий пока нет</h3>
          <p>Начните добавлять технологии для отслеживания вашего прогресса</p>
          <Link to="/add-technology" className="btn btn-primary">
            ➕ Добавить первую технологию
          </Link>
        </div>
      )}
    </div>
  );
}

export default TechnologyList;