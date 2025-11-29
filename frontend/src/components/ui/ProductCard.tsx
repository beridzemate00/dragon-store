import type { Product, StoreSlug } from "../../types";

interface Props {
  product: Product;
  storeSlug: StoreSlug;
  onAddToCart: () => void;
}

const ProductCard = ({ product, storeSlug, onAddToCart }: Props) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 flex flex-col">
      <div className="flex-1">
        <h2 className="font-semibold text-sm mb-1">{product.name}</h2>
        {product.category && (
          <p className="text-xs text-slate-500 mb-1">{product.category}</p>
        )}
        {product.description && (
          <p className="text-xs text-slate-600 line-clamp-3 mb-2">
            {product.description}
          </p>
        )}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <div className="font-semibold text-red-600 text-sm">
            {product.price.toFixed(2)} ₾{" "}
            <span className="text-xs text-slate-500">/ {product.unit}</span>
          </div>
          <div className="text-xs text-slate-500">
            In stock: {product.inStock} ({storeSlug})
          </div>
        </div>
        <button
          className="text-xs px-3 py-1 rounded-full bg-red-500 text-white font-semibold disabled:opacity-50"
          disabled={product.inStock <= 0}
          onClick={onAddToCart}
        >
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
