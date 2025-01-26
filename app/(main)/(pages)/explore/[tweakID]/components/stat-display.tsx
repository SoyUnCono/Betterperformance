import { Tweak } from "@prisma/client";

interface StatDisplayProps {
  icon: React.ElementType;
  value: number;
  label: string;
}

export default function StatDisplay({
  icon: Icon,
  value,
  label,
}: StatDisplayProps) {
  return (
    <div
      className="flex items-center"
      title={`${value.toLocaleString()} ${label}`}
    >
      <Icon className="w-4 h-4 mr-1 text-muted-foreground" />
      <span className="text-sm">
        <span className="font-bold">{value.toLocaleString()}</span>
        <span className="sr-only md:not-sr-only md:ml-1">{label}</span>
      </span>
    </div>
  );
}
