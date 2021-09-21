import {
  Flex,
  FlexProps,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react"
import Color from "color"
import React, { Fragment, useCallback } from "react"
import { CirclePicker, ColorResult } from "react-color"
import { AiFillCheckCircle, FaPalette, ImDice } from "react-icons/all"
import { COLOR_PALETTE } from "../utils/colors"

export type ColorPickerProps = {
  colors: Array<string>
  onColorsChanged: (colors: Array<string> | ((colors: Array<string>) => Array<string>)) => void
  containerProps?: Partial<FlexProps>
  onPaintClick?: (index: number) => void
  activeColorIndex?: number
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
                                                          onPaintClick,
                                                          colors,
                                                          onColorsChanged,
                                                          containerProps,
                                                          activeColorIndex,
                                                        }) => {

  const setColorAtIndex = useCallback((changingIndex: number, color: string) => {
    onColorsChanged((colors) => {
      const newColors = [...colors]
      newColors[changingIndex] = color.toUpperCase()
      return newColors
    })
  }, [onColorsChanged])

  const createColorChangeCallback = useCallback((changingIndex: number) => {
    return (color: ColorResult) => {
      setColorAtIndex(changingIndex, color.hex)
    }
  }, [setColorAtIndex])

  const createRandomizeColorCallback = useCallback((changingIndex: number) => {
    return () => {
      const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
      setColorAtIndex(changingIndex, color)
    }
  }, [setColorAtIndex])

  return (
    <Flex
      flexDirection="row"
      borderRadius="12px"
      height="full"
      width="full"
      border="1px solid white"
      justifyContent="space-between"
      {...containerProps}
    >
      {colors.map((color, index) => {
        const activeColor = Color(color).isDark() ? "whiteAlpha.700" : "blackAlpha.700"
        return (
          <Flex flex={1} key={index} direction="column" _notLast={{ borderRight: "1px solid white" }}>
            <Flex
              cursor="pointer"
              backgroundColor={color}
              alignItems="center"
              justifyContent="center"
              height="7.5vh"
              onClick={() => {
                onPaintClick?.(index)
              }}
              borderTopLeftRadius={index === 0 ? "12px" : undefined}
              borderTopRightRadius={index === (colors.length - 1) ? "12px" : undefined}
              color={activeColor}
            >
              {(index === activeColorIndex) && (
                <AiFillCheckCircle size="2.5vh" />
              )}
            </Flex>
            <Flex direction="row">
              <IconButton
                size="sm"
                flex={1}
                aria-label="Select color"
                icon={<ImDice />}
                borderRadius={0}
                borderBottomLeftRadius={index === 0 ? "12px" : undefined}
                onClick={createRandomizeColorCallback(index)}
              />
              <Popover isLazy placement="bottom-start">
                {({ onClose }) => (
                  <Fragment>
                    <PopoverTrigger>
                      <IconButton
                        size="sm"
                        flex={1}
                        aria-label="Select color"
                        icon={<FaPalette />}
                        borderRadius={0}
                        borderBottomRightRadius={index === (colors.length - 1) ? "12px" : undefined}
                      />
                    </PopoverTrigger>
                    <Portal>

                      <PopoverContent width="335px" height="290px" _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverBody>
                          <CirclePicker
                            width="320px"
                            onChangeComplete={createColorChangeCallback(index)}
                            colors={COLOR_PALETTE}
                            circleSize={30}
                            circleSpacing={10}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>

                  </Fragment>
                )}
              </Popover>
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}
