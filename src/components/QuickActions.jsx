import './QuickActions.css';

function QuickActions({ technologies, onUpdateAllStatuses, onRandomSelect }) {
  const markAllCompleted = () => {
    onUpdateAllStatuses('completed');
  };

  const resetAll = () => {
    onUpdateAllStatuses('not-started');
  };

  const getRandomInProgress = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      onRandomSelect(randomTech.id);
    } else {
      alert('Все технологии уже начаты или завершены! 🎉');
    }
  };

  return (
    <div className="quick-actions">
      <h3>⚡ Быстрые действия</h3>
      <div className="action-buttons">
        <button onClick={markAllCompleted} className="action-btn completed">
          ✅ Отметить все как выполненные
        </button>
        <button onClick={resetAll} className="action-btn reset">
          🔄 Сбросить все статусы
        </button>
        <button onClick={getRandomInProgress} className="action-btn random">
          🎲 Случайный выбор технологии
        </button>
      </div>
    </div>
  );
}

export default QuickActions;