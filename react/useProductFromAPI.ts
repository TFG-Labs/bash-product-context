import { useEffect, useState } from 'react'
import { MaybeProduct } from './ProductTypes'

interface ApiResponse {
  data: MaybeProduct[] | null
  success: boolean
  errorCode: string | null
  errorMessage: string | null
}


const API_BASE_URL = 'https://web-api.bash.com'
// 🚀 HARDCODED FOR TESTING
const HARDCODED_SLUG = 'ts-mens-summit-marathon-lime-run-jacket-130609adpq6'

export function useProductFromAPI(): {
  product: MaybeProduct
  loading: boolean
  error: string | null
} {
  const [product, setProduct] = useState<MaybeProduct>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/v1/products/product/slug/${HARDCODED_SLUG}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const data: ApiResponse = await response.json()

        if (data.success && data.data && Array.isArray(data.data) && data.data.length > 0) {
          const productData = data.data[0]
          setProduct(productData)
        } else {
          setProduct(null)
          setError(data.errorMessage || 'No product data found')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, []) // Empty dependency array - fetch once on mount

  return { product, loading, error }
}