import type { BentoGridProps, BentoItemProps } from "@/types"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function BentoItem({
  children,
  className = "",
  colSpan = 1,
  rowSpan = 1,
  smColSpan = 1,
  mdColSpan = colSpan,
  lgColSpan = colSpan,
  xlColSpan = colSpan,
  smRowSpan = 1,
  mdRowSpan = rowSpan,
  lgRowSpan = rowSpan,
  xlRowSpan = rowSpan,
}: BentoItemProps) {
  const getResponsiveColSpan = (sm: number, md: number, lg: number, xl: number) => {
    const classes = []

    // Small screen col-span
    const smColMap: Record<number, string> = {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      5: "col-span-5",
      6: "col-span-6",
      12: "col-span-12",
    }
    classes.push(smColMap[sm] || "col-span-1")

    // Medium screen col-span
    const mdColMap: Record<number, string> = {
      1: "md:col-span-1",
      2: "md:col-span-2",
      3: "md:col-span-3",
      4: "md:col-span-4",
      5: "md:col-span-5",
      6: "md:col-span-6",
      12: "md:col-span-12",
    }
    classes.push(mdColMap[md] || "md:col-span-1")

    // Large screen col-span
    const lgColMap: Record<number, string> = {
      1: "lg:col-span-1",
      2: "lg:col-span-2",
      3: "lg:col-span-3",
      4: "lg:col-span-4",
      5: "lg:col-span-5",
      6: "lg:col-span-6",
      12: "lg:col-span-12",
    }
    classes.push(lgColMap[lg] || "lg:col-span-1")

    // Large screen col-span
    const xlColMap: Record<number, string> = {
      1: "xl:col-span-1",
      2: "xl:col-span-2",
      3: "xl:col-span-3",
      4: "xl:col-span-4",
      5: "xl:col-span-5",
      6: "xl:col-span-6",
      12: "xl:col-span-12",
    }
    classes.push(xlColMap[xl] || "xl:col-span-1")

    return classes
  }

  const getResponsiveRowSpan = (sm: number, md: number, lg: number, xl: number) => {
    const classes = []

    // Small screen row-span
    const smRowMap: Record<number, string> = {
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
      4: "row-span-4",
      5: "row-span-5",
      6: "row-span-6",
    }
    classes.push(smRowMap[sm] || "row-span-1")

    // Medium screen row-span
    const mdRowMap: Record<number, string> = {
      1: "md:row-span-1",
      2: "md:row-span-2",
      3: "md:row-span-3",
      4: "md:row-span-4",
      5: "md:row-span-5",
      6: "md:row-span-6",
    }
    classes.push(mdRowMap[md] || "md:row-span-1")

    // Large screen row-span
    const lgRowMap: Record<number, string> = {
      1: "lg:row-span-1",
      2: "lg:row-span-2",
      3: "lg:row-span-3",
      4: "lg:row-span-4",
      5: "lg:row-span-5",
      6: "lg:row-span-6",
    }
    classes.push(lgRowMap[lg] || "lg:row-span-1")

    // Xl row-span
    const xlRowMap: Record<number, string> = {
      1: "xl:row-span-1",
      2: "xl:row-span-2",
      3: "xl:row-span-3",
      4: "xl:row-span-4",
      5: "xl:row-span-5",
      6: "xl:row-span-6",
    }
    classes.push(xlRowMap[xl] || "xl:row-span-1")

    return classes
  }

  return (
    <Card
      className={cn(
        ...getResponsiveColSpan(smColSpan, mdColSpan, lgColSpan, xlColSpan),
        ...getResponsiveRowSpan(smRowSpan, mdRowSpan, lgRowSpan, xlRowSpan),
        className,
      )}
    >
      {children}
    </Card>
  )
}

export function BentoGrid({
  children,
  cols = 4,
  smCols = 1,
  mdCols = 2,
  lgCols = cols,
  rows = 4,
  smRows = 1,
  mdRows = rows,
  lgRows = rows,
  className = "",
}: BentoGridProps) {
  const getResponsiveGridCols = (sm: number, md: number, lg: number) => {
    const classes = []

    // Small screen grid-cols
    const smGridMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    }
    classes.push(smGridMap[sm] || "grid-cols-1")

    // Medium screen grid-cols
    const mdGridMap: Record<number, string> = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
      12: "md:grid-cols-12",
    }
    classes.push(mdGridMap[md] || "md:grid-cols-2")

    // Large screen grid-cols
    const lgGridMap: Record<number, string> = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
      12: "lg:grid-cols-12",
    }
    classes.push(lgGridMap[lg] || "lg:grid-cols-4")

    return classes
  }

  const getResponsiveGridRows = (sm: number, md: number, lg: number) => {
    const classes = []

    // Small screen grid-rows
    const smGridMap: Record<number, string> = {
      1: "grid-rows-1",
      2: "grid-rows-2",
      3: "grid-rows-3",
      4: "grid-rows-4",
      5: "grid-rows-5",
      6: "grid-rows-6",
      12: "grid-rows-12",
    }
    classes.push(smGridMap[sm] || "grid-rows-1")

    // Medium screen grid-rows
    const mdGridMap: Record<number, string> = {
      1: "md:grid-row-1",
      2: "md:grid-row-2",
      3: "md:grid-row-3",
      4: "md:grid-row-4",
      5: "md:grid-row-5",
      6: "md:grid-row-6",
      12: "md:grid-row-12",
    }
    classes.push(mdGridMap[md] || "md:grid-rows-2")

    // Large screen grid-rows
    const lgGridMap: Record<number, string> = {
      1: "lg:grid-rows-1",
      2: "lg:grid-rows-2",
      3: "lg:grid-rows-3",
      4: "lg:grid-rows-4",
      5: "lg:grid-rows-5",
      6: "lg:grid-rows-6",
    }
    classes.push(lgGridMap[lg] || "lg:grid-rows-4")

    return classes
  }

  return (
    <article className={cn("grid gap-4", ...getResponsiveGridCols(smCols, mdCols, lgCols), getResponsiveGridRows(smRows, mdRows, lgRows), className)}>
      {children}
    </article>
  )
}