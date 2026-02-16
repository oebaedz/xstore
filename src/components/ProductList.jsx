import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import data_product from "../assets/data";
import GroupedCard from "./GroupedCard";  // New component
import { StoreContext } from "../StoreContext";
import supabase from "./createClient";
import NewHero from "./NewHero";
import ProductCard from "./newcomps/ProductCard";

// Function to group products by their main category (the numbered part with name)
function groupProductsByCategory(products) {
  const grouped = {};

  products.forEach(product => {
    // Extract the main category (number + main name), e.g. "02 Dua Kiai", "03 Semua Masyayikh"
    const nameParts = product.name.split(' - ');
    const baseName = nameParts[0];

    if (!grouped[baseName]) {
      grouped[baseName] = {
        id: baseName, // Use base name as ID
        name: baseName,
        image: product.image, // Use the first image as the main image
        desc: product.desc,
        variants: []
      };
    }

    // Add variant information
    const variantInfo = {
      id: product.id,
      name: product.name,
      image: product.image,
      desc: product.desc,
      subt: product.subt,
      price: product.price
    };

    grouped[baseName].variants.push(variantInfo);
  });

  // Convert to array and sort by the number at the beginning of the name
  const result = Object.values(grouped).sort((a, b) => {
    const numA = parseInt(a.name.split(' ')[0]);
    const numB = parseInt(b.name.split(' ')[0]);
    return numA - numB;
  });

  return result;
}

const groupedData = groupProductsByCategory(data_product);


const { data: dataProducts } = await supabase 
.from('products')
.select('*');

// useEffect(() => {
//   console.log('Data:', dataProducts);
// }, []);

const ProductList = () => {
  const { items } = useContext(StoreContext);
  

  // Current step is always 1 for product list
  const currentStep = 1;

  return (
    <div className="min-h-screen">
      <div className="flex flex-col h-[100svh] md:h-auto overflow-hidden">
        <NewHero />
        {/* <Countdown /> */}
        {/* <Hero /> */}
      </div>

      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <p className="text-accent-green text-sm tracking-[0.4em] uppercase mb-3 font-semibold">Koleksi Terbatas</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6">Merchandise Premium</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-px bg-gold"></div>
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" />
              </svg>
              <div className="w-16 h-px bg-gold"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-10">
            {dataProducts.map((data) => {
              return (
                <div key={data.id}>
                  {/* <GroupedCard productGroup={productGroup} /> */}
                  <ProductCard product={data} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {items.length > 0 && (
        <div className="flex justify-center my-12">
          <Link
            to="/review"
            className="btn btn-accent btn-lg dark:text-white"
          >
            Review Pesanan ({items.length} {items.length === 1 ? 'item' : 'items'})
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductList;