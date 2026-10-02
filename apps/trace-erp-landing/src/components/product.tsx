import { ModuleDiagram } from "@/components/module-diagram";
import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function Product() {
  return (
    <section
      id="product"
      aria-labelledby="product-heading"
      className="border-t border-border"
    >
      <div className={`${shell} py-20 sm:py-28`}>
        <p className="text-sm text-muted-foreground">{copy.product.label}</p>
        <h2
          id="product-heading"
          className="mt-3 max-w-3xl text-balance text-3xl font-medium tracking-[-0.03em] text-foreground sm:text-4xl sm:leading-[1.12]"
        >
          {copy.product.heading}
        </h2>
        <p className="mt-8 max-w-3xl text-pretty text-lg leading-8 text-muted-foreground sm:mt-10">
          {copy.product.intro}
        </p>
        <div className="mt-14 sm:mt-16">
          <h3 className="text-base font-medium tracking-[-0.01em] text-foreground">
            {copy.product.toward}
          </h3>
          <ul className="mt-5 grid gap-3 lg:grid-cols-3">
            <li className="lg:col-span-3">
              <ModuleDiagram />
            </li>
            {copy.product.points.slice(1).map((point) => (
              <li
                key={point}
                className="rounded-xl border border-border bg-card px-5 py-5 text-[15px] leading-6 tracking-[-0.011em] text-foreground sm:text-base sm:leading-7"
              >
                {point}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-pretty text-base leading-7 text-muted-foreground">
            {copy.product.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}
