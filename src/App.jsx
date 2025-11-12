import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import WindowSizeTracker from './components/WindowSizeTracker';
import UserProfile from './components/UserProfile';
import ContactForm from './components/ContactForm';
import { useTechnologies } from './hooks/useTechnologies';

function App() {
  // 🔥 Используем кастомный хук для управления технологиями
  const {
    technologies,
    updateTechnologyStatus,
    updateTechnologyNotes,
    updateAllStatuses,
    exportData,
    resetToInitial
  } = useTechnologies();

  const [searchQuery, setSearchQuery] = useState('');

  // 🔥 Обработчик случайного выбора
  const handleRandomSelect = (id) => {
    updateTechnologyStatus(id, 'in-progress');
  };

  // 🔥 Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const completedCount = technologies.filter(tech => tech.status === 'completed').length;
  const withNotesCount = technologies.filter(tech => tech.notes && tech.notes.length > 0).length;
  const completionPercentage = technologies.length > 0 ? Math.round((completedCount / technologies.length) * 100) : 0;

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении React с автосохранением</p>
      </header>
      
      {/* 🔍 Поле поиска */}
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Поиск технологий по названию, описанию или заметкам..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <span className="search-results">
          Найдено: {filteredTechnologies.length} из {technologies.length}
        </span>
      </div>

      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        technologies={technologies}
        onUpdateAllStatuses={updateAllStatuses}
        onRandomSelect={handleRandomSelect}
        onExport={exportData}
        onReset={resetToInitial}
      />

      {/* 📱 Компоненты из практики 21 */}
      <div className="demo-components">
        <WindowSizeTracker />
        <UserProfile />
        <ContactForm />
      </div>
      
      <div className="technologies-list">
        <h2>📚 Дорожная карта изучения</h2>
        
        {/* 🔥 ИНФОРМАЦИЯ О СОХРАНЕНИИ */}
        <div className="storage-info">
          <p>
            💾 <strong>Автосохранение включено</strong> - данные сохраняются автоматически
          </p>
          <div className="storage-stats">
            <span>Технологий: {technologies.length}</span>
            <span>Заметок: {withNotesCount}</span>
            <span>Прогресс: {completionPercentage}%</span>
          </div>
        </div>

        {filteredTechnologies.length === 0 ? (
          <div className="no-results">
            <p>😔 Технологии по запросу "{searchQuery}" не найдены</p>
            <button onClick={() => setSearchQuery('')}>
              Показать все технологии
            </button>
          </div>
        ) : (
          filteredTechnologies.map(tech => (
            <TechnologyCard
              key={tech.id}
              id={tech.id}
              title={tech.title}
              description={tech.description}
              status={tech.status}
              notes={tech.notes}
              onStatusChange={updateTechnologyStatus}
              onNotesChange={updateTechnologyNotes}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;