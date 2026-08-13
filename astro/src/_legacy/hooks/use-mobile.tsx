import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)

  React.useLayoutEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial state immediately
    checkIsMobile()
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const updateIsMobile = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Add listener for changes
    mql.addEventListener("change", updateIsMobile)
    
    return () => {
      mql.removeEventListener("change", updateIsMobile)
    }
  }, [])

  // Return null until we have a stable measurement
  return isMobile
}
