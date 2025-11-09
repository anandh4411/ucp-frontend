import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircleIcon, ArrowUpRightIcon } from "lucide-react";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts";

interface MonthlyBudgetProgressWidgetProps {
  totalBudget: number;
  totalSpent: number;
  period: "monthly" | "yearly";
  onViewDetails?: () => void;
}

export const MonthlyBudgetProgressWidget = ({
  totalBudget,
  totalSpent,
  period,
  onViewDetails,
}: MonthlyBudgetProgressWidgetProps) => {
  const spentPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Calculate remaining time based on period
  const today = new Date();
  const remainingInfo =
    period === "monthly"
      ? {
          days:
            new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() -
            today.getDate(),
          label: "days left",
        }
      : {
          days: Math.ceil(
            (new Date(today.getFullYear(), 11, 31).getTime() -
              today.getTime()) /
              (1000 * 60 * 60 * 24)
          ),
          label: "days left this year",
        };

  // Dynamic title based on period
  const title = period === "monthly" ? "Monthly budget" : "Yearly budget";

  // Simple single dataset - just the progress
  const chartData = [
    {
      name: "budget",
      spent: spentPercentage,
    },
  ];

  const chartConfig = {
    spent: {
      label: "Spent",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  const getStatusInfo = () => {
    if (spentPercentage <= 75) {
      return {
        status: "On track",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        icon: <CheckCircleIcon className="h-3 w-3" />,
      };
    } else if (spentPercentage <= 90) {
      return {
        status: "Near limit",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
        icon: <CheckCircleIcon className="h-3 w-3" />,
      };
    } else {
      return {
        status: "Over budget",
        color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
        icon: <CheckCircleIcon className="h-3 w-3" />,
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="border border-border bg-background shadow-none rounded-xl hover:bg-foreground/2 transition-bg duration-200 p-0">
      <CardHeader className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-[700] text-foreground">
            {title}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="h-8 w-8 p-0 hover:bg-primary/10 rounded-full"
          >
            <ArrowUpRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-5">
        <div className="space-y-4">
          {/* Budget Amount, Status and Remaining Info */}
          <div className="flex items-start justify-between">
            {/* Left side - Budget and Status */}
            <div className="space-y-3">
              <div className="text-3xl font-[700] text-foreground">
                ${totalBudget.toLocaleString()}.00
              </div>
              <Badge
                className={`${statusInfo.color} flex items-center w-fit space-x-1`}
              >
                {statusInfo.icon}
                <span>{statusInfo.status}</span>
              </Badge>
            </div>

            {/* Right side - Remaining Info */}
            <div className="text-right space-y-3">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {remainingInfo.days} {remainingInfo.label}
                </div>
                <div className="text-lg font-[600] text-foreground">
                  ${(totalBudget - totalSpent).toLocaleString()}.00
                </div>
                <div className="text-xs text-muted-foreground">remaining</div>
              </div>
            </div>
          </div>

          {/* Simple Speedometer Chart */}
          <div className="relative">
            {/* Background track - full semicircle */}
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full max-w-[300px] h-[200px] absolute inset-0"
            >
              <RadialBarChart
                data={[{ name: "background", value: 100 }]}
                cx="50%"
                cy="75%"
                innerRadius={120}
                outerRadius={145}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={8}
                  fill="var(--muted)"
                  className="stroke-transparent"
                  isAnimationActive={false}
                />
              </RadialBarChart>
            </ChartContainer>

            {/* Progress chart - on top */}
            <ChartContainer
              config={chartConfig}
              className="mx-auto w-full max-w-[300px] h-[200px] relative z-10"
            >
              <RadialBarChart
                data={chartData}
                cx="50%"
                cy="75%"
                innerRadius={120}
                outerRadius={170}
                startAngle={180}
                endAngle={180 - (spentPercentage / 100) * 180}
              >
                <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 40}
                              className="fill-muted-foreground text-xs"
                            >
                              {spentPercentage.toFixed(0)}% spent
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 10}
                              className="fill-foreground text-xl font-bold"
                            >
                              ${totalSpent.toLocaleString()}.00
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </PolarRadiusAxis>

                <RadialBar
                  dataKey="spent"
                  cornerRadius={8}
                  fill="var(--primary)"
                  className="stroke-transparent"
                  animationDuration={800}
                />
              </RadialBarChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
