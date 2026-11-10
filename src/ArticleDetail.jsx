
import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useAuth } from './contexts/AuthContext'
const API_URL = import.meta.env.VITE_API_URL

function ArticleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    
async function handleDelete() {
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

    navigate('/')
  } catch (error) {
    console.error(error)
    alert('記事を削除できませんでした')
  }
}


  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await fetch(`${API_URL}/articles/${id}`)

        if (!response.ok) {
          throw new Error('記事が見つかりません')
        }

        const data = await response.json()
        setArticle(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  if (loading) {
    return <main><p>読み込み中...</p></main>
  }

  if (error) {
    return (
      <main>
        <p>{error}</p>
        <Link to="/">記事一覧に戻る</Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">記事一覧に戻る</Link>

      <h1>{article.title}</h1>

      <p>作成日：{new Date(article.createdAt).toLocaleDateString('ja-JP')}</p>

      <hr />

      <ReactMarkdown>{article.body}</ReactMarkdown>



{user && user.id === article.authorId && (
  <div>
    <Link to={`/articles/${article.id}/edit`}>
      編集
    </Link>

    {' '}



<button
  type="button"
  onClick={handleDelete}
>
  削除
</button>
  </div>
)}
    </main>
  )
}

export default ArticleDetail
