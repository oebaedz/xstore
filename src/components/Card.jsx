import { useContext, useState } from "react";
import { StoreContext } from "../StoreContext";
import Alert from "./Alert";

const Card = ({ product }) => {
  const { items, addToCart } = useContext(StoreContext);
  const [alert, setAlert] = useState(false)

  const current = items.find(prod => prod.id === product.id)

  const handleAddCart = () => {
    addToCart(product);
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 5000);
  };

  return (
    <div className="indicator">
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs w-full">
        <div className="relative">
          <img
            src={product.image}
            className="w-full h-48 object-cover"
            alt={product.name}
          />
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-sm md:text-base mb-1">{product.name}</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-1">{product.desc}</p>
          <p className="text-xs text-gray-500 mb-2">{product.subt}</p>
          <div className="flex justify-between items-center mt-2">
            <p className="font-bold">Rp {Number(product.price).toLocaleString()}</p>
            <button
              className="bg-accent text-white px-3 py-1 rounded text-sm"
              onClick={handleAddCart}
            >
              + Keranjang
            </button>
          </div>
        </div>
      </div>
      {current ? (
        <span className="badge badge-accent badge-lg indicator-item">
          {current.qty}
        </span>
      ) : (
        ""
      )}

      {alert && <Alert/>}
    </div>
  );
};

export default Card;
