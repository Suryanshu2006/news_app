import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './themes.css';

// Add your NewsAPI.org API key here
const API_KEY = 'e806ff3eacdd4878ba7e2134c5c0d000';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [theme, setTheme] = useState('dark');

  const fetchMoreData = async () => {
    try {
      const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&page=${page}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setArticles(articles.concat(data.articles));
      setPage(page + 1);
      if (data.articles.length === 0 || data.totalResults === articles.length) {
        setHasMore(false);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (API_KEY !== 'YOUR_NEWS_API_KEY') {
      fetchMoreData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`App theme-${theme}`}>
      <header className="App-header">
        <h1>News</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          Switch to {theme === 'dark' ? 'Light' : 'Dark'} Theme
        </button>
      </header>
      <main>
        {API_KEY === 'YOUR_NEWS_API_KEY' ? (
          <p>Please add your NewsAPI.org API key to App.js</p>
        ) : loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <InfiniteScroll
            dataLength={articles.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: 'center' }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <div className="news-grid">
              {articles.map((article, index) => (
                <div key={index} className="news-card">
                  {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                </div>
              ))}
            </div>
          </InfiniteScroll>
        )}
      </main>
    </div>
  );
}

export default App;