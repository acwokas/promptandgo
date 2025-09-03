import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Start with a stable default to prevent hydration mismatches
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isClient, setIsClient] = React.useState(false)

  React.useEffect(() => {
    // Mark that we're on the client side
    setIsClient(true)
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Debounce the onChange handler to reduce flicker
    let timeoutId: NodeJS.Timeout
    const onChange = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }, 50)
    }
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => {
      clearTimeout(timeoutId)
      mql.removeEventListener("change", onChange)
    }
  }, [])

  // Return false during SSR and initial client render to prevent flickering
  return isClient ? isMobile : false
}
