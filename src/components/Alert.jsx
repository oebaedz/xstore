import { useContext } from "react";
import { StoreContext } from "../StoreContext";
import { Link } from "react-router-dom";

const Alert = () => {
  const { scrollCheckout } = useContext(StoreContext);

  return (
    <div className="toast toast-center z-40">
      <div className="hidden md:block">
        <div role="alert" className="alert bg-cyan-100 shadow-lg dark:bg-cyan-900/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-info shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <div className="dark:text-white">
            <h3 className="font-bold dark:text-white">Produk ditambahkan!</h3>
            <div className="text-sm dark:text-gray-200">Lanjut Check Out?</div>
          </div>
          <button onClick={scrollCheckout} className="btn px-5 btn-accent btn-sm dark:text-white dark:bg-accent/80 dark:hover:bg-accent">
            Ya
          </button>
        </div>
      </div>
      <div className="block md:hidden">
        <div className="flex w-full gap-8 px-6 mb-3 py-3 border rounded-2xl bg-cyan-100 items-center dark:bg-cyan-900/50 dark:text-white">
          <h3 className="font-medium dark:text-white">Lanjut check out?</h3>
          <Link to="/review" className="btn px-5 btn-accent btn-sm dark:text-white dark:bg-accent/80 dark:hover:bg-accent">
            Ya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Alert;
