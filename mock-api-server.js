import http from 'http';
import { URL } from 'url';

const PORT = 3001;

// Тестовые данные о технологиях для дорожной карты
const ROADMAP_TECHNOLOGIES = [
  {
    id: 1,
    title: 'HTML & CSS',
    description: 'Основы верстки и стилизации веб-страниц',
    category: 'Frontend',
    rating: 4.5,
    thumbnail: 'https://via.placeholder.com/200?text=HTML',
    images: ['https://via.placeholder.com/400?text=HTML+CSS'],
    brand: 'W3C'
  },
  {
    id: 2,
    title: 'JavaScript',
    description: 'Язык программирования для веб-разработки',
    category: 'Frontend',
    rating: 4.8,
    thumbnail: 'https://via.placeholder.com/200?text=JavaScript',
    images: ['https://via.placeholder.com/400?text=JavaScript'],
    brand: 'ECMA'
  },
  {
    id: 3,
    title: 'React',
    description: 'Библиотека для создания пользовательских интерфейсов',
    category: 'Frontend',
    rating: 4.7,
    thumbnail: 'https://via.placeholder.com/200?text=React',
    images: ['https://via.placeholder.com/400?text=React'],
    brand: 'Facebook'
  },
  {
    id: 4,
    title: 'Node.js',
    description: 'Среда выполнения JavaScript на сервере',
    category: 'Backend',
    rating: 4.6,
    thumbnail: 'https://via.placeholder.com/200?text=Node.js',
    images: ['https://via.placeholder.com/400?text=Node.js'],
    brand: 'OpenJS'
  },
  {
    id: 5,
    title: 'Express.js',
    description: 'Фреймворк для создания веб-приложений на Node.js',
    category: 'Backend',
    rating: 4.5,
    thumbnail: 'https://via.placeholder.com/200?text=Express',
    images: ['https://via.placeholder.com/400?text=Express.js'],
    brand: 'Node.js'
  },
  {
    id: 6,
    title: 'PostgreSQL',
    description: 'Мощная реляционная база данных',
    category: 'Database',
    rating: 4.6,
    thumbnail: 'https://via.placeholder.com/200?text=PostgreSQL',
    images: ['https://via.placeholder.com/400?text=PostgreSQL'],
    brand: 'PostgreSQL'
  },
  {
    id: 7,
    title: 'MongoDB',
    description: 'NoSQL база данных',
    category: 'Database',
    rating: 4.4,
    thumbnail: 'https://via.placeholder.com/200?text=MongoDB',
    images: ['https://via.placeholder.com/400?text=MongoDB'],
    brand: 'MongoDB'
  },
  {
    id: 8,
    title: 'Docker',
    description: 'Контейнеризация приложений',
    category: 'DevOps',
    rating: 4.7,
    thumbnail: 'https://via.placeholder.com/200?text=Docker',
    images: ['https://via.placeholder.com/400?text=Docker'],
    brand: 'Docker'
  },
  {
    id: 9,
    title: 'Git',
    description: 'Система контроля версий',
    category: 'Tools',
    rating: 4.8,
    thumbnail: 'https://via.placeholder.com/200?text=Git',
    images: ['https://via.placeholder.com/400?text=Git'],
    brand: 'Linux'
  },
  {
    id: 10,
    title: 'REST API',
    description: 'Архитектурный стиль для веб-сервисов',
    category: 'Backend',
    rating: 4.5,
    thumbnail: 'https://via.placeholder.com/200?text=REST',
    images: ['https://via.placeholder.com/400?text=REST+API'],
    brand: 'W3C'
  },
  {
    id: 11,
    title: 'GraphQL',
    description: 'Язык запросов для API',
    category: 'Backend',
    rating: 4.3,
    thumbnail: 'https://via.placeholder.com/200?text=GraphQL',
    images: ['https://via.placeholder.com/400?text=GraphQL'],
    brand: 'Meta'
  },
  {
    id: 12,
    title: 'TypeScript',
    description: 'Типизированное расширение JavaScript',
    category: 'Frontend',
    rating: 4.6,
    thumbnail: 'https://via.placeholder.com/200?text=TypeScript',
    images: ['https://via.placeholder.com/400?text=TypeScript'],
    brand: 'Microsoft'
  }
];

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  console.log(`📨 ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const fullUrl = `http://localhost:${PORT}${req.url}`;
  const parsedUrl = new URL(fullUrl);
  const pathname = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // Импорт всех технологий (для дорожной карты)
  if (pathname === '/api/technologies' && req.method === 'GET') {
    const limit = parseInt(searchParams.get('limit')) || 12;
    const technologies = ROADMAP_TECHNOLOGIES.slice(0, limit);
    console.log(`✅ Отправляю ${technologies.length} технологий`);
    res.writeHead(200);
    res.end(JSON.stringify({ products: technologies }));
    return;
  }

  // Поиск технологий
  if (pathname === '/api/technologies/search' && req.method === 'GET') {
    const q = (searchParams.get('q') || '').toLowerCase();
    const limit = parseInt(searchParams.get('limit')) || 8;

    let results = ROADMAP_TECHNOLOGIES;
    
    if (q) {
      results = results.filter(tech =>
        tech.title.toLowerCase().includes(q) ||
        tech.description.toLowerCase().includes(q) ||
        tech.category.toLowerCase().includes(q) ||
        tech.brand.toLowerCase().includes(q)
      );
    }

    results = results.slice(0, limit);
    console.log(`🔍 Поиск "${q}" - найдено ${results.length} результатов`);
    res.writeHead(200);
    res.end(JSON.stringify({ products: results }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`✅ Mock API server запущен на http://localhost:${PORT}`);
  console.log(`📍 Доступные endpoints:`);
  console.log(`   - GET /api/technologies (все технологии)`);
  console.log(`   - GET /api/technologies/search?q=javascript (поиск)`);
});
