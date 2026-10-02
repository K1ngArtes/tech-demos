import { ContactButton } from "@/components/contact-button";
import { copy } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className={`${shell} flex h-16 items-center justify-between gap-4`}
      >
        <a
          href="#top"
          className="text-[15px] font-medium tracking-[-0.03em] text-foreground"
        >
          {copy.brand}
        </a>
        <ContactButton className="h-11 px-3.5 text-sm sm:h-10">
          {copy.contactCta}
        </ContactButton>
      </nav>
    </header>
  );
}
