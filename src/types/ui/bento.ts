import type { ReactNode } from "react"

export type BentoItemProps = {
  children: ReactNode
  className?: string
  colSpan?: number
  rowSpan?: number
  smColSpan?: number
  mdColSpan?: number
  lgColSpan?: number
  xlColSpan?: number
  smRowSpan?: number
  mdRowSpan?: number
  lgRowSpan?: number
  xlRowSpan?: number
}

export type BentoGridProps = {
  children: ReactNode
  cols?: number
  rows?: number
  className?: string
  smCols?: number
  mdCols?: number
  lgCols?: number
  smRows?: number,
  mdRows?: number,
  lgRows?: number,
}