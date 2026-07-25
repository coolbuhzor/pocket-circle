"use client";

import { getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface RotationMember {
  id: string;
  name: string;
}

interface RotationCircleProps {
  members: RotationMember[];
  collectorId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: 120, avatar: 32, font: "text-[10px]" },
  md: { box: 180, avatar: 44, font: "text-xs" },
  lg: { box: 240, avatar: 56, font: "text-sm" },
};

export function RotationCircle({
  members,
  collectorId,
  size = "md",
  className,
}: RotationCircleProps) {
  const { box, avatar, font } = sizeMap[size];
  const radius = box / 2 - avatar / 2 - 4;
  const center = box / 2;

  if (members.length === 0) return null;

  return (
    <div
      className={cn("relative mx-auto", className)}
      style={{ width: box, height: box }}
      role="img"
      aria-label={`Rotation circle. Current collector highlighted.`}
    >
      <div
        className="absolute inset-4 rounded-full border-2 border-dashed border-primary-light/50"
        aria-hidden
      />
      {members.map((member, index) => {
        const angle =
          (index / members.length) * 2 * Math.PI - Math.PI / 2;
        const x = center + radius * Math.cos(angle) - avatar / 2;
        const y = center + radius * Math.sin(angle) - avatar / 2;
        const isCollector = member.id === collectorId;

        return (
          <div
            key={member.id}
            className={cn(
              "absolute flex items-center justify-center rounded-full font-semibold text-white shadow-sm transition-transform",
              font,
              isCollector
                ? "bg-accent ring-4 ring-accent/30 scale-110"
                : "bg-primary-light text-primary",
            )}
            style={{
              width: avatar,
              height: avatar,
              left: x,
              top: y,
            }}
            title={
              isCollector
                ? `${member.name} (whose turn)`
                : member.name
            }
          >
            {getInitials(member.name)}
          </div>
        );
      })}
    </div>
  );
}
