import { useContext, useState } from "react";
import { StoreContext } from "../StoreContext";
import Alert from "./Alert";

const GroupedCard = ({ product }) => {
  const { items, addToCart } = useContext(StoreContext);
  const [alert, setAlert] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0].id);

  // Find the selected variant details
  const selectedVariantDetails = product.variants.find(v => v.id === selectedVariant);

  // Check if any variant of this group is in cart
  let cartItem = null;
  let totalQty = 0;
  product.variants.forEach(variant => {
    const itemInCart = items.find(item => item.id === variant.id);
    if (itemInCart) {
      cartItem = itemInCart;
      totalQty += itemInCart.qty;
    }
  });

  const handleAddToCart = () => {
    if ( selectedVariantDetails) {
      const payload = {
        id: selectedVariantDetails.id,
        productId: product.id,
        name: product.name,
        variantName: selectedVariantDetails.name,
        price: selectedVariantDetails.price,
        image: product.image,
      };

      console.log("Adding to cart:", payload);
      addToCart(payload);
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
  };

  return (
    <div className="indicator">
      <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 max-w-xs w-full flex flex-col">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            className="w-full h-full object-contain"
            alt={product.name}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-3 flex-grow flex flex-col">
          <h3 className="font-semibold text-sm md:text-base mb-2 dark:text-white">{product.name}</h3>
          <p className="text-xs md:text-sm text-gray-600 mb-3 flex-grow dark:text-gray-300">{product.desc}</p>

          {/* Variant selection as radio buttons */}
          <div className="mb-3">
            <label className="text-xs text-gray-700 block mb-1 dark:text-gray-300">Pilih Variasi:</label>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <label
                  key={variant.id}
                  className={`flex items-center px-2 py-1 rounded border text-[10px] cursor-pointer ${
                    selectedVariant === variant.id
                      ? 'border-accent bg-accent text-white'
                      : 'border-gray-300 hover:border-accent dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name={`variant-${product.id}`}
                    value={variant.id}
                    checked={selectedVariant === variant.id}
                    onChange={(e) => setSelectedVariant(e.target.value)}
                    className="hidden"
                  />
                  <span>{variant.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2">
            <p className="font-bold text-sm dark:text-white">
              Rp {Number(selectedVariantDetails?.price).toLocaleString()}
            </p>
            <button
              className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-accent-focus"
              onClick={handleAddToCart}
            >
              + Keranjang
            </button>
          </div>
        </div>
      </div>

      {/* Show total quantity if any variant is in cart */}
      {totalQty > 0 && (
        <span className="badge badge-accent badge-lg indicator-item">
          {totalQty}
        </span>
      )}

      {alert && <Alert />}
    </div>
  );
};

export default GroupedCard;