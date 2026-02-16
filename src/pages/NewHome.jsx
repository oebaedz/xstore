import ProductCard from "../components/newcomps/ProductCard";
import Countdown from "../components/newcomps/Countdown";
import NewHero from "../components/NewHero";

export default function NewHome() {
  return (
    <div className="bg-primary py-20">
      <NewHero />
      <Countdown />

      <div className="mt-20 px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 bg-muted py-20">
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>
    </div>
  );
}