
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
const API_URL = import.meta.env.VITE_API_URL

function ArticleDetail() {
  const { id } = useParams()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

      <p>作成日：{article.createdAt}</p>

      <hr />

      <ReactMarkdown>{article.body}</ReactMarkdown>
    </main>
  )
}

export default ArticleDetail
