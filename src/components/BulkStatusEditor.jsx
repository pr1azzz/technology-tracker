import { useState, useRef, useEffect } from 'react';
import './BulkStatusEditor.css';

function BulkStatusEditor({ technologies, onBulkUpdate }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [newStatus, setNewStatus] = useState('not-started');
  const [confirming, setConfirming] = useState(false);
  const confirmBtnRef = useRef(null);

  const StatusIcon = ({ status, size = 16 }) => {
    const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' };
    if (status === 'completed') {
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#388e3c" />
          <path d="M7 12.5l2.5 2.5L17 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (status === 'in-progress') {
      return (
        <svg {...common} aria-hidden="true">
          <circle cx="12" cy="12" r="10" fill="#1976d2" />
          <path d="M12 6v6l4 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    // not-started
    return (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="#757575" />
        <path d="M8 8h8v8H8z" fill="#fff" opacity="0.06" />
        <path d="M9 9h6v6H9z" stroke="#fff" strokeWidth="0.8" opacity="0.2" />
      </svg>
    );
  };

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

  const startConfirm = (e) => {
    e.preventDefault();
    if (!selectedIds.length) return;
    setConfirming(true);
  };

  const cancelConfirm = () => setConfirming(false);

  const doApply = () => {
    if (selectedIds.length && onBulkUpdate) {
      onBulkUpdate(selectedIds, newStatus);
    }
    setConfirming(false);
    setSelectedIds([]);
  };

  useEffect(() => {
    if (confirming && confirmBtnRef.current) confirmBtnRef.current.focus();
  }, [confirming]);

  return (
    <form className="bulk-status-form" onSubmit={startConfirm} aria-labelledby="bulk-status-label">
      <div className="bulk-status-header">
        <span id="bulk-status-label" className="bulk-label">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden style={{marginRight:8}}>
            <rect x="3" y="3" width="18" height="18" rx="4" fill="#1976d2" />
            <path d="M8 12h8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 8v8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Массовое изменение статуса
        </span>
        <label className="select-all">
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
      <div className="bulk-summary">Выбрано: <strong>{selectedIds.length}</strong></div>
      <ul className="bulk-list" role="listbox" aria-label="Список технологий для массового редактирования">
        {technologies.map(tech => (
          <li key={tech.id} role="option" aria-selected={selectedIds.includes(tech.id)} className="bulk-item">
            <label className="bulk-item-label">
              <input
                type="checkbox"
                checked={selectedIds.includes(tech.id)}
                onChange={() => handleSelect(tech.id)}
                aria-checked={selectedIds.includes(tech.id)}
                aria-label={`Выбрать технологию ${tech.title}`}
              />
              <div className="item-main">
                <div className="item-title">{tech.title}</div>
                <div className="item-meta">{tech.description ? tech.description.substring(0, 80) : ''}</div>
              </div>
              <div className="item-status">
                <span className={`chip ${tech.status}`} aria-hidden>
                  <StatusIcon status={tech.status} size={14} />
                  <span className="chip-text">{tech.status === 'not-started' ? 'Не начато' : tech.status === 'in-progress' ? 'В процессе' : 'Завершено'}</span>
                </span>
              </div>
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
        <button type="submit" className="btn btn-primary" disabled={!selectedIds.length} aria-disabled={!selectedIds.length}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{marginRight:8}}>
            <path d="M5 12h14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M12 5v14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Применить
        </button>
      </div>

      {confirming && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Подтвердите массовое изменение статуса">
          <div className="confirm-box">
            <p>Вы собираетесь применить статус <strong>{newStatus}</strong> к <strong>{selectedIds.length}</strong> технологиям.</p>
            <div className="confirm-actions">
              <button ref={confirmBtnRef} className="btn btn-primary" onClick={doApply}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{marginRight:8}}>
                  <path d="M7 12.5l2.5 2.5L17 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Подтвердить
              </button>
              <button className="btn btn-secondary" onClick={cancelConfirm}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden style={{marginRight:8}}>
                  <path d="M6 6l12 12M18 6L6 18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

export default BulkStatusEditor;
