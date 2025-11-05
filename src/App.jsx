import { useState } from 'react';
import './App.css';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';

function App() {
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      title: 'React Components', 
      description: 'Изучение функциональных и классовых компонентов, их жизненного цикла', 
      status: 'completed' 
    },
    { 
      id: 2, 
      title: 'JSX Syntax', 
      description: 'Освоение синтаксиса JSX, работа с выражениями и атрибутами', 
      status: 'in-progress' 
    },
    { 
      id: 3, 
      title: 'State Management', 
      description: 'Работа с состоянием компонентов, использование хука useState', 
      status: 'not-started' 
    },
    { 
      id: 4, 
      title: 'Props and Data Flow', 
      description: 'Передача данных между компонентами через props', 
      status: 'not-started' 
    },
    { 
      id: 5, 
      title: 'Event Handling', 
      description: 'Обработка событий в React компонентах', 
      status: 'not-started' 
    },
    { 
      id: 6, 
      title: 'Lists and Keys', 
      description: 'Работа со списками и использование ключей для оптимизации', 
      status: 'not-started' 
    }
  ]);

  const handleStatusChange = (id, newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const handleUpdateAllStatuses = (newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  const handleRandomSelect = (id) => {
    handleStatusChange(id, 'in-progress');
    // Прокрутка к выбранному элементу
    setTimeout(() => {
      const element = document.getElementById(`tech-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.backgroundColor = '#fff3cd';
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 2000);
      }
    }, 100);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Трекер изучения технологий</h1>
        <p>Отслеживайте ваш прогресс в изучении React</p>
      </header>
      
      <ProgressHeader technologies={technologies} />
      
      <QuickActions 
        technologies={technologies}
        onUpdateAllStatuses={handleUpdateAllStatuses}
        onRandomSelect={handleRandomSelect}
      />
      
      <div className="technologies-list">
        <h2>📚 Дорожная карта изучения</h2>
        {technologies.map(tech => (
          <TechnologyCard
            key={tech.id}
            id={tech.id}
            title={tech.title}
            description={tech.description}
            status={tech.status}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}

export default App;