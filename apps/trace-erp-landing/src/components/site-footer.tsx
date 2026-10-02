import { copy, mailto } from "@/lib/copy";
import { shell } from "@/lib/styles";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div
        className={`${shell} flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between`}
      >
        <p className="text-sm text-muted-foreground">{copy.footer}</p>
        <a
          href={mailto}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          {copy.email}
        </a>
      </div>
    </footer>
  );
}
