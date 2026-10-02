import { Audience } from "@/components/audience";
import { Closing } from "@/components/closing";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Problem } from "@/components/problem";
import { Product } from "@/components/product";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function App() {
  return (
    <div id="top" className="flex min-h-full flex-col">
      <SiteHeader />
      <main id="content" className="flex-1">
        <Hero />
        <Problem />
        <Product />
        <HowItWorks />
        <Audience />
        <Closing />
      </main>
      <SiteFooter />
    </div>
  );
}
