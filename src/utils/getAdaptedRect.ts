export default function getAdaptedRect(metaRect: Rectangle, adaptedWidth: number) {
  const { width, height, left, top } = metaRect
  const rect = {
    width: adaptedWidth,
    height: height / width * adaptedWidth,
    left: left,
    top: top
  }
  return rect
}