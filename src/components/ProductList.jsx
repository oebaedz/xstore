import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../StoreContext";
import supabase from "./createClient";
import NewHero from "./NewHero";
import ProductCard from "./newcomps/ProductCard";
import CartSidebar from "./newcomps/CartSidebar";

const ProductList = () => {
  const { items, setItems, isCartOpen, setIsCartOpen } = useContext(StoreContext);
  const [dataProducts, setDataProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchAdminData = async () => {
      setLoading(true);
      // Kita ambil data secara paralel agar cepat
      const [prodRes] = await Promise.all([
        supabase.from('products').select('*').order('name', { ascending: false }),
      ]);
  
      setDataProducts(prodRes.data || []);
      setLoading(false);
    };
  
  useEffect(() => {
    fetchAdminData();
  }, []);
  
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
                  <ProductCard product={data} setIsCartOpen={setIsCartOpen} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CartSidebar items={items} setItems={setItems} onClose={() => setIsCartOpen(!isCartOpen)} isOpen={isCartOpen} />

      {/* {items.length > 0 && (
        <div className="flex justify-center my-12">
          <Link
            to="/review"
            className="btn btn-accent btn-lg dark:text-white"
          >
            Review Pesanan ({items.length} {items.length === 1 ? 'item' : 'items'})
          </Link>
        </div>
      )} */}
    </div>
  );
};

export default ProductList;