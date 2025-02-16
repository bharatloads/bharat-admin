import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, children, className }: StatsCardProps) {
  return (
    <Card className={cn("min-h-[300px]", className)}>
      <CardHeader>
        <CardTitle className='text-lg font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
