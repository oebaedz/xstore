import { useContext, useEffect, useState, useMemo } from "react";
import { StoreContext } from "../StoreContext";
import supabase from "./createClient";
import NewHero from "./NewHero";
import ProductCard from "./newcomps/ProductCard";
import CartSidebar from "./newcomps/CartSidebar";
import CheckoutModal from "./newcomps/CheckoutModal";
import pic from "../assets/catalog.jpg";

const Home = () => {
  const { items, setItems, isCartOpen, setIsCartOpen } = useContext(StoreContext);
  const [dataProducts, setDataProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Semua');
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

  const banners = [
    pic,
    "https://kaos-halalbihalal10.vercel.app/assets/Cat-3R5N9Oct.jpeg",
    pic,
  ];

  const categories = useMemo(() => {
    const cats = new Set(dataProducts.map(p => p.category));
    return ['Semua', ...cats];
  }, [dataProducts]);
  
  const filteredProducts = useMemo(() => {
    if (filterStatus === 'Semua') return dataProducts; // Tampilkan semua produk jika filter 'semua' dipilih
    return dataProducts.filter((product) => 
      product.category.toLowerCase() === filterStatus.toLowerCase()
    );
  }, [dataProducts, filterStatus]);

  return (
    <>{loading ? (
      <div className="flex items-center bg-primary justify-center h-screen">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
      </div>
    ) : (
      <div className="min-h-screen">
        <div className="flex flex-col h-[100svh] md:h-auto overflow-hidden">
          <NewHero banners={banners} />
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

            {/* Horizontal Filter */}
            <div className="flex mb-4 gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
              {categories.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={`px-5 md:px-8 py-2 transition-all duration-300 ease-out rounded-full text-xs md:text-lg tracking-wider font-semibold whitespace-nowrap capitalize transition-all snap-start duration-300 border ${
                    filterStatus === f
                      ? 'bg-gradient-to-r ml-1 from-emerald-600 to-green-500 text-white shadow-lg scale-105 border-transparent'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400 hover:text-emerald-600'
                  }`}
                  
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-10">
              {filteredProducts.map((data) => {
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

        <CartSidebar 
          items={items} 
          setItems={setItems} 
          onClose={() => setIsCartOpen(!isCartOpen)} 
          isOpen={isCartOpen} 
          onCheckout={() => setIsCheckoutOpen(true)}
        />
        
        <CheckoutModal 
          isOpen={isCheckoutOpen} 
          onClose={() => setIsCheckoutOpen(false)} 
          items={items} 
          setItems={setItems} 
        />

      </div>
    )}
    </>
  );
};

export default Home;