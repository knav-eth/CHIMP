import Color from "color"

export const COLOR_PALETTE = [
  "#00237C",
  "#0B53D7",
  "#51A5FE",
  "#B5D9FE",
  "#0D1099",
  "#3337FE",
  "#8084FE",
  "#CACAFE",
  "#300092",
  "#6621F7",
  "#BC6AFE",
  "#E3BEFE",
  "#4F006C",
  "#9515BE",
  "#F15BFE",
  "#F9B8FE",
  "#600035",
  "#AC166E",
  "#FE5EC4",
  "#FEBAE7",
  "#5C0500",
  "#A62721",
  "#FE7269",
  "#FEC3BC",
  "#461800",
  "#864300",
  "#E19321",
  "#F4D199",
  "#272D00",
  "#596200",
  "#ADB600",
  "#DEE086",
  "#093E00",
  "#2D7A00",
  "#79D300",
  "#C6EC87",
  "#004500",
  "#0C8500",
  "#51DF21",
  "#B2F29D",
  "#004106",
  "#007F2A",
  "#3AD974",
  "#A7F0C3",
  "#003545",
  "#006D85",
  "#39C3DF",
  "#A8E7F0",
  "#000000",
  "#424242",
  "#A1A1A1",
  "#FFFFFF",
]

export function getColorOverlayedOnBackground(
  base: string,
  background: string,
  alpha: number,
): string {
  const baseColor = Color(base)
  const bgColor = Color(background)

  const calculateColorChannel = (baseValue: number, backgroundValue: number): number => {
    return baseValue * alpha + (1 - alpha) * backgroundValue
  }

  const red = calculateColorChannel(baseColor.red(), bgColor.red())
  const green = calculateColorChannel(baseColor.green(), bgColor.green())
  const blue = calculateColorChannel(baseColor.blue(), bgColor.blue())

  return Color.rgb(red, green, blue).hex()
}

export function calculateHoveringColor(colorStr: string): string {
  const color = Color(colorStr)
  return color.isDark()
    ? getColorOverlayedOnBackground("#FFF", colorStr, 0.4)
    : getColorOverlayedOnBackground("#000", colorStr, 0.4)
}

export function getBackgroundColorShade(baseColor: string, alpha = 0.7): string {
  return getColorOverlayedOnBackground(baseColor, "#FFF", alpha)
}
