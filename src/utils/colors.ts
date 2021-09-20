import Color from "color"

export const COLOR_PALETTE = [
  "#585858",
  "#00237C",
  "#0D1099",
  "#300092",
  "#4F006C",
  "#600035",
  "#5C0500",
  "#461800",
  "#272D00",
  "#093E00",
  "#004500",
  "#004106",
  "#003545",
  "#A1A1A1",
  "#0B53D7",
  "#3337FE",
  "#6621F7",
  "#9515BE",
  "#AC166E",
  "#A62721",
  "#864300",
  "#596200",
  "#2D7A00",
  "#0C8500",
  "#007F2A",
  "#006D85",
  "#FFFFFF",
  "#51A5FE",
  "#8084FE",
  "#BC6AFE",
  "#F15BFE",
  "#FE5EC4",
  "#FE7269",
  "#E19321",
  "#ADB600",
  "#79D300",
  "#51DF21",
  "#3AD974",
  "#39C3DF",
  "#424242",
  "#B5D9FE",
  "#CACAFE",
  "#E3BEFE",
  "#F9B8FE",
  "#FEBAE7",
  "#FEC3BC",
  "#F4D199",
  "#DEE086",
  "#C6EC87",
  "#B2F29D",
  "#A7F0C3",
  "#A8E7F0",
  "#ACACAC",
  "#000000",
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
