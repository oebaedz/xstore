import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../StoreContext";
import Summary from "./Summary";
import empty from "../assets/empty-cart.png";

const CartBody = () => {
  const { items, scrollCheckout } = useContext(StoreContext);
  const navigate = useNavigate();

  const cart = true;
  const totItems = items.reduce((qty, item) => qty + item.qty, 0);
  const total = items.reduce((price, item) => price + item.qty * item.price, 0);

  const handleCheckout = () => {
    // Scroll to checkout section on the main page or navigate to review page
    if (typeof scrollCheckout === 'function' && window.location.pathname === '/') {
      scrollCheckout();
    } else {
      // Navigate to review page if not on main page
      navigate('/review');
    }
  };

  return !items.length ? (
    <div className="dark:bg-gray-800">
      <p className="font-bold text-sm pt-3 text-center dark:text-white">Keranjang Anda kosong</p>
      <div className="py-10 flex justify-center">
        <img src={empty} alt="empty" />
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-[70vh] max-h-[500px] dark:bg-gray-800">
      <p className="font-bold text-lg text-center pt-3 dark:text-white">Keranjang Anda</p>
      <p className="font-light text-sm text-center pb-2 dark:text-gray-300">{totItems} barang ditambahkan</p>
      <hr className="dark:border-gray-600" />
      <div className="overflow-y-auto flex-grow">
        <Summary cart={cart} />
      </div>
      <div className="mt-4 px-3">
        <p className="text-right font-medium dark:text-white">Total: Rp {Number(total).toLocaleString()}</p>
      </div>
      <div className="flex justify-center mt-2 px-3 pb-3">
        <button
          onClick={handleCheckout}
          className="btn btn-accent w-full hover:bg-accent-focus"
        >
          <span>Lanjutkan ke Checkout</span>
        </button>
      </div>
    </div>
  );
};

export default CartBody;
