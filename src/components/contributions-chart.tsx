'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

export type ChartData = {
    month: string;
    contributions: number;
}

interface ContributionsChartProps {
    data: ChartData[];
}

const chartConfig = {
    contributions: {
        label: "Contributions",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export function ContributionsChart({ data }: ContributionsChartProps) {
    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value: string) => value.slice(0, 3)}
                    />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="contributions" fill="var(--color-contributions)" radius={4} />
                </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}
