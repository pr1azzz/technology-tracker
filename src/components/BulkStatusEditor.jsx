import { useState } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onBulkUpdate }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(technologies.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (selectedIds.length && onBulkUpdate) {
      onBulkUpdate(selectedIds, newStatus);
    }
  };

  return (
    <form className="bulk-status-form" onSubmit={handleApply} aria-labelledby="bulk-status-label">
      <div className="bulk-status-header">
        <span id="bulk-status-label" className="bulk-label">Массовое изменение статуса</span>
        <label>
          <input
            type="checkbox"
            checked={selectedIds.length === technologies.length && technologies.length > 0}
            onChange={handleSelectAll}
            aria-checked={selectedIds.length === technologies.length}
            aria-label="Выбрать все"
          />
          <span>Выбрать все</span>
        </label>
      </div>
      <ul className="bulk-list" role="listbox">
        {technologies.map(tech => (
          <li key={tech.id} role="option" aria-selected={selectedIds.includes(tech.id)}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(tech.id)}
                onChange={() => handleSelect(tech.id)}
                aria-checked={selectedIds.includes(tech.id)}
                aria-label={`Выбрать технологию ${tech.title}`}
              />
              <span>{tech.title}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="bulk-status-controls">
        <label htmlFor="bulk-status-select">Статус для выбранных:</label>
        <select
          id="bulk-status-select"
          value={newStatus}
          onChange={handleStatusChange}
          aria-label="Выбрать новый статус"
        >
          <option value="not-started">⏳ Не начато</option>
          <option value="in-progress">🔄 В процессе</option>
          <option value="completed">✅ Завершено</option>
        </select>
        <button type="submit" className="btn btn-primary" disabled={!selectedIds.length}>
          Применить
        </button>
      </div>
    </form>
  );
}

export default BulkStatusEditor;
