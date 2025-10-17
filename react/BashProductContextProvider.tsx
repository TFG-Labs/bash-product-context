import React, { FC, useEffect, useState } from 'react'
import ProductContextProvider from './ProductContextProvider'
import { MaybeProduct } from './ProductTypes'

interface BashProductContextProviderProps {
  productSlug?: string
  apiBaseUrl?: string
  fallbackProduct?: MaybeProduct
  query?: Record<string, any>
  debug?: boolean
  children: React.ReactNode
}

interface ApiResponse {
  data: MaybeProduct[] | null
  success: boolean
  errorCode: string | null
  errorMessage: string | null
}

const BashProductContextProvider: FC<BashProductContextProviderProps> = ({
  productSlug,
  apiBaseUrl = 'https://web-api.bash.com',
  fallbackProduct = null,
  query = {},
  debug = false,
  children,
}) => {
  const [product, setProduct] = useState<MaybeProduct>(fallbackProduct)
  const [loading, setLoading] = useState(!!productSlug)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!productSlug) {
      setProduct(fallbackProduct)
      setLoading(false)
      return
    }

    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        const response = await fetch(`${apiBaseUrl}/v1/products/product/vtex/${productSlug}`, {
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
          const fetchedProduct = data.data[0]
          setProduct(fetchedProduct)
          setNotFound(false)
        } else {
          setProduct(null)
          setNotFound(true)
        }
      } catch (error) {
        setProduct(null)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productSlug, apiBaseUrl, fallbackProduct, debug])

  // Show loading state
  if (loading) {
    return (
      <div style={{
        width: '100%',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #040404',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // Show not found page if product doesn't exist
  if (notFound) {
    // Provide null product - the conditional renderer will handle showing 404
    return (
      <ProductContextProvider query={query} product={null}>
        {children}
      </ProductContextProvider>
    )
  }

  return (
    <ProductContextProvider query={query} product={product}>
      {children}
    </ProductContextProvider>
  )
}

export default BashProductContextProvider