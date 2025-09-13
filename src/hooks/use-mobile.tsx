import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Set initial state immediately to prevent layout shift
    const initialCheck = window.innerWidth < MOBILE_BREAKPOINT
    setIsMobile(initialCheck)
    
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

  return isMobile
}
