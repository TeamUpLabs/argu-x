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
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart data={participationData}>
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
              type="natural"
              fill="url(#fillCons)"
              stroke="var(--color-cons)"
              isAnimationActive={false}
            />
            <Line
              dataKey="pros"
              type="natural"
              fill="url(#fillPros)"
              stroke="var(--color-pros)"
              isAnimationActive={false}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
    // <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 lg:p-8 border border-border transition-all duration-500 group">
    //   <div className="relative">
    //     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
    //       <div>
    //         <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-1 sm:mb-2">
    //           토론 참여 추이
    //         </h3>
    //         <p className="text-xs sm:text-sm text-slate-500 font-medium">
    //           플랫폼 활성도를 실시간으로 확인하세요
    //         </p>
    //       </div>
    //       <Badge variant="secondary" className="flex items-center gap-2">
    //         <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
    //         <span className="text-muted-foreground">실시간</span>
    //       </Badge>
    //     </div>

    //     <div className="relative">
    //       <ChartContainer config={chartConfig} className="w-full h-[280px] sm:h-[320px]">
    //         <LineChart
    //           data={participationData}
    //           margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
    //           accessibilityLayer={true}
    //         >

    //           <CartesianGrid
    //             strokeDasharray="2 4"
    //             stroke="#e2e8f0"
    //             strokeOpacity={0.4}
    //             horizontal={true}
    //             vertical={false}
    //           />

    //           <XAxis
    //             dataKey="date"
    //             axisLine={false}
    //             tickLine={false}
    //             tick={{
    //               fontSize: window.innerWidth < 640 ? 10 : 12,
    //               fill: '#64748b',
    //               fontWeight: 500
    //             }}
    //             dy={10}
    //             interval="preserveStartEnd"
    //           />

    //           <YAxis
    //             axisLine={false}
    //             tickLine={false}
    //             tick={{
    //               fontSize: window.innerWidth < 640 ? 10 : 12,
    //               fill: '#64748b',
    //               fontWeight: 500
    //             }}
    //             dx={-5}
    //             width={30}
    //           />

    //           <ChartTooltip
    //             content={({ active, payload, label }) => {
    //               if (active && payload && payload.length > 0) {
    //                 return (
    //                   <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
    //                     <p className="font-medium">{label}</p>
    //                     {payload.map((entry, index) => (
    //                       <p key={index} style={{ color: entry.color }}>
    //                         {entry.name}: {entry.value}명
    //                       </p>
    //                     ))}
    //                   </div>
    //                 );
    //               }
    //               return null;
    //             }}
    //           />

    //           <ChartLegend />

    //           <Line
    //             type="monotone"
    //             dataKey="찬성"
    //             stroke="var(--color-찬성)"
    //             strokeWidth={window.innerWidth < 640 ? 2 : 3}
    //             dot={{
    //               fill: '#22c55e',
    //               strokeWidth: 2,
    //               stroke: '#ffffff',
    //               r: window.innerWidth < 640 ? 3 : 4
    //             }}
    //             activeDot={{
    //               r: window.innerWidth < 640 ? 5 : 6,
    //               stroke: '#22c55e',
    //               strokeWidth: 2,
    //               fill: '#ffffff'
    //             }}
    //             name="찬성 의견"
    //             isAnimationActive={false}
    //           />

    //           <Line
    //             type="monotone"
    //             dataKey="반대"
    //             stroke="var(--color-반대)"
    //             strokeWidth={window.innerWidth < 640 ? 2 : 3}
    //             dot={{
    //               fill: '#f59e0b',
    //               strokeWidth: 2,
    //               stroke: '#ffffff',
    //               r: window.innerWidth < 640 ? 3 : 4
    //             }}
    //             activeDot={{
    //               r: window.innerWidth < 640 ? 5 : 6,
    //               stroke: '#f59e0b',
    //               strokeWidth: 2,
    //               fill: '#ffffff'
    //             }}
    //             name="반대 의견"
    //             isAnimationActive={false}
    //           />
    //         </LineChart>
    //       </ChartContainer>
    //     </div>
    //   </div>
    // </div>
  );
}