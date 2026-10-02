import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function Problem() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="border-t border-border"
    >
      <div className={`${shell} grid gap-8 py-20 sm:py-28 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-5">
          <p className="text-sm text-muted-foreground">{copy.problem.label}</p>
          <h2
            id="problem-heading"
            className="mt-3 text-balance text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl sm:leading-[1.12]"
          >
            {copy.problem.heading}
          </h2>
        </div>
        <div className="lg:col-span-7">
          <p className="text-pretty text-lg leading-8 text-muted-foreground">
            {copy.problem.body}
          </p>
          <p className="mt-8 border-l border-foreground/35 pl-5 text-pretty text-xl font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-2xl">
            {copy.problem.emphasis}
          </p>
        </div>
      </div>
    </section>
  );
}
