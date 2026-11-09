
import { useMemo } from 'react'

export function useSearch(articles, searchText) {
  const filteredArticles = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    return articles.filter(article => {
      const title = article.title.toLowerCase()
      const body = article.body.toLowerCase()

      return title.includes(keyword) || body.includes(keyword)
    })
  }, [articles, searchText])

  return filteredArticles
}
