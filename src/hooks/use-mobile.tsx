import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial state immediately
    updateIsMobile()
    
    // Add listener for changes
    mql.addEventListener("change", updateIsMobile)
    
    return () => {
      mql.removeEventListener("change", updateIsMobile)
    }
  }, [])

  // Return false during SSR to prevent hydration mismatch
  return isMobile ?? false
}
