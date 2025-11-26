import { useRef, useState } from 'react';
import './ExportImportPanel.css';

function ExportImportPanel({ technologies, onImport }) {
  const fileInputRef = useRef();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Экспорт
  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(technologies, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `technologies-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess('Экспорт выполнен успешно!');
      setError('');
    } catch (e) {
      setError('Ошибка экспорта: ' + e.message);
      setSuccess('');
    }
  };

  // Импорт
  const handleImport = (e) => {
    setError('');
    setSuccess('');
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Файл должен содержать массив технологий');
        // Проверка структуры
        const valid = imported.every(t => t.id && t.title);
        if (!valid) throw new Error('Некорректная структура данных');
        onImport(imported);
        setSuccess('Импорт выполнен успешно!');
      } catch (err) {
        setError('Ошибка импорта: ' + err.message);
      }
    };
    reader.onerror = () => {
      setError('Ошибка чтения файла');
    };
    reader.readAsText(file);
  };

  return (
    <div className="export-import-panel" aria-label="Экспорт и импорт данных">
      <h3>Экспорт / Импорт данных</h3>
      <div className="panel-actions">
        <button type="button" className="btn btn-secondary" onClick={handleExport} aria-label="Экспортировать данные">
          📤 Экспорт
        </button>
        <label className="import-label" htmlFor="import-file">
          📥 Импорт
          <input
            id="import-file"
            type="file"
            accept="application/json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImport}
            aria-label="Импортировать данные из файла"
          />
        </label>
      </div>
      {error && <div className="error-message" role="alert">{error}</div>}
      {success && <div className="success-message" role="status">{success}</div>}
    </div>
  );
}

export default ExportImportPanel;
