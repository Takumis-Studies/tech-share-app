
import { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from './contexts/AuthContext'
const API_URL = import.meta.env.VITE_API_URL

function CreateArticle() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      alert('題名と本文を入力してください')
      return
    }

    try {
      const now = new Date().toISOString()

      const newArticle = {
        title: title,
        body: body,
        authorId: user.id,
        createdAt: now,
        updatedAt: now
      }

      const response = await fetch(`${API_URL}/articles`, {

          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newArticle)
        }
      )

      if (!response.ok) {
        throw new Error('記事の保存に失敗しました')
      }

      navigate('/')
    } catch (error) {
      console.error(error)
      alert('記事を保存できませんでした')
    }
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return (
    <main>
      <h1>新しい記事を書く</h1>

      <Link to="/">記事一覧に戻る</Link>

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
        投稿する
      </button>
    </main>
  )
}

export default CreateArticle
