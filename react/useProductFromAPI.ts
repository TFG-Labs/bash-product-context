import { useEffect, useState } from 'react'
import { MaybeProduct } from './ProductTypes'

interface ApiResponse {
  data: MaybeProduct[]
  success: boolean
  errorCode: string | null
  errorMessage: string | null
}

const API_BASE_URL = 'https://be1160c66d5b.ngrok-free.app'
// 🚀 HARDCODED FOR TESTING
const HARDCODED_SLUG = 'ts-mens-summit-marathon-lime-run-jacket-130609adpq6'

export function useProductFromAPI(): {
  product: MaybeProduct
  loading: boolean
  error: string | null
} {
  console.log('🔥 🔥 🔥 BASH useProductFromAPI: HOOK CALLED!')
  
  const [product, setProduct] = useState<MaybeProduct>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🚀 BASH PRODUCT CONTEXT: useEffect triggered!')
    console.log('🚀 BASH PRODUCT CONTEXT: Is browser?', typeof window !== 'undefined')
    console.log('🚀 BASH PRODUCT CONTEXT: Has fetch?', typeof fetch !== 'undefined')
    
    // Only run in browser environment
    if (typeof window === 'undefined') {
      console.warn('🚀 BASH PRODUCT CONTEXT: Skipping API call - running on server')
      setLoading(false)
      return
    }

    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🚀 BASH PRODUCT CONTEXT: Fetching product data for slug:', HARDCODED_SLUG)
        console.log('🚀 BASH PRODUCT CONTEXT: API URL:', `${API_BASE_URL}/v1/products/product/vtex/${HARDCODED_SLUG}`)

        const response = await fetch(`${API_BASE_URL}/v1/products/product/vtex/${HARDCODED_SLUG}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const data: ApiResponse = await response.json()
        
        console.log('🚀 BASH PRODUCT CONTEXT: API Response received:', data)

        if (data.success && data.data && data.data.length > 0) {
          const productData = data.data[0]
          console.log('🚀 BASH PRODUCT CONTEXT: Setting product data:', productData)
          setProduct(productData)
        } else {
          console.warn('🚀 BASH PRODUCT CONTEXT: No product data found in API response')
          setProduct(null)
          setError('No product data found')
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        console.error('🚀 BASH PRODUCT CONTEXT: Error fetching product:', errorMessage)
        setError(errorMessage)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }

    console.log('🚀 BASH PRODUCT CONTEXT: useEffect triggered, fetching product...')
    fetchProductData()
  }, []) // Empty dependency array - fetch once on mount

  return { product, loading, error }
}