import { Box, BoxProps, Flex, useBoolean } from "@chakra-ui/react"
import "@fontsource/source-serif-pro/400.css"
import React, { useCallback, useState } from "react"
import { ColorPicker } from "./ColorPicker"

export type CanvasProps = {
  dimensionSize: number
  pixels: Array<number>
  onPixelsChange: (pixels: Array<number> | ((pixels: Array<number>) => Array<number>)) => void
  colors: Array<string>
  onColorsChange: (colors: Array<string> | ((colors: Array<string>) => Array<string>)) => void
  containerProps?: Partial<BoxProps>
}

const Canvas: React.FC<CanvasProps> = ({
                                         dimensionSize,
                                         colors,
                                         onColorsChange,
                                         pixels,
                                         onPixelsChange,
                                         containerProps,
                                       }) => {
  const [isDragging, { on: startDragging, off: stopDragging }] = useBoolean()
  const [activeColorIndex, setActiveColorIndex] = useState(0)

  const setPixel = useCallback((pixelIndex) => {
    onPixelsChange((pixels) => {
      const newPixels = [...pixels]
      newPixels[pixelIndex] = activeColorIndex
      return newPixels
    })
  }, [onPixelsChange, activeColorIndex])

  return (
    <Box flex={1} onMouseUp={stopDragging} width="full" {...containerProps}>
      <div
        className="chimp"
        onMouseDown={startDragging}
        onMouseUp={stopDragging}
      >
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" shapeRendering="crispEdges"
             viewBox={`0 0 ${dimensionSize} ${dimensionSize}`}>
          {pixels.map((value, index) => {
            return (
              <rect
                key={index}
                fill={colors[value]}
                onMouseEnter={() => {
                  if (isDragging) {
                    setPixel(index)
                  }
                }}
                onMouseDown={() => {
                  setPixel(index)
                }}
                x={index % dimensionSize}
                y={Math.floor(index / dimensionSize)}
                width="1.01"
                height="1.01"
              />
            )
          })}
        </svg>
      </div>
      <Flex width="full" marginTop="24px">
        <ColorPicker
          colors={colors}
          onColorsChanged={onColorsChange}
          onPaintClick={setActiveColorIndex}
          activeColorIndex={activeColorIndex}
        />
      </Flex>
    </Box>
  )
}

export default Canvas
