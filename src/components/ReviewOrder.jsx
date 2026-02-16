import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import Summary from "./Summary";
import Breadcrumb from "./Breadcrumb";
import { StoreContext } from "../StoreContext";

const ReviewOrder = () => {
  const { items } = useContext(StoreContext);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Current step is 2 for order review
  const currentStep = items.length > 0 ? 2 : 1;

  if (items.length === 0) {
    return (
      <div className="px-6 md:px-[138px] bg-slate-50 min-h-screen flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="my-12 text-center">
          <h3 className="font-medium text-3xl mb-4 dark:text-white">Keranjang Kosong</h3>
          <p className="italic mb-6 dark:text-gray-300">
            Silahkan pilih salah satu produk terlebih dahulu
          </p>
          <Link to="/" className="btn btn-accent">
            Pilih Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-[138px] bg-slate-50 min-h-screen pt-16 dark:bg-gray-900"> {/* Add top padding to account for fixed navbar */}
      <Breadcrumb />
      <section className="mb-16">
        <h3 className="font-medium text-3xl mb-6 dark:text-white">Review Pesanan</h3>
        <Summary />

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/" className="btn btn-ghost dark:text-white dark:border-gray-600">
            Kembali Berbelanja
          </Link>
          <Link
            to="/checkout"
            className="btn btn-accent flex-1"
          >
            Lanjut ke Info Pemesan
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ReviewOrder;