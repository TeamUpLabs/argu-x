import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

interface OpinionDistributionProps {
  prosCount: number;
  consCount: number;
}

const chartConfig: ChartConfig = {
  pros: {
    label: "찬성",
    color: "var(--chart-1)",
  },
  cons: {
    label: "반대",
    color: "var(--chart-2)",
  },
}

export default function OpinionDistribution({ prosCount, consCount }: OpinionDistributionProps) {
  const chartData = [
    { name: "찬성", pros: prosCount },
    { name: "반대", cons: consCount },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>토론 의견 분포</span>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">실시간</span>
          </Badge>
        </CardTitle>
        <CardDescription>토론 의견 분포를 확인하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => String(value).slice(0, 2)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => String(value).slice(0, 2)}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label, coordinate, accessibilityLayer }) => (
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={label}
                  coordinate={coordinate}
                  accessibilityLayer={accessibilityLayer}
                  hideLabel={true}
                />
              )}
            />
            <Bar dataKey="pros" radius={8} />
            <Bar dataKey="cons" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
