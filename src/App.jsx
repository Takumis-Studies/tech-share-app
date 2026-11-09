

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import './App.css'
import { Link, Routes, Route, useLocation } from 'react-router-dom'
import ArticleDetail from './ArticleDetail'
import CreateArticle from './CreateArticle'
import Layout from './components/templates/Layout'
import { useAuth } from './contexts/AuthContext'
import { useSearch } from './hooks/useSearch'
const API_URL = import.meta.env.VITE_API_URL

function App() {
  const location = useLocation()
  const { user, login, logout } = useAuth()
  const [articles, setArticles] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [searchText, setSearchText] = useState('')


useEffect(() => {
  if (location.pathname !== '/') return

  fetch(`${API_URL}/articles`)
    .then(response => response.json())
    .then(data => setArticles(data))
    .catch(error => console.error(error))
}, [location.pathname])

  
  async function handleSubmit() {
    if (!user) return
    if (!title.trim() || !body.trim()) {
      alert('題名と本文を入力してください')
      return
    }

    try {

const now = new Date().toISOString()
const isEditing = editingId !== null

const articleData = isEditing
  ? {
      title: title,
      body: body,
      updatedAt: now
    }
  : {
      title: title,
      body: body,
      authorId: 'user1',
      createdAt: now,
      updatedAt: now
    }


const response = await fetch(
  isEditing
    ? `${API_URL}/articles/${editingId}`
    : `${API_URL}/articles`,
  {
    method: isEditing ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(articleData)
  }
)

if (!response.ok) {
  throw new Error('記事の保存に失敗しました')
}

const savedArticle = await response.json()

if (isEditing) {
  setArticles(previousArticles =>
    previousArticles.map(article =>
      article.id === editingId ? savedArticle : article
    )
  )
} else {
  setArticles(previousArticles => [...previousArticles, savedArticle])
}

setTitle('')
setBody('')
setEditingId(null)
    } catch (error) {
      console.error(error)
      alert('記事を保存できませんでした')
    }
  }

  
function handleEdit(article) {
  if (!user) return
  setEditingId(article.id)
  setTitle(article.title)
  setBody(article.body)
}


function handleCancelEdit() {
  setEditingId(null)
  setTitle('')
  setBody('')
}


function handleLogout() {
  handleCancelEdit()
  logout()
}


  async function handleDelete(id) {
    if (!user) return
    const confirmed = window.confirm('この記事を削除しますか？')

    if (!confirmed) {
      return
    }

    try {
      

const response = await fetch(`${API_URL}/articles/${id}`, {
  method: 'DELETE'
})


      if (!response.ok) {
        throw new Error('記事の削除に失敗しました')
      }

      setArticles(previousArticles =>
        previousArticles.filter(article => article.id !== id)
      )
    } catch (error) {
      console.error(error)
      alert('記事を削除できませんでした')
    }
  }


const filteredArticles = useSearch(articles, searchText)



return (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/articles/:id" element={<ArticleDetail />} />

      <Route path="/create" element={<CreateArticle />} />

      <Route path="/" element={
      <main>
        <h1>TechShare</h1>
      
      <p>技術記事を共有するアプリ</p>
      

{user ? (
  <div>
    <p>ようこそ、{user.name}さん</p>

    <Link to="/create">
      記事を書く
    </Link>

    {' '}

    <button onClick={handleLogout}>
      ログアウト
    </button>
  </div>

) : (

  <div>
    <p>現在ログインしていません</p>
    <button onClick={login}>
      ログイン
    </button>
  </div>
)}


{user && (
  <>
    <h2>
      {editingId !== null ? '記事の編集' : '新しい記事を書く'}
    </h2>

    <input
      type="text"
      placeholder="記事の題名"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />

    <textarea
      placeholder="記事の本文"
      rows="6"
      value={body}
      onChange={(e) => setBody(e.target.value)}
    />


    <h3>本文の表示確認</h3>

    <div className="preview">
      <ReactMarkdown>{body}</ReactMarkdown>
    </div>

    <button onClick={handleSubmit}>
      {editingId !== null ? '更新する' : '投稿する'}
    </button>

    {editingId !== null && (
      <button type="button" 
      onClick={handleCancelEdit}>
        編集を取り消す
      </button>
    )}
  </> 
)}

  
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


{user && user.id === article.authorId && (
  <>
    <button
      type="button"
      onClick={() => handleEdit(article)}
    >
      編集する
    </button>

    {' '}

    <button
      type="button"
      onClick={() => handleDelete(article.id)}
    >
      削除する
    </button>
  </>
)}

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
