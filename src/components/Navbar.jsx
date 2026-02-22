import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../StoreContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { items, isCartOpen, setIsCartOpen } = useContext(StoreContext);
  const totItems = items.reduce((qty, item) => qty + item.qty, 0);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-10 py-5 ${
      isScrolled 
        ? 'bg-primary/95 backdrop-blur-md shadow-lg border-b border-gold' 
        : 'bg-transparent'
      }`}>
      <div className="max-w-7xl relative mx-auto px-4 flex justify-between items-center">
        <div className={`arabesque-pattern absolute inset-0 opacity-80 ${isScrolled ? 'block' : 'hidden'}`}></div>
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="btn btn-ghost text-xl"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img src="./public/Logo.webp" alt="logo" className="w-6" />
            <h1 className="text-2xl font-display text-gold">IKSADA STORE</h1>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle text-gold border border-gold"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <div className="indicator">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m10 0h2m-2 0a2 2 0 100 4 2 2 0 000-4zm-8 4a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totItems > 0 && (
                  <span className="absolute -top-3 -right-3 bg-accent-green text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totItems}
                  </span>
                )}
              </div>
            </div>
            {/* <div
              tabIndex={0}
              className="mt-3 z-[1] card card-compact dropdown-content w-64 bg-base-100 shadow dark:bg-gray-800"
            >
              <div className="p-3">
                <CartBody />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
