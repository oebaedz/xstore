import data_product from "../assets/data";
import Card from "./Card";
import OrdererInfo from "./OrdererInfo";
import Summary from "./Summary";
import Hero from "./Hero";
import CheckoutProgress from "./CheckoutProgress";
import { useContext, useRef } from "react";
import { StoreContext } from "../StoreContext";

const Contain = () => {
  const { items, checkoutRef, listRef } = useContext(StoreContext);
  const listSect = useRef(null)

  // Determine current step based on cart state
  // Step 1: No items in cart (Pilih Produk)
  // Step 2: Items in cart - showing both Review Pesanan and Info Pemesan sections
  const currentStep = items.length > 0 ? 2 : 1;

  return (
    <div className="px-6 md:px-[138px] bg-slate-50">
      <Hero />
      <CheckoutProgress currentStep={currentStep} />

      <section ref={listRef} className="flex flex-col gap-4 my-10">
        <h3 className="font-medium text-3xl mb-6">Daftar Foto</h3>
        <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-8">
          {data_product.map((product) => {
            return (
              <div key={product.id}>
                <Card product={product} />
              </div>
            );
          })}
        </div>
      </section>

      <section ref={checkoutRef} >
        {items.length ? (
          <>
            <div className="my-12">
              <h3 className="font-medium text-3xl mb-4 ">Review Pesanan</h3>
              <Summary />
            </div>
          </>
        ) : (
          <div className="my-12">
            <h3 className="font-medium text-3xl mb-4">Review Pesanan</h3>
            <p className="italic">
              Silahkan pilih salah satu produk terlebih dahulu
            </p>
          </div>
        )}
      </section>

      <OrdererInfo />
    </div>
  );
};

export default Contain;
