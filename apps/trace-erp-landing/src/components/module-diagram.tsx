import { copy } from "@/lib/copy";

export function ModuleDiagram() {
  const { points, modules } = copy.product;

  return (
    <figure className="m-0">
      <div className="rounded-xl border border-border bg-card/60 p-4 sm:p-5">
        <div className="relative rounded-lg border border-foreground/20 bg-foreground/[0.04] px-4 py-4 shadow-[inset_0_1px_0_0_oklch(1_0_0/0.14)]">
          <p className="text-[15px] font-medium leading-snug tracking-[-0.015em]">
            {points[0]}
          </p>
        </div>
        <div aria-hidden="true" className="flex flex-col items-center py-1">
          <div className="h-5 w-px bg-foreground/25" />
          <div className="h-px w-[calc(100%-1.5rem)] bg-foreground/25" />
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {modules.map((name) => (
            <li
              key={name}
              className="flex min-h-14 items-center justify-center rounded-lg border border-border bg-background/40 px-3 py-3 text-center text-sm text-muted-foreground"
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
