import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { filters = [], orderBy = 'created_at', ascending = false, limit = null } = options

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from(table).select('*')
      filters.forEach(({ column, value, operator = 'eq' }) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query[operator](column, value)
        }
      })
      query = query.order(orderBy, { ascending })
      if (limit) query = query.limit(limit)
      const { data: result, error: err } = await query
      if (err) throw err
      setData(result || [])
    } catch (err) {
      console.error(`Fetch ${table} error:`, err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [table, JSON.stringify(filters), orderBy, ascending, limit])

  useEffect(() => { fetchData() }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function useCakes(filters = {}) {
  const queryFilters = []
  if (filters.category) queryFilters.push({ column: 'category', value: filters.category })
  if (filters.is_featured) queryFilters.push({ column: 'is_featured', value: true })
  if (filters.is_active !== undefined) queryFilters.push({ column: 'is_active', value: filters.is_active })
  if (filters.search) {
    queryFilters.push({ column: 'name', value: `%${filters.search}%`, operator: 'ilike' })
  }
  return useSupabaseQuery('cakes', { filters: queryFilters, orderBy: 'created_at' })
}

export function useCake(slug) {
  const [cake, setCake] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) { setLoading(false); return }
    setLoading(true)
    supabase.from('cakes').select('*').eq('slug', slug).single()
      .then(({ data, error }) => {
        if (error || !data) {
          supabase.from('cakes').select('*').eq('id', slug).single()
            .then(({ data: d2 }) => { setCake(d2); setLoading(false) })
            .catch(() => { setCake(null); setLoading(false) })
        } else {
          setCake(data)
          setLoading(false)
        }
      })
  }, [slug])

  return { cake, loading }
}

export function useCakeById(id) {
  const [cake, setCake] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    setLoading(true)
    supabase.from('cakes').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        setCake(error ? null : data)
        setLoading(false)
      })
  }, [id])

  return { cake, loading }
}

export function useCategories() {
  return useSupabaseQuery('categories', { filters: [{ column: 'is_active', value: true }], orderBy: 'sort_order' })
}

export function useFlavors() {
  return useSupabaseQuery('flavors', { filters: [{ column: 'is_active', value: true }], orderBy: 'name' })
}

export function useReviews(filters = {}) {
  const queryFilters = [{ column: 'approved', value: true }]
  if (filters.cake_id) queryFilters.push({ column: 'cake_id', value: filters.cake_id })
  return useSupabaseQuery('reviews', { filters: queryFilters, orderBy: 'created_at' })
}

export async function submitContactMessage(data) {
  const { error } = await supabase.from('contact_messages').insert([{
    full_name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
  }])
  if (error) throw error
}

export async function submitReview(data) {
  const { error } = await supabase.from('reviews').insert([{
    customer_name: data.name,
    location: data.location || null,
    rating: data.rating,
    comment: data.comment,
    event: data.event || null,
    cake_name: data.cakeName || null,
    cake_id: data.cakeId || null,
  }])
  if (error) throw error
}
