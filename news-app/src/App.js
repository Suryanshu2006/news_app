import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './themes.css';

const API_KEY = 'pub_bd6633b6cba7448fbaa645c7680b96b7';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [theme, setTheme] = useState('dark');

  const fetchMoreData = async () => {
    let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&language=en`;
    if (nextPage) {
      url += `&page=${nextPage}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setArticles(articles.concat(data.results));
      if (data.nextPage) {
        setNextPage(data.nextPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMoreData();
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
        {loading ? (
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
                  {article.image_url && <img src={article.image_url} alt={article.title} />}
                  <h2>{article.title}</h2>
                  <p>{article.description}</p>
                  <a href={article.link} target="_blank" rel="noopener noreferrer">Read more</a>
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