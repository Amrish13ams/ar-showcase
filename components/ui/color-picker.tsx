"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
  label?: string
  className?: string
}

// Primary Colors
const primaryColors = [
  { name: "Blue", value: "blue", hex: "#3B82F6", tailwind: "bg-blue-500" },
  { name: "Red", value: "red", hex: "#EF4444", tailwind: "bg-red-500" },
  { name: "Green", value: "green", hex: "#10B981", tailwind: "bg-green-500" },
  { name: "Yellow", value: "yellow", hex: "#EAB308", tailwind: "bg-yellow-500" },
  { name: "Purple", value: "purple", hex: "#8B5CF6", tailwind: "bg-purple-500" },
  { name: "Pink", value: "pink", hex: "#EC4899", tailwind: "bg-pink-500" },
  { name: "Orange", value: "orange", hex: "#F97316", tailwind: "bg-orange-500" },
  { name: "Teal", value: "teal", hex: "#14B8A6", tailwind: "bg-teal-500" },
]

// Secondary Colors
const secondaryColors = [
  { name: "Indigo", value: "indigo", hex: "#6366F1", tailwind: "bg-indigo-500" },
  { name: "Cyan", value: "cyan", hex: "#06B6D4", tailwind: "bg-cyan-500" },
  { name: "Emerald", value: "emerald", hex: "#059669", tailwind: "bg-emerald-500" },
  { name: "Lime", value: "lime", hex: "#65A30D", tailwind: "bg-lime-500" },
  { name: "Amber", value: "amber", hex: "#D97706", tailwind: "bg-amber-500" },
  { name: "Rose", value: "rose", hex: "#F43F5E", tailwind: "bg-rose-500" },
  { name: "Violet", value: "violet", hex: "#7C3AED", tailwind: "bg-violet-500" },
  { name: "Fuchsia", value: "fuchsia", hex: "#D946EF", tailwind: "bg-fuchsia-500" },
]

// Neutral Colors
const neutralColors = [
  { name: "Slate", value: "slate", hex: "#64748B", tailwind: "bg-slate-500" },
  { name: "Gray", value: "gray", hex: "#6B7280", tailwind: "bg-gray-500" },
  { name: "Zinc", value: "zinc", hex: "#71717A", tailwind: "bg-zinc-500" },
  { name: "Stone", value: "stone", hex: "#78716C", tailwind: "bg-stone-500" },
  { name: "Neutral", value: "neutral", hex: "#737373", tailwind: "bg-neutral-500" },
  { name: "Black", value: "black", hex: "#000000", tailwind: "bg-black" },
  { name: "White", value: "white", hex: "#FFFFFF", tailwind: "bg-white" },
  { name: "Transparent", value: "transparent", hex: "transparent", tailwind: "bg-transparent" },
]

// Blue Shades
const blueShades = [
  { name: "Blue 50", value: "blue-50", hex: "#EFF6FF", tailwind: "bg-blue-50" },
  { name: "Blue 100", value: "blue-100", hex: "#DBEAFE", tailwind: "bg-blue-100" },
  { name: "Blue 200", value: "blue-200", hex: "#BFDBFE", tailwind: "bg-blue-200" },
  { name: "Blue 300", value: "blue-300", hex: "#93C5FD", tailwind: "bg-blue-300" },
  { name: "Blue 400", value: "blue-400", hex: "#60A5FA", tailwind: "bg-blue-400" },
  { name: "Blue 500", value: "blue-500", hex: "#3B82F6", tailwind: "bg-blue-500" },
  { name: "Blue 600", value: "blue-600", hex: "#2563EB", tailwind: "bg-blue-600" },
  { name: "Blue 700", value: "blue-700", hex: "#1D4ED8", tailwind: "bg-blue-700" },
  { name: "Blue 800", value: "blue-800", hex: "#1E40AF", tailwind: "bg-blue-800" },
  { name: "Blue 900", value: "blue-900", hex: "#1E3A8A", tailwind: "bg-blue-900" },
  { name: "Blue 950", value: "blue-950", hex: "#172554", tailwind: "bg-blue-950" },
]

// Red Shades
const redShades = [
  { name: "Red 50", value: "red-50", hex: "#FEF2F2", tailwind: "bg-red-50" },
  { name: "Red 100", value: "red-100", hex: "#FEE2E2", tailwind: "bg-red-100" },
  { name: "Red 200", value: "red-200", hex: "#FECACA", tailwind: "bg-red-200" },
  { name: "Red 300", value: "red-300", hex: "#FCA5A5", tailwind: "bg-red-300" },
  { name: "Red 400", value: "red-400", hex: "#F87171", tailwind: "bg-red-400" },
  { name: "Red 500", value: "red-500", hex: "#EF4444", tailwind: "bg-red-500" },
  { name: "Red 600", value: "red-600", hex: "#DC2626", tailwind: "bg-red-600" },
  { name: "Red 700", value: "red-700", hex: "#B91C1C", tailwind: "bg-red-700" },
  { name: "Red 800", value: "red-800", hex: "#991B1B", tailwind: "bg-red-800" },
  { name: "Red 900", value: "red-900", hex: "#7F1D1D", tailwind: "bg-red-900" },
  { name: "Red 950", value: "red-950", hex: "#450A0A", tailwind: "bg-red-950" },
]

// Green Shades
const greenShades = [
  { name: "Green 50", value: "green-50", hex: "#F0FDF4", tailwind: "bg-green-50" },
  { name: "Green 100", value: "green-100", hex: "#DCFCE7", tailwind: "bg-green-100" },
  { name: "Green 200", value: "green-200", hex: "#BBF7D0", tailwind: "bg-green-200" },
  { name: "Green 300", value: "green-300", hex: "#86EFAC", tailwind: "bg-green-300" },
  { name: "Green 400", value: "green-400", hex: "#4ADE80", tailwind: "bg-green-400" },
  { name: "Green 500", value: "green-500", hex: "#22C55E", tailwind: "bg-green-500" },
  { name: "Green 600", value: "green-600", hex: "#16A34A", tailwind: "bg-green-600" },
  { name: "Green 700", value: "green-700", hex: "#15803D", tailwind: "bg-green-700" },
  { name: "Green 800", value: "green-800", hex: "#166534", tailwind: "bg-green-800" },
  { name: "Green 900", value: "green-900", hex: "#14532D", tailwind: "bg-green-900" },
  { name: "Green 950", value: "green-950", hex: "#052E16", tailwind: "bg-green-950" },
]

// Purple Shades
const purpleShades = [
  { name: "Purple 50", value: "purple-50", hex: "#FAF5FF", tailwind: "bg-purple-50" },
  { name: "Purple 100", value: "purple-100", hex: "#F3E8FF", tailwind: "bg-purple-100" },
  { name: "Purple 200", value: "purple-200", hex: "#E9D5FF", tailwind: "bg-purple-200" },
  { name: "Purple 300", value: "purple-300", hex: "#D8B4FE", tailwind: "bg-purple-300" },
  { name: "Purple 400", value: "purple-400", hex: "#C084FC", tailwind: "bg-purple-400" },
  { name: "Purple 500", value: "purple-500", hex: "#A855F7", tailwind: "bg-purple-500" },
  { name: "Purple 600", value: "purple-600", hex: "#9333EA", tailwind: "bg-purple-600" },
  { name: "Purple 700", value: "purple-700", hex: "#7E22CE", tailwind: "bg-purple-700" },
  { name: "Purple 800", value: "purple-800", hex: "#6B21A8", tailwind: "bg-purple-800" },
  { name: "Purple 900", value: "purple-900", hex: "#581C87", tailwind: "bg-purple-900" },
  { name: "Purple 950", value: "purple-950", hex: "#3B0764", tailwind: "bg-purple-950" },
]

// Brand Colors
const brandColors = [
  { name: "Brand Primary", value: "brand-primary", hex: "#7C3AED", tailwind: "bg-violet-600" },
  { name: "Brand Secondary", value: "brand-secondary", hex: "#2563EB", tailwind: "bg-blue-600" },
  { name: "Brand Accent", value: "brand-accent", hex: "#F43F5E", tailwind: "bg-rose-500" },
  { name: "Brand Light", value: "brand-light", hex: "#F5F3FF", tailwind: "bg-violet-50" },
  { name: "Brand Dark", value: "brand-dark", hex: "#4C1D95", tailwind: "bg-violet-900" },
  { name: "Success", value: "success", hex: "#10B981", tailwind: "bg-green-500" },
  { name: "Warning", value: "warning", hex: "#F59E0B", tailwind: "bg-amber-500" },
  { name: "Error", value: "error", hex: "#EF4444", tailwind: "bg-red-500" },
]

// All colors combined
const allColorGroups = {
  primary: primaryColors,
  secondary: secondaryColors,
  neutral: neutralColors,
  blue: blueShades,
  red: redShades,
  green: greenShades,
  purple: purpleShades,
  brand: brandColors,
}

// Flatten all colors for search
const allColors = [
  ...primaryColors,
  ...secondaryColors,
  ...neutralColors,
  ...blueShades,
  ...redShades,
  ...greenShades,
  ...purpleShades,
  ...brandColors,
]

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [customHex, setCustomHex] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("primary")

  const selectedColor = allColors.find((color) => color.value === value || color.hex === value)
  const displayColor = selectedColor?.hex || (value.startsWith("#") ? value : "#3B82F6")
  const displayName = selectedColor?.name || (value.startsWith("#") ? "Custom" : value)

  const handleColorSelect = (colorValue: string) => {
    console.log("Color selected:", colorValue) // Debug log
    onChange(colorValue)
    setIsOpen(false)
  }

  const handleCustomColorSubmit = () => {
    if (customHex.match(/^#[0-9A-F]{6}$/i)) {
      console.log("Custom color applied:", customHex) // Debug log
      onChange(customHex)
      setIsOpen(false)
      setCustomHex("")
    }
  }

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase()
    if (!value.startsWith("#") && value) {
      value = "#" + value
    }
    setCustomHex(value)
  }

  // Filter colors based on search term
  const filteredColors = searchTerm
    ? allColors.filter(
        (color) =>
          color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          color.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          color.hex.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal h-10">
            <div className="flex items-center gap-2 w-full">
              <div
                className="h-5 w-5 rounded border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: displayColor }}
              />
              <span className="capitalize truncate">{displayName}</span>
              <div className="ml-auto text-xs text-gray-500">{displayColor}</div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4 border-b">
            <Input
              placeholder="Search colors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-2"
            />

            {searchTerm && (
              <div className="mt-2">
                <Label className="text-sm font-medium mb-2 block">Search Results</Label>
                <div className="grid grid-cols-8 gap-1 max-h-40 overflow-y-auto">
                  {filteredColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => handleColorSelect(color.value)}
                      className={cn(
                        "h-6 w-6 rounded-md border transition-all hover:scale-110 relative group",
                        value === color.value
                          ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                          : "border-gray-300",
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name} (${color.hex})`}
                    >
                      {value === color.value && <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Tabs defaultValue="primary" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b">
              <TabsList className="w-full h-auto flex flex-wrap p-0 bg-transparent">
                <TabsTrigger
                  value="primary"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Primary
                </TabsTrigger>
                <TabsTrigger
                  value="secondary"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Secondary
                </TabsTrigger>
                <TabsTrigger
                  value="neutral"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Neutral
                </TabsTrigger>
                <TabsTrigger
                  value="shades"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Shades
                </TabsTrigger>
                <TabsTrigger
                  value="brand"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Brand
                </TabsTrigger>
                <TabsTrigger
                  value="custom"
                  className="flex-1 h-8 data-[state=active]:bg-gray-100 data-[state=active]:shadow-none rounded-none"
                >
                  Custom
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="primary" className="p-4 pt-3">
              <div className="grid grid-cols-4 gap-2">
                {primaryColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      "h-10 w-full rounded-md border-2 transition-all hover:scale-105 relative group",
                      value === color.value || value === color.hex
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {(value === color.value || value === color.hex) && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="secondary" className="p-4 pt-3">
              <div className="grid grid-cols-4 gap-2">
                {secondaryColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      "h-10 w-full rounded-md border-2 transition-all hover:scale-105 relative group",
                      value === color.value || value === color.hex
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {(value === color.value || value === color.hex) && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="neutral" className="p-4 pt-3">
              <div className="grid grid-cols-4 gap-2">
                {neutralColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      "h-10 w-full rounded-md border-2 transition-all hover:scale-105 relative group",
                      value === color.value || value === color.hex
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {(value === color.value || value === color.hex) && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shades" className="p-4 pt-3">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Blue Shades</Label>
                  <div className="grid grid-cols-11 gap-1">
                    {blueShades.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={cn(
                          "h-6 w-full rounded-md border transition-all hover:scale-110 relative group",
                          value === color.value || value === color.hex
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-300",
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        {(value === color.value || value === color.hex) && (
                          <Check className="h-3 w-3 text-white absolute inset-0 m-auto drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Red Shades</Label>
                  <div className="grid grid-cols-11 gap-1">
                    {redShades.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={cn(
                          "h-6 w-full rounded-md border transition-all hover:scale-110 relative group",
                          value === color.value || value === color.hex
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-300",
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        {(value === color.value || value === color.hex) && (
                          <Check className="h-3 w-3 text-white absolute inset-0 m-auto drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Green Shades</Label>
                  <div className="grid grid-cols-11 gap-1">
                    {greenShades.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={cn(
                          "h-6 w-full rounded-md border transition-all hover:scale-110 relative group",
                          value === color.value || value === color.hex
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-300",
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        {(value === color.value || value === color.hex) && (
                          <Check className="h-3 w-3 text-white absolute inset-0 m-auto drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Purple Shades</Label>
                  <div className="grid grid-cols-11 gap-1">
                    {purpleShades.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={cn(
                          "h-6 w-full rounded-md border transition-all hover:scale-110 relative group",
                          value === color.value || value === color.hex
                            ? "border-gray-900 ring-1 ring-gray-900"
                            : "border-gray-300",
                        )}
                        style={{ backgroundColor: color.hex }}
                        title={`${color.name} (${color.hex})`}
                      >
                        {(value === color.value || value === color.hex) && (
                          <Check className="h-3 w-3 text-white absolute inset-0 m-auto drop-shadow-lg" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="brand" className="p-4 pt-3">
              <div className="grid grid-cols-4 gap-2">
                {brandColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      "h-10 w-full rounded-md border-2 transition-all hover:scale-105 relative group",
                      value === color.value || value === color.hex
                        ? "border-gray-900 ring-2 ring-gray-900 ring-offset-1"
                        : "border-gray-300 hover:border-gray-400",
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (${color.hex})`}
                  >
                    {(value === color.value || value === color.hex) && (
                      <Check className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow-lg" />
                    )}
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="p-4 pt-3">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Custom Hex Color</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="#FF5733"
                      value={customHex}
                      onChange={handleCustomHexChange}
                      className="flex-1 font-mono"
                      maxLength={7}
                    />
                    <Button
                      size="sm"
                      onClick={handleCustomColorSubmit}
                      disabled={!customHex.match(/^#[0-9A-F]{6}$/i)}
                      className="px-3"
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter hex color code (e.g., #FF5733)</p>
                </div>

                {customHex.match(/^#[0-9A-F]{6}$/i) && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Preview</Label>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-10 w-20 rounded border border-gray-300"
                        style={{ backgroundColor: customHex }}
                      />
                      <div className="text-sm text-gray-600 font-mono">{customHex}</div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="border-t p-4">
            <Label className="text-sm font-medium mb-2 block">Current Selection</Label>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <div className="h-6 w-6 rounded border border-gray-300" style={{ backgroundColor: displayColor }} />
              <div className="flex-1">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="text-xs text-gray-500 font-mono">{displayColor}</div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
