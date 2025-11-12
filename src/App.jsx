import { useState, useEffect } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import WindowSizeTracker from './components/WindowSizeTracker';
import UserProfile from './components/UserProfile';
import ContactForm from './components/ContactForm';

function App() {
  // 🔥 НАЧАЛЬНЫЕ ДАННЫЕ
  const initialTechnologies = [
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение функциональных и классовых компонентов, их жизненного цикла', 
      status: 'not-started',
      notes: ''
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX, работа с выражениями и атрибутами', 
      status: 'not-started',
      notes: ''
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов, использование хука useState', 
      status: 'not-started',
      notes: ''
    },
    { 
      id: 4, 
      title: 'Props and Data Flow', 
      description: 'Передача данных между компонентами через props', 
      status: 'not-started',
      notes: ''
    },
    { 
      id: 5, 
      title: 'Event Handling', 
      description: 'Обработка событий в React компонентах', 
      status: 'not-started',
      notes: ''
    },
    { 
      id: 6, 
      title: 'Lists and Keys', 
      description: 'Работа со списками и использование ключей для оптимизации', 
      status: 'not-started',
      notes: ''
    }
  ];

  const [technologies, setTechnologies] = useState([]); // 🔥 Начинаем с пустого массива
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false); // 🔥 Флаг загрузки

  // 🔥 ПЕРВЫЙ Эффект - ТОЛЬКО загрузка из localStorage
  useEffect(() => {
    console.log('🚀 Компонент монтируется...');
    
    const savedData = localStorage.getItem('techTrackerData');
    console.log('📂 Данные из localStorage:', savedData);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('✅ УСПЕШНО загружено из localStorage:', parsedData);
        setTechnologies(parsedData);
      } catch (error) {
        console.error('❌ Ошибка парсинга localStorage:', error);
        console.log('🔄 Используем начальные данные');
        setTechnologies(initialTechnologies);
      }
    } else {
      console.log('📝 localStorage пуст, устанавливаем начальные данные');
      setTechnologies(initialTechnologies);
    }
    
    setIsLoaded(true);
  }, []); // 🔥 Пустой массив - ТОЛЬКО при монтировании

  // 🔥 ВТОРОЙ Эффект - ТОЛЬКО сохранение в localStorage
  useEffect(() => {
    if (!isLoaded) {
      console.log('⏳ Пропускаем сохранение - данные еще не загружены');
      return;
    }
    
    if (technologies.length === 0) {
      console.log('⏳ Пропускаем сохранение - массив технологий пуст');
      return;
    }

    console.log('💾 СОХРАНЯЕМ в localStorage:', technologies.length, 'технологий');
    
    // 🔥 ДЕТАЛЬНАЯ ОТЛАДКА
    const technologiesWithNotes = technologies.filter(tech => tech.notes && tech.notes.length > 0);
    console.log('📝 Технологии с заметками:', technologiesWithNotes.length);
    
    technologiesWithNotes.forEach(tech => {
      console.log(`   - ${tech.title}: "${tech.notes.substring(0, 20)}..."`);
    });

    try {
      localStorage.setItem('techTrackerData', JSON.stringify(technologies));
      console.log('✅ УСПЕШНО сохранено в localStorage!');
      
      // 🔥 ПРОВЕРКА
      const checkData = localStorage.getItem('techTrackerData');
      console.log('🔍 Проверка после сохранения:', checkData ? 'ДАННЫЕ ЕСТЬ' : 'ДАННЫХ НЕТ');
    } catch (error) {
      console.error('❌ ОШИБКА сохранения:', error);
    }
  }, [technologies, isLoaded]); // 🔥 Зависимость от technologies и isLoaded

  const handleStatusChange = (id, newStatus) => {
    console.log('🔄 Изменяем статус технологии', id, 'на', newStatus);
    
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const handleNotesChange = (techId, newNotes) => {
    console.log('📝 Изменяем заметки технологии', techId, 'длина:', newNotes.length);
    
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const handleUpdateAllStatuses = (newStatus) => {
    console.log('⚡ Изменяем все статусы на:', newStatus);
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  const handleRandomSelect = (id) => {
    console.log('🎲 Случайный выбор технологии:', id);
    handleStatusChange(id, 'in-progress');
  };

  // 🔥 Функции для отладки
  const checkLocalStorage = () => {
    const saved = localStorage.getItem('techTrackerData');
    
    if (saved) {
      const data = JSON.parse(saved);
      const completed = data.filter(tech => tech.status === 'completed').length;
      const inProgress = data.filter(tech => tech.status === 'in-progress').length;
      const notStarted = data.filter(tech => tech.status === 'not-started').length;
      const withNotes = data.filter(tech => tech.notes && tech.notes.length > 0).length;
      
      alert(`📊 localStorage СОДЕРЖИМОЕ:\n\nВсего технологий: ${data.length}\n✅ Завершено: ${completed}\n🔄 В процессе: ${inProgress}\n⏳ Не начато: ${notStarted}\n📝 С заметками: ${withNotes}\n\n💾 Размер данных: ${saved.length} символов`);
    } else {
      alert('❌ localStorage ПУСТ!\n\nПопробуйте изменить статус или добавить заметку.');
    }
  };

  const debugNotes = () => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      const data = JSON.parse(saved);
      const technologiesWithNotes = data.filter(tech => tech.notes && tech.notes.length > 0);
      
      if (technologiesWithNotes.length > 0) {
        let message = `📝 ЗАМЕТКИ В localStorage:\n\n`;
        technologiesWithNotes.forEach(tech => {
          message += `🔸 ${tech.title} (${tech.status})\n`;
          message += `   ${tech.notes.length} символов: "${tech.notes}"\n\n`;
        });
        alert(message);
      } else {
        alert('📝 В localStorage НЕТ ЗАМЕТОК\n\nДобавьте заметки в технологии и проверьте снова.');
      }
    } else {
      alert('❌ localStorage ПУСТ!');
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('techTrackerData');
    console.log('🗑️ localStorage очищен');
    setTechnologies(initialTechnologies);
    alert('🗑️ localStorage очищен! Данные сброшены к начальным.');
  };

  const forceSave = () => {
    console.log('💪 ПРИНУДИТЕЛЬНОЕ СОХРАНЕНИЕ');
    localStorage.setItem('techTrackerData', JSON.stringify(technologies));
    alert('💪 Данные принудительно сохранены в localStorage!');
  };

  const viewRawLocalStorage = () => {
    const saved = localStorage.getItem('techTrackerData');
    if (saved) {
      console.log('📄 СЫРЫЕ ДАННЫЕ localStorage:', saved);
      alert(`📄 СЫРЫЕ ДАННЫЕ localStorage:\n\n${saved.substring(0, 500)}...\n\nПолные данные в консоли.`);
    } else {
      alert('❌ localStorage пуст!');
    }
  };

  // Фильтрация технологий
  const filteredTechnologies = technologies.filter(tech =>
    tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tech.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tech.notes && tech.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении React с сохранением в браузере</p>
        
        {/* 🔧 Кнопки для отладки */}
        <div className="debug-buttons">
          <button onClick={checkLocalStorage}>
            🔍 Проверить данные
          </button>
          <button onClick={debugNotes}>
            📝 Заметки
          </button>
          <button onClick={forceSave}>
            💪 Принудительно сохранить
          </button>
          <button onClick={viewRawLocalStorage}>
            📄 Сырые данные
          </button>
          <button onClick={clearLocalStorage} className="clear-btn">
            🗑️ Очистить
          </button>
        </div>

        {/* 🔥 СТАТУС ЗАГРУЗКИ */}
        <div style={{ 
          marginTop: '15px', 
          padding: '10px', 
          background: isLoaded ? '#4caf50' : '#ff9800',
          borderRadius: '5px',
          color: 'white',
          fontSize: '14px'
        }}>
          {isLoaded ? '✅ Данные загружены' : '⏳ Загрузка данных...'}
        </div>
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

      {technologies.length > 0 && (
        <>
          <ProgressHeader technologies={technologies} />
          
          <QuickActions 
            technologies={technologies}
            onUpdateAllStatuses={handleUpdateAllStatuses}
            onRandomSelect={handleRandomSelect}
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
                💾 <strong>Автосохранение {isLoaded ? 'ВКЛЮЧЕНО' : 'ЗАГРУЗКА...'}</strong>
              </p>
              <div className="storage-stats">
                <span>Технологий: {technologies.length}</span>
                <span>Заметок: {technologies.filter(tech => tech.notes && tech.notes.length > 0).length}</span>
                <span>Сохранено: {isLoaded ? 'Да' : 'Нет'}</span>
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
                  onStatusChange={handleStatusChange}
                  onNotesChange={handleNotesChange}
                />
              ))
            )}
          </div>
        </>
      )}

      {technologies.length === 0 && isLoaded && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <p>⏳ Загрузка данных...</p>
          <button onClick={() => setTechnologies(initialTechnologies)}>
            📥 Загрузить начальные данные
          </button>
        </div>
      )}
    </div>
  );
}

export default App;