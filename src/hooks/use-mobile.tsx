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
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Return false during SSR and initial client render to prevent flickering
  return isClient ? isMobile : false
}
