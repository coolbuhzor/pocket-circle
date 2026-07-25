import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { cn, formatNaira } from "@/lib/utils";

interface GroupPageHeaderProps {
  breadcrumb: BreadcrumbItem[];
  name: string;
  contributionAmount: number;
  frequency: string;
  titleAs?: "h1" | "h2";
  className?: string;
}

export function GroupPageHeader({
  breadcrumb,
  name,
  contributionAmount,
  frequency,
  titleAs = "h1",
  className,
}: GroupPageHeaderProps) {
  const Title = titleAs;

  return (
    <div className={cn(className)}>
      <Breadcrumb items={breadcrumb} />
      <Title
        className={cn(
          "mt-1 font-display font-semibold text-text",
          titleAs === "h1" ? "text-3xl" : "text-2xl",
        )}
      >
        {name}
      </Title>
      <p className="mt-1 font-mono text-sm text-text-muted">
        {formatNaira(contributionAmount)} · {frequency}
      </p>
    </div>
  );
}
