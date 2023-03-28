import { useLocation } from 'react-router-dom'

const useQuery = <T = Record<string, string>>(key?: string) => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)

  if (!key) {
    return new Proxy(query, {
      get: (query, prop: string) => query.get(prop),
    }) as T
  }

  return query.get(key) as T
}

export default useQuery
