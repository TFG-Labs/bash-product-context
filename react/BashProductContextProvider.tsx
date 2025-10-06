import React, { FC, useEffect, useState } from 'react'
import ProductContextProvider from './ProductContextProvider'
import { MaybeProduct } from './ProductTypes'

interface BashProductContextProviderProps {
  productSlug?: string
  apiBaseUrl?: string
  fallbackProduct?: MaybeProduct
  query?: Record<string, any>
  children: React.ReactNode
}

interface ApiResponse {
  data: MaybeProduct[]
  success: boolean
  errorCode: string | null
  errorMessage: string | null
}

const BashProductContextProvider: FC<BashProductContextProviderProps> = ({
  productSlug,
  apiBaseUrl = 'https://be1160c66d5b.ngrok-free.app',
  fallbackProduct = null,
  query = {},
  children,
}) => {
  const [product, setProduct] = useState<MaybeProduct>(fallbackProduct)
  const [loading, setLoading] = useState(!!productSlug)

  useEffect(() => {
    if (!productSlug) {
      setProduct(fallbackProduct)
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log('🚀 BASH PRODUCT CONTEXT: Fetching product from API:', `${apiBaseUrl}/v1/products/product/vtex/${productSlug}`)
        
        const response = await fetch(`${apiBaseUrl}/v1/products/product/vtex/${productSlug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
          },
        })

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }

        const data: ApiResponse = await response.json()
        
        console.log('🚀 BASH PRODUCT CONTEXT: API Response:', data)

        if (data.success && data.data && data.data.length > 0) {
          const fetchedProduct = data.data[0]
          console.log('🚀 BASH PRODUCT CONTEXT: Setting product:', fetchedProduct)
          setProduct(fetchedProduct)
        } else {
          console.warn('🚀 BASH PRODUCT CONTEXT: No product data, using fallback:', fallbackProduct)
          setProduct(fallbackProduct)
        }
      } catch (error) {
        console.error('🚀 BASH PRODUCT CONTEXT: Error fetching product:', error)
        console.log('🚀 BASH PRODUCT CONTEXT: Using fallback product:', fallbackProduct)
        setProduct(fallbackProduct)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productSlug, apiBaseUrl, fallbackProduct])

  // Show loading state
  if (loading) {
    console.log('🚀 BASH PRODUCT CONTEXT: Loading product data...')
    return (
      <ProductContextProvider query={query} product={null}>
        {children}
      </ProductContextProvider>
    )
  }

  console.log('🚀 BASH PRODUCT CONTEXT: Providing product to context:', product)

  return (
    <ProductContextProvider query={query} product={product}>
      {children}
    </ProductContextProvider>
  )
}

export default BashProductContextProvider