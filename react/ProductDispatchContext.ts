import type { Dispatch } from 'react'
import { createContext, useContext } from 'react'

import type { Actions } from './ProductContextProvider'

export const ProductDispatchContext = createContext<Dispatch<Actions> | null>(
  null
)

export function useProductDispatch() {
  return useContext(ProductDispatchContext)
}
