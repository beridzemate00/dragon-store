import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/client";
import type { StoreSlug, Store, Product } from "../../types";
import MainNavbar from "../../components/layout/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";
import ProductCard from "../../components/ui/ProductCard";
import { useCart } from "../../context/CartContext";

const fetchStores = async (): Promise<Store[]> => {
  const res = await api.get("/stores");
  return res.data;
};

const fetchProducts = async (storeSlug: StoreSlug): Promise<Product[]> => {
  const res = await api.get("/products", {
    params: { storeSlug }
  });
  return res.data;
};

const StoreCatalogPage = () => {
  const params = useParams();
  const storeSlug = (params.storeSlug as StoreSlug) || "lenina";
  const { setStoreSlug, addItem } = useCart();

  const { data: stores } = useQuery({
    queryKey: ["stores"],
    queryFn: fetchStores
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ["products", storeSlug],
    queryFn: () => fetchProducts(storeSlug),
    enabled: !!storeSlug
  });

  const currentStore = stores?.find((s) => s.slug === storeSlug);

  useEffect(() => {
    setStoreSlug(storeSlug);
  }, [storeSlug, setStoreSlug]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold mb-1">
              {currentStore ? currentStore.name : "Store catalog"}
            </h1>
            {currentStore && (
              <p className="text-sm text-slate-600">
                {currentStore.address}
                {currentStore.workTime && ` · ${currentStore.workTime}`}
              </p>
            )}
          </div>

          {isLoading && <p>Loading products...</p>}

          {!isLoading && products && products.length === 0 && (
            <p className="text-sm text-slate-600">No products yet.</p>
          )}

          {!isLoading && products && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  storeSlug={storeSlug}
                  onAddToCart={() =>
                    addItem({
                      productId: p.id,
                      name: p.name,
                      price: p.price,
                      unit: p.unit,
                      quantity: 1,
                      storeSlug
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default StoreCatalogPage;
