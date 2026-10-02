import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function Audience() {
  return (
    <section
      id="who"
      aria-labelledby="who-heading"
      className="border-t border-border"
    >
      <div className={`${shell} py-20 sm:py-28`}>
        <p className="text-sm text-muted-foreground">{copy.audience.label}</p>
        <h2
          id="who-heading"
          className="mt-3 max-w-3xl text-balance text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl sm:leading-[1.12]"
        >
          {copy.audience.heading}
        </h2>
        <ul className="mt-12 divide-y divide-border border-y border-border sm:mt-14">
          {copy.audience.points.map((point) => (
            <li
              key={point}
              className="py-6 text-pretty text-lg leading-snug tracking-[-0.015em] text-foreground sm:py-7 sm:text-xl"
            >
              {point}
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-pretty text-base leading-7 text-muted-foreground">
          {copy.audience.note}
        </p>
      </div>
    </section>
  );
}
