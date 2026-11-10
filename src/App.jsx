

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import ArticleDetail from './ArticleDetail'
import CreateArticle from './CreateArticle'
import Layout from './components/templates/Layout'
import { useSearch } from './hooks/useSearch'
const API_URL = import.meta.env.VITE_API_URL

function App() {
  const location = useLocation()
  const [articles, setArticles] = useState([])
  const [searchText, setSearchText] = useState('')


useEffect(() => {
  if (location.pathname !== '/') return

  fetch(`${API_URL}/articles`)
    .then(response => response.json())
    .then(data => setArticles(data))
    .catch(error => console.error(error))
}, [location.pathname])

  
const filteredArticles = useSearch(articles, searchText)


return (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/articles/:id" element={<ArticleDetail />} />

      <Route path="/articles/:id/edit" element={<CreateArticle />} />

      <Route path="/create" element={<CreateArticle />} />

      <Route path="/" element={
       <main>
         <h1>TechShare</h1>
      
         <p>技術記事を共有するアプリ</p>
      
  
<hr />


<h2>記事を検索する</h2>

<input
  type="text"
  placeholder="検索したい言葉を入力"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
/>

{filteredArticles.length === 0 && (
  <p>記事が見つかりません</p>
)}


{filteredArticles.map(article => (
  <article key={article.id}>
    <Link
    
      to={`/articles/${article.id}`}
      className="article-card-link"
    >
      <h2>{article.title}</h2>

      <div>
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>
    </Link>

    <p>作成日：{new Date(article.createdAt).toLocaleDateString('ja-JP')}</p>

    <hr />
  </article>
))}


      </main>
      } />
    </Route>
  </Routes>
  )
}

export default App
