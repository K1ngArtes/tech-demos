import { ContactButton } from "@/components/contact-button";
import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function Closing() {
  return (
    <section
      id="contact"
      aria-labelledby="closing-heading"
      className="border-t border-border"
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_80%_at_50%_120%,oklch(1_0_0/0.07),transparent_62%)]" />
        <div className={`${shell} relative py-24 text-center sm:py-32`}>
          <h2
            id="closing-heading"
            className="mx-auto max-w-3xl text-balance text-4xl font-medium tracking-[-0.035em] text-foreground sm:text-6xl sm:leading-[1.05]"
          >
            {copy.closing.heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-8 text-muted-foreground">
            {copy.closing.body}
          </p>
          <div className="mt-10 flex justify-center">
            <ContactButton>{copy.contactCta}</ContactButton>
          </div>
        </div>
      </div>
    </section>
  );
}
