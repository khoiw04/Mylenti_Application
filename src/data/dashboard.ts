import type { ChartConfig } from "@/components/ui/chart"

const headColorConfig = {
  'Doanh Thu': '',
  'Ủng Hộ': "text-[var(--chart-1)]",
  'Cửa Hàng': "text-[var(--chart-2)]",
} as const

const chartConfig = {
  donateAmount: {
    label: "Donate",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

type Payment = {
  'id': string
  'Email': string
  'Hàng': string
  'Số Lượng': string
  'Địa Chỉ': string
}

export { chartConfig, headColorConfig, type Payment }