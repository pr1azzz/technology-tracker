import { useState } from 'react';
import './StudyDeadlineForm.css';

function StudyDeadlineForm({ onSave, initialDate }) {
  // initialDate is expected as ISO string (e.g. 2025-11-26T00:00:00.000Z) or date-like
  const toInputDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [date, setDate] = useState(toInputDate(initialDate || ''));
  const [error, setError] = useState('');

  // Валидация в реальном времени
  const validate = (value) => {
    if (!value) return 'Дата обязательна';
    const selected = new Date(value);
    const now = new Date();
    if (selected < now) return 'Дата должна быть в будущем';
    return '';
  };

  const handleChange = (e) => {
    setDate(e.target.value);
    setError(validate(e.target.value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate(date);
    setError(err);
    if (!err && onSave) {
      onSave(date);
    }
  };

  return (
    <form className="deadline-form" onSubmit={handleSubmit} aria-labelledby="deadline-label">
      <label id="deadline-label" htmlFor="deadline-date" className="form-label">
        📅 Срок изучения
      </label>
      <input
        id="deadline-date"
        name="deadline-date"
        type="date"
        value={date}
        onChange={handleChange}
        aria-invalid={!!error}
        aria-describedby="deadline-error"
        className={`form-input ${error ? 'error' : ''}`}
      />
      {error && (
        <span id="deadline-error" className="error-message" role="alert">
          {error}
        </span>
      )}
      <button type="submit" className="btn btn-primary" disabled={!!error || !date}>
        Сохранить срок
      </button>
    </form>
  );
}

export default StudyDeadlineForm;
