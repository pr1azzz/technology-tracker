import { useMemo, useState } from 'react';
import { DEFAULT_API_URL, mapProductToTechnology } from '../hooks/useTechnologiesApi';
import './RoadmapImporter.css';

function RoadmapImporter({
  defaultUrl = DEFAULT_API_URL,
  onAddTechnology,
  transformEntry = mapProductToTechnology,
  buttonLabel = 'Импорт из API'
}) {
  const [importing, setImporting] = useState(false);
  const [customUrl, setCustomUrl] = useState(defaultUrl);
  const [statusMessage, setStatusMessage] = useState('');

  const resolvedUrl = useMemo(() => customUrl?.trim() || defaultUrl, [customUrl, defaultUrl]);

  const handleImportRoadmap = async (roadmapUrl) => {
    try {
      setImporting(true);
      setStatusMessage('');

      if (!onAddTechnology) {
        throw new Error('Не передан обработчик добавления технологий');
      }

      const response = await fetch(roadmapUrl);
      if (!response.ok) throw new Error('Не удалось загрузить дорожную карту');

      const data = await response.json();
      const products = Array.isArray(data.products)
        ? data.products
        : Array.isArray(data.technologies)
          ? data.technologies
          : [];

      if (!products.length) {
        throw new Error('API вернуло пустой список технологий');
      }

      let added = 0;
      for (const product of products) {
        const technology = transformEntry(product);
        await onAddTechnology(technology);
        added += 1;
      }

      setStatusMessage(`Импортировано ${added} технологий из ${roadmapUrl}`);
    } catch (err) {
      setStatusMessage(`Ошибка импорта: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleExampleImport = () => {
    handleImportRoadmap(resolvedUrl);
  };

  return (
    <div className="roadmap-importer">
      <h3>Импорт дорожной карты</h3>

      <label className="import-input-wrapper">
        <span>API URL</span>
        <input
          type="text"
          value={customUrl}
          onChange={(e) => setCustomUrl(e.target.value)}
          placeholder="https://dummyjson.com/products?..."
          disabled={importing}
        />
      </label>

      <div className="import-actions">
        <button
          onClick={handleExampleImport}
          disabled={importing}
          className="import-button"
        >
          {importing ? 'Импорт...' : buttonLabel}
        </button>
      </div>

      {statusMessage && (
        <div className={`import-message ${statusMessage.startsWith('Ошибка') ? 'error' : 'success'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}

export default RoadmapImporter;

