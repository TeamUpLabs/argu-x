import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


interface ParticipationData {
  date: string;
  pros: number;
  cons: number;
}

interface ParticipationTrendProps {
  participationData: ParticipationData[];
}

const chartConfig: ChartConfig = {
  pros: {
    label: "찬성 의견",
    color: "var(--chart-1)",
  },
  cons: {
    label: "반대 의견",
    color: "var(--chart-2)",
  },
};

export default function ParticipationTrend({ participationData }: ParticipationTrendProps) {
  const cumulativeData = useMemo(() => {
    const sortedData = participationData.toSorted((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const result: ParticipationData[] = [];

    for (const [index, current] of sortedData.entries()) {
      if (index === 0) {
        result.push({ ...current });
      } else {
        const previous = result[index - 1];
        result.push({
          date: current.date,
          pros: previous.pros + current.pros,
          cons: previous.cons + current.cons,
        });
      }
    }

    return result;
  }, [participationData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>토론 참여 추이</span>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">실시간</span>
          </Badge>
        </CardTitle>
        <CardDescription>플랫폼 활성도를 실시간으로 확인하세요</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6">
        <ChartContainer config={chartConfig}>
          <LineChart data={cumulativeData}>
            <defs>
              <linearGradient id="fillPros" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-pros)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-pros)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillCons" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-cons)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-cons)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("ko-KR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: 'hsl(var(--muted-foreground))',
                fontWeight: 500
              }}
              interval={1}
              dx={-5}
              width={35}
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
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              )}
            />
            <Line
              dataKey="cons"
              type="linear"
              fill="url(#fillCons)"
              stroke="var(--color-cons)"
              isAnimationActive={false}
            />
            <Line
              dataKey="pros"
              type="linear"
              fill="url(#fillPros)"
              stroke="var(--color-pros)"
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}