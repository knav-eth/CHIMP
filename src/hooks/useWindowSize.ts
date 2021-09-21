import { useEffect, useState } from "react"

export type UseWindowSize = [number, number]

export function useWindowSize(): UseWindowSize {
  const [size, setSize] = useState<UseWindowSize>([window.innerHeight, window.innerWidth])
  useEffect(() => {
    const handleResize = (): void => {
      setSize([window.innerHeight, window.innerWidth])
    }
    window.addEventListener("resize", handleResize)
    return (): void => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  return size
}
