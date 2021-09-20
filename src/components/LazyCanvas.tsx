import dynamic from "next/dynamic"
import { CanvasProps } from "./Canvas"

const DynamicComponentWithNoSSR = dynamic(() => import("./Canvas"), {
  ssr: false,
})
export const LazyCanvas = (props: CanvasProps) => <DynamicComponentWithNoSSR {...props} />
