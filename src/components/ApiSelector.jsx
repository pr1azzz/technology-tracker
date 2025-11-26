import { useState } from 'react';
import './ApiSelector.css';

const PRESET_APIS = [
  {
    name: '🛒 DummyJSON (Товары)',
    url: 'https://dummyjson.com/products?limit=12&select=id,title,description,category,rating,thumbnail,images,brand',
    searchUrl: 'https://dummyjson.com/products/search?limit=8&select=id,title,description,category,rating,thumbnail,images,brand&q=',
    dataPath: 'products'
  },
  {
    name: '📚 JSONPlaceholder (Посты)',
    url: 'https://jsonplaceholder.typicode.com/posts?_limit=12',
    searchUrl: 'https://jsonplaceholder.typicode.com/posts?_limit=8&title_like=',
    dataPath: 'posts'
  },
  {
    name: '👤 JSONPlaceholder (Пользователи)',
    url: 'https://jsonplaceholder.typicode.com/users?_limit=12',
    searchUrl: 'https://jsonplaceholder.typicode.com/users?_limit=8',
    dataPath: 'users'
  },
  {
    name: '⭐ Random User (Люди)',
    url: 'https://randomuser.me/api/?results=12',
    searchUrl: 'https://randomuser.me/api/?results=8',
    dataPath: 'results'
  },
  {
    name: '🍽️ TheMealDB (Блюда)',
    url: 'https://www.themealdb.com/api/json/v1/1/search.php?s=',
    searchUrl: 'https://www.themealdb.com/api/json/v1/1/search.php?s=',
    dataPath: 'meals'
  },
  {
    name: '🎬 OMDb (Фильмы) - требует API KEY',
    url: 'https://www.omdbapi.com/?apikey=YOUR_KEY&s=movie&type=movie&page=1',
    searchUrl: 'https://www.omdbapi.com/?apikey=YOUR_KEY&s=',
    dataPath: 'Search'
  }
];

function ApiSelector({ onApiSelect, onSearchUrlSelect }) {
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [customSearchUrl, setCustomSearchUrl] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const handlePresetSelect = (index) => {
    setSelectedPreset(index);
    setUseCustom(false);
    const api = PRESET_APIS[index];
    onApiSelect(api.url, api.dataPath);
    onSearchUrlSelect(api.searchUrl, api.dataPath);
  };

  const handleCustomUrlSubmit = () => {
    if (!customUrl.trim()) {
      alert('Пожалуйста, введите URL API');
      return;
    }
    onApiSelect(customUrl, 'products');
    if (customSearchUrl.trim()) {
      onSearchUrlSelect(customSearchUrl, 'products');
    } else {
      onSearchUrlSelect(customUrl, 'products');
    }
  };

  return (
    <div className="api-selector">
      <h3>🌐 Выбор источника данных</h3>

      {/* Готовые пресеты */}
      <div className="api-presets">
        <p className="preset-label">📋 Готовые API (один клик):</p>
        <div className="preset-buttons">
          {PRESET_APIS.map((api, idx) => (
            <button
              key={idx}
              onClick={() => handlePresetSelect(idx)}
              className={`preset-btn ${!useCustom && selectedPreset === idx ? 'active' : ''}`}
            >
              {api.name}
            </button>
          ))}
        </div>
      </div>

      <hr className="selector-divider" />

      {/* Пользовательский API */}
      <div className="custom-api">
        <p className="custom-label">🔧 Или используй свой API:</p>
        
        <div className="input-group">
          <label>URL для загрузки технологий:</label>
          <input
            type="text"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/api/technologies"
            className="api-input"
          />
          <small>
            ℹ️ API должен возвращать JSON с массивом объектов (название поля: products, items, data и т.д.)
          </small>
        </div>

        <div className="input-group">
          <label>URL для поиска (опционально):</label>
          <input
            type="text"
            value={customSearchUrl}
            onChange={(e) => setCustomSearchUrl(e.target.value)}
            placeholder="https://example.com/api/technologies/search?q="
            className="api-input"
          />
          <small>
            💡 Если не указать - будет использован основной URL для всех запросов
          </small>
        </div>

        <button
          onClick={handleCustomUrlSubmit}
          className="btn btn-primary"
        >
          ✅ Использовать этот API
        </button>
      </div>

      <div className="api-info">
        <h4>ℹ️ Как работает:</h4>
        <ul>
          <li>1️⃣ Выбери готовый API или введи свой</li>
          <li>2️⃣ API должен возвращать JSON с объектами (title, description и т.д.)</li>
          <li>3️⃣ Используй поиск для фильтрации технологий</li>
          <li>4️⃣ Импортируй выбранные технологии в свой список</li>
        </ul>
      </div>
    </div>
  );
}

export default ApiSelector;
