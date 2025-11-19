import { useState, useEffect } from 'react';
import mockTechnologies from '../data/mockTechnologies';

export const DEFAULT_API_URL =
  'https://dummyjson.com/products?limit=12&select=id,title,description,category,rating,thumbnail,images,brand';

export const mapProductToTechnology = (product) => ({
  id: product.id,
  title: product.title,
  description: product.description,
  category: product.category,
  difficulty: product.rating >= 4 ? 'advanced' : product.rating >= 3 ? 'intermediate' : 'beginner',
  status: 'not-started',
  externalId: product.id,
  externalSource: 'dummyjson',
  sourceUrl: `https://dummyjson.com/products/${product.id}`,
  resources: [
    ...(product.thumbnail ? [product.thumbnail] : []),
    ...(Array.isArray(product.images) ? product.images : [])
  ],
  notes: product.brand ? `Бренд: ${product.brand}` : ''
});

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSource, setLastSource] = useState(DEFAULT_API_URL);

  const fetchTechnologies = async (apiUrl = DEFAULT_API_URL) => {
    try {
      setLoading(true);
      setError(null);
      setLastSource(apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Не удалось загрузить данные');

      const data = await response.json();
      const products = Array.isArray(data.products) ? data.products : [];
      const mapped = products.map(mapProductToTechnology);

      setTechnologies(mapped.length ? mapped : mockTechnologies);
    } catch (err) {
      console.error('Ошибка загрузки:', err);
      setError(err.message || 'Не удалось загрузить технологии');
      if (!technologies.length) {
        setTechnologies(mockTechnologies);
      }
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = async (techData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const newTech = {
        id: Date.now(),
        ...techData,
        createdAt: new Date().toISOString()
      };

      setTechnologies(prev => [...prev, newTech]);
      return newTech;
    } catch (err) {
      throw new Error('Не удалось добавить технологию');
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    addTechnology,
    lastSource,
    defaultApiUrl: DEFAULT_API_URL
  };
}

export default useTechnologiesApi;

