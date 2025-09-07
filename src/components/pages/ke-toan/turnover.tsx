import { Area, AreaChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { NumericFormat } from 'react-number-format'
import { useStore } from '@tanstack/react-store'
import type { TitleProps } from '@/types/ui/dashboard'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardContent as BentoContent, CardHeader as BentoHeader, CardPrice as BentoPrice, CardTitle as BentoTitle } from '@/components/ui/card'
import { chartConfig, headColorConfig } from '@/data/dashboard'
import { dashboardData, dashboardState, dashboardStrategy } from '@/store/dashboard-store'
import { calculateChangePercent, cn } from '@/lib/utils'

const TurnoverTitle = ({title, amount, previousAmount} : TitleProps) => (
  <div>
    <BentoTitle>{title}</BentoTitle>
    <BentoPrice>
      <h3 className={cn(headColorConfig[title])}>
        <NumericFormat
          value={amount}
          displayType="text"
          thousandSeparator="."
          decimalSeparator=","
          suffix="đ"
        />
        <span className='pl-1.5 text-paragraph-smaller text-emerald-600'>
          +{calculateChangePercent(amount, previousAmount)}%
        </span>
      </h3>
    </BentoPrice>
  </div>
)


export function TurnoverHeader() {
  const timeRange = useStore(dashboardState, (state) => state.timeRange)
  const timeRangeChange = useStore(dashboardStrategy, (state) => state.timeRangeChange)
  const { currentAmount, previousAmount } = useStore(dashboardData, (state) => state.donateData)

    return (
        <BentoHeader className='overflow-x-auto md:overflow-x-visible webkit_scroll_hidden'>
          <div className='flex flex-row gap-20 w-fit'>
            <TurnoverTitle title='Doanh Thu' amount={currentAmount} previousAmount={previousAmount} />
            <TurnoverTitle title='Cửa Hàng' amount={0} previousAmount={0} />
            <TurnoverTitle title='Ủng Hộ' amount={currentAmount} previousAmount={previousAmount} />
          </div>
          <Select 
            value={timeRange}
            onValueChange={timeRangeChange}
          >
            <SelectTrigger
              className="w-[160px] rounded-lg ml-auto flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="1 tuần" />
            </SelectTrigger>
            <SelectContent className="rounded-xl *:rounded-lg">
              <SelectItem value="7d">Tuần</SelectItem>
              <SelectItem value="30d">Tháng</SelectItem>
              <SelectItem value="90d">3 Tháng</SelectItem>
              <SelectItem value="180d">6 Tháng</SelectItem>
              <SelectItem value="360d">Năm</SelectItem>
            </SelectContent>
          </Select>
        </BentoHeader>
    )
}

export function TurnoverContent() {
  const chartData = useStore(dashboardData, (state) => state.chartData)
 
  return (
    <BentoContent>
      <ChartContainer config={chartConfig} className='aspect-auto h-[80vmin] sm:h-[47vmin] w-full'>
        <AreaChart
          accessibilityLayer 
          data={chartData}
          margin={{
            top: 16,
            left: 16
          }}
        >
          <defs>
            <linearGradient id="fillShop" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-1)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-1)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillDonate" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-2)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-2)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={true}
            minTickGap={32}
            tickMargin={8}
          />
          <Area
            dataKey="donateAmount"
            type="monotone"
            fill="url(#fillDonate)"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={false}
          />
          <ChartTooltip cursor={false} defaultIndex={1} content={<ChartTooltipContent indicator="line" />} />
        </AreaChart>
      </ChartContainer>
    </BentoContent>
  )
}