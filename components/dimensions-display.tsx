import { parseDimensions } from "@/lib/model-scaling"

interface DimensionsDisplayProps {
  dimensions: string
  className?: string
}

export function DimensionsDisplay({ dimensions, className = "" }: DimensionsDisplayProps) {
  const parsed = parseDimensions(dimensions)

  return (
    <div className={`text-sm ${className}`}>
      <div className="font-medium text-gray-800 mb-1">Actual Dimensions:</div>
      <div className="space-y-1 text-gray-600">
        <div>Length: {parsed.length} cm</div>
        <div>Width: {parsed.width} cm</div>
        <div>Height: {parsed.height} cm</div>
      </div>
      <div className="mt-2 text-xs text-gray-500">3D model scaled to real-world proportions</div>
    </div>
  )
}
