import { useMemo, useState } from 'react';
import { mapProductToTechnology } from '../hooks/useTechnologiesApi';
import mockTechnologies from '../data/mockTechnologies';
import './RoadmapImporter.css';

function RoadmapImporter({
  apiUrl,
  dataPath = 'products',
  onAddTechnology,
  transformEntry = mapProductToTechnology,
  buttonLabel = 'Импорт из API'
}) {
  const [importing, setImporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleImportRoadmap = async (roadmapUrl) => {
    try {
      setImporting(true);
      setStatusMessage('');

      if (!onAddTechnology) {
        throw new Error('Не передан обработчик добавления технологий');
      }

      if (!roadmapUrl) {
        throw new Error('URL API не установлен');
      }

      const response = await fetch(roadmapUrl);
      if (!response.ok) throw new Error('Не удалось загрузить данные');

      const data = await response.json();
      const products = Array.isArray(data[dataPath]) ? data[dataPath] :
                      Array.isArray(data.products) ? data.products :
                      Array.isArray(data) ? data : [];

      if (!products.length) {
        throw new Error('API вернуло пустой список');
      }

      let added = 0;
      for (const product of products) {
        const technology = transformEntry(product);
        await onAddTechnology(technology);
        added += 1;
      }

      setStatusMessage(`✅ Импортировано ${added} технологий из API`);
    } catch (err) {
      if (err.name === 'AbortError') return;
      try {
        const fallbackCount = mockTechnologies.length;
        for (const tech of mockTechnologies) {
          await onAddTechnology({ ...tech, id: Date.now() + Math.random() });
        }
        setStatusMessage(`⚠️ API недоступно, импортировано ${fallbackCount} технологий из локального списка`);
      } catch (fallbackError) {
        setStatusMessage(`❌ Ошибка импорта: ${err.message}`);
      }
    } finally {
      setImporting(false);
    }
  };

  const handleExampleImport = () => {
    if (!apiUrl) {
      setStatusMessage('❌ API URL не установлен');
      return;
    }
    handleImportRoadmap(apiUrl);
  };

  return (
    <div className="roadmap-importer">
      <button
        onClick={handleExampleImport}
        disabled={importing || !apiUrl}
        className="import-button"
      >
        {importing ? '⏳ Импорт...' : '📥 ' + buttonLabel}
      </button>

      {statusMessage && (
        <div className={`import-message ${statusMessage.startsWith('❌') ? 'error' : 'success'}`}>
          {statusMessage}
        </div>
      )}
    </div>
  );
}

export default RoadmapImporter;

