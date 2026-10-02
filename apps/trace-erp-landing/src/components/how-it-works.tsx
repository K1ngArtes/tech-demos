import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function HowItWorks() {
  return (
    <section
      id="how"
      aria-labelledby="how-heading"
      className="border-t border-border"
    >
      <div className={`${shell} py-20 sm:py-28`}>
        <p className="text-sm text-muted-foreground">{copy.how.label}</p>
        <h2
          id="how-heading"
          className="mt-3 max-w-3xl text-balance text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl sm:leading-[1.12]"
        >
          {copy.how.heading}
        </h2>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:mt-14 lg:grid-cols-3">
          {copy.how.steps.map((step, index) => (
            <li key={step} className="flex flex-col bg-background px-5 py-6 sm:px-6 sm:py-8">
              <span className="font-mono text-sm text-muted-foreground">{index + 1}</span>
              <p className="mt-8 text-pretty text-lg leading-snug tracking-[-0.015em] text-foreground">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
