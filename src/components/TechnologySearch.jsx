import { useEffect, useMemo, useRef, useState } from 'react';
import { mapProductToTechnology } from '../hooks/useTechnologiesApi';
import mockTechnologies from '../data/mockTechnologies';
import './TechnologySearch.css';

const SEARCH_URL = 'https://dummyjson.com/products/search?limit=8&select=id,title,description,category,rating,thumbnail,images,brand';

function TechnologySearch({ onAdd }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const trimmedQuery = useMemo(() => query.trim(), [query]);

  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!trimmedQuery || trimmedQuery.length < 2) {
      setResults([]);
      setLoading(false);
      setError('');
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) {
        abortRef.current.abort();
      }

      abortRef.current = new AbortController();
      setLoading(true);
      setError('');

      fetch(`${SEARCH_URL}&q=${encodeURIComponent(trimmedQuery)}`, {
        signal: abortRef.current.signal
      })
        .then(response => {
          if (!response.ok) throw new Error('Не удалось выполнить поиск');
          return response.json();
        })
        .then(data => {
          const products = Array.isArray(data.products) ? data.products : [];
          setResults(products.map(mapProductToTechnology));
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            setError('API недоступно, показаны результаты из локального списка');
            const fallback = mockTechnologies.filter(item =>
              item.title.toLowerCase().includes(trimmedQuery.toLowerCase())
            );
            setResults(fallback);
          }
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [trimmedQuery]);

  const handleAdd = async (tech) => {
    if (!onAdd) return;
    await onAdd(tech);
  };

  return (
    <div className="tech-search">
      <label>
        <span>Поиск технологий по API</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите минимум 2 символа..."
        />
      </label>

      {loading && <div className="tech-search-status">Поиск...</div>}
      {error && <div className="tech-search-status error">{error}</div>}

      {!loading && !error && results.length > 0 && (
        <ul className="tech-search-results">
          {results.map(result => (
            <li key={`${result.externalSource}-${result.externalId}`}>
              <div>
                <strong>{result.title}</strong>
                <p>{result.description}</p>
              </div>
              <button onClick={() => handleAdd(result)}>
                Добавить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TechnologySearch;

