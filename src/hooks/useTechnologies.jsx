import { createContext, useContext } from 'react';
import { useLocalStorage } from './useLocalStorage';

// 🔥 Начальные данные технологий
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

const TechnologiesContext = createContext(null);

function useProvideTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('techTrackerData', initialTechnologies);

  // 🔥 Изменение статуса технологии
  const updateTechnologyStatus = (id, newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => 
        tech.id === id ? { ...tech, status: newStatus } : tech
      )
    );
  };

  // 🔥 Изменение заметок технологии
  const updateTechnologyNotes = (id, newNotes) => {
    setTechnologies(prevTech =>
      prevTech.map(tech =>
        tech.id === id ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  // 🔥 Массовое обновление статусов
  const updateAllStatuses = (newStatus) => {
    setTechnologies(prevTech => 
      prevTech.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  // 🔥 Получить статистику
  const getStatistics = () => {
    const total = technologies.length;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    const inProgress = technologies.filter(tech => tech.status === 'in-progress').length;
    const notStarted = technologies.filter(tech => tech.status === 'not-started').length;
    const withNotes = technologies.filter(tech => tech.notes && tech.notes.length > 0).length;
    
    return {
      total,
      completed,
      inProgress,
      notStarted,
      withNotes,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  // 🔥 Экспорт данных
  const exportData = () => {
    const data = {
      technologies,
      statistics: getStatistics(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `technology-tracker-export-${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return data;
  };

  // 🔥 Сброс к начальным данным
  const resetToInitial = () => {
    setTechnologies(initialTechnologies);
  };

  return {
    technologies,
    setTechnologies,
    updateTechnologyStatus,
    updateTechnologyNotes,
    updateAllStatuses,
    getStatistics,
    exportData,
    resetToInitial
  };
}

export function TechnologiesProvider({ children }) {
  const value = useProvideTechnologies();
  return (
    <TechnologiesContext.Provider value={value}>
      {children}
    </TechnologiesContext.Provider>
  );
}

export function useTechnologies() {
  const context = useContext(TechnologiesContext);
  if (!context) {
    throw new Error('useTechnologies должен использоваться внутри TechnologiesProvider');
  }
  return context;
}