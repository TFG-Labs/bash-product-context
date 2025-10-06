declare module 'vtex.render-runtime' {
  export interface Runtime {
    route: {
      params: Record<string, string>
      path: string
      canonicalPath: string
      routeId: string
    }
    navigate: (options: { to: string; replace?: boolean }) => void
    query: Record<string, string | string[]>
    culture: {
      country: string
      currency: string
      locale: string
    }
    page: string
    account: string
    workspace: string
    binding: {
      id: string
      canonicalBaseAddress: string
    }
  }

  export function useRuntime(): Runtime
}