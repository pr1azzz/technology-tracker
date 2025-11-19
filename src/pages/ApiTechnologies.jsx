import useTechnologiesApi, { DEFAULT_API_URL } from '../hooks/useTechnologiesApi';
import RoadmapImporter from '../components/RoadmapImporter.jsx';
import ApiTechnologyList from '../components/ApiTechnologyList.jsx';
import './ApiTechnologies.css';

function ApiTechnologies() {
  const { technologies, loading, error, refetch, addTechnology, defaultApiUrl = DEFAULT_API_URL } = useTechnologiesApi();

  const handleApiImport = async (technology) => {
    await addTechnology(technology);
  };

  return (
    <div className="page api-technologies-page">
      <header className="api-header">
        <div>
          <h1>🌐 Технологии из API</h1>
          <p>Загружайте и просматривайте технологии с внешних источников</p>
        </div>
        <button onClick={refetch} className="btn btn-secondary">
          ↻ Обновить данные
        </button>
      </header>

      {loading && (
        <div className="api-loader">
          <div className="spinner" />
          <p>Загрузка технологий...</p>
        </div>
      )}

      {error && (
        <div className="api-error">
          <p>{error}</p>
          <button onClick={refetch}>Попробовать снова</button>
        </div>
      )}

      {!loading && (
        <>
          <RoadmapImporter
            defaultUrl={defaultApiUrl}
            onAddTechnology={handleApiImport}
            buttonLabel="Импорт из внешнего API"
          />

          <ApiTechnologyList technologies={technologies} />
        </>
      )}
    </div>
  );
}

export default ApiTechnologies;

