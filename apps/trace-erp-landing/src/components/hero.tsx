import { ContactButton } from "@/components/contact-button";
import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <div className="hero-atmosphere pointer-events-none absolute inset-0" />
      <div className={`${shell} relative pb-20 pt-16 sm:pb-28 sm:pt-24 lg:pb-32 lg:pt-28`}>
        <p className="inline-flex w-fit items-center rounded-full border border-border px-3 py-1 text-[13px] leading-5 text-muted-foreground">
          {copy.hero.eyebrow}
        </p>
        <h1
          id="hero-heading"
          className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6.2vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-foreground"
        >
          {copy.hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
          {copy.hero.subhead}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <ContactButton className="w-full sm:w-auto">{copy.contactCta}</ContactButton>
          <ContactButton variant="outline" className="w-full sm:w-auto">
            {copy.foundersCta}
          </ContactButton>
        </div>
        <a
          href="#product"
          className="group mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <span>{copy.product.heading}</span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden="true"
            className="size-4 transition-transform group-hover:translate-y-0.5 motion-reduce:transition-none"
            fill="none"
          >
            <path
              d="M8 3v10M4 9l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
