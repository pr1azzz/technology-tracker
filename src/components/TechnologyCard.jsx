import { useState } from 'react';
import './TechnologyCard.css';

function TechnologyCard({ id, title, description, status, onStatusChange }) {
  const handleClick = () => {
    const statusOrder = ['not-started', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    const nextStatus = statusOrder[nextIndex];
    
    onStatusChange(id, nextStatus);
  };

  return (
    <div 
      id={`tech-${id}`}
      className={`technology-card status-${status}`}
      onClick={handleClick}
    >
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="status-indicator">
        Статус: <span className="status-text">{getStatusText(status)}</span>
        <span className="click-hint">(кликните для изменения)</span>
      </div>
    </div>
  );
}

function getStatusText(status) {
  const statusMap = {
    'not-started': 'Не начато',
    'in-progress': 'В процессе',
    'completed': 'Завершено'
  };
  return statusMap[status] || status;
}

export default TechnologyCard;