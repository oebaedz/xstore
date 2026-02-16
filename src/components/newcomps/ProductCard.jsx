import { useContext, useState } from "react";
import { StoreContext } from "../../StoreContext";
import Alert from "../Alert";

export default function ProductCard( { product } ) {
  const { items, addToCart } = useContext(StoreContext);
  const [alert, setAlert] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0].id);
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
    if (selectedVariantDetails) {
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
    <div
      className="
        bg-surface
        rounded-sm
        shadow-card
        border-2 border-accent-green/20
        transition-all duration-300
        hover:-translate-y-2
        hover:border-accent-green
        overflow-hidden
      "
    >
      {/* Media */}
      <div className="h-40 md:h-80 bg-muted relative">
        {/* Badge */}
        <span
          className="
            absolute top-2 left-2 md:top-4 md:left-4
            bg-primary text-primary-foreground
            text-[6px] md:text-sm tracking-widest
            px-2 md:px-3 py-1
            rounded-sm
            font-body
          "
        >
          {product.category}
        </span>

        {/* Placeholder image */}
        <div className="h-full flex items-center justify-center text-text-muted">
          <img className="object-contain w-full h-full" src={product.image} alt={product.name} />
        </div>
      </div>

      {/* Content */}
      <div className="p-3 md:p-6 flex flex-col md:gap-4">
        {/* Title */}
        <h3 className="font-display mb-2 text-md md:text-2xl text-primary">
          {product.name}
        </h3>

        {/* Description */}
        <p className="font-body text-xs md:text-sm text-gray-600 mb-2">
          {product.desc}
        </p>

        {/* Variant */}
        <div className="flex gap-2 flex-wrap">
          {product.variants.map((v) => (
            <label
              key={v.id}
              className={`
                px-1 md:px-3 md:py-1
                text-[10px] md:text-xs
                rounded-sm
                font-body
                transition
                ${selectedVariant === v.id 
                  ? 'bg-primary text-primary-foreground' 
                  : ''}
                border border-primary text-primary hover:bg-primary hover:text-primary-foreground
              `}
            >
              <input
                type="radio"
                name={`variant-${product.id}`}
                value={v.id}
                checked={selectedVariant === v.id}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="hidden"
              />
              {v.name}
            </label>
          ))}
        </div>

        {/* Price */}
        <div className="font-display text-2xl md:text-3xl text-gold mt-2">
          Rp {Number(selectedVariantDetails?.price).toLocaleString()}
        </div>

        {/* CTA */}
        <button
          className="
            mt-4 w-full
            bg-accent-green
            hover:bg-accent-green-dark
            text-white
            text-sm md:text-xl
            py-1 md:py-3
            rounded-sm
            font-body
            tracking-wide
            transition
          "
          onClick={handleAddToCart}
        >
          + KERANJANG
        </button>
      </div>
    </div>
  );
}
