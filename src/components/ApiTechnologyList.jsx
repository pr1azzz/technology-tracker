import './ApiTechnologyList.css';

function ApiTechnologyList({ technologies }) {
  if (!technologies || technologies.length === 0) {
    return (
      <div className="api-tech-empty">
        <p>Список технологий пуст. Импортируйте данные из API.</p>
      </div>
    );
  }

  return (
    <div className="api-tech-grid">
      {technologies.map(tech => (
        <div key={tech.id} className="api-tech-card">
          <div className="api-tech-header">
            <h3>{tech.title}</h3>
            <span className="api-tech-pill">{tech.category}</span>
          </div>
          <p className="api-tech-description">{tech.description}</p>
          <div className="api-tech-meta">
            <span>Сложность: {tech.difficulty}</span>
            <span>Статус: {tech.status || 'not-started'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ApiTechnologyList;

