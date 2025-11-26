import { useState } from 'react';
import './StudyDeadlineForm.css';

function StudyDeadlineForm({ onSave }) {
  const [date, setDate] = useState('');
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
