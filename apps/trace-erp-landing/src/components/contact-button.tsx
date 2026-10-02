import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { mailto } from "@/lib/copy";
import { cn } from "@/lib/utils";

type ContactButtonProps = {
  children: ReactNode;
  variant?: "default" | "outline";
  className?: string;
};

export function ContactButton({
  children,
  variant = "default",
  className,
}: ContactButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      className={cn(
        "h-11 cursor-pointer rounded-md px-5 text-[15px] font-medium",
        className,
      )}
    >
      <a href={mailto}>{children}</a>
    </Button>
  );
}
