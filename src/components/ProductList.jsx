import { useEffect, useState } from "react";
import { Filters } from "./Filters.jsx";
import { ProductCard } from "./ProductCard.jsx";
import { filterProducts } from "../catalog.js";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [filters, setFilters] = useState({
    categories: [],
    minPrice: undefined,
    maxPrice: undefined,
  });

  useEffect(() => {
    const controller = new AbortController();
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://fakestoreapi.com/products", {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);
        const data = await response.json();
        if (
          !Array.isArray(data) ||
          data.some(
            (item) =>
              !item ||
              typeof item.title !== "string" ||
              typeof item.category !== "string" ||
              !Number.isFinite(item.price) ||
              item.id == null,
          )
        )
          throw new Error("Сервер вернул некорректный список товаров");
        if (!controller.signal.aborted) setProducts(data);
      } catch (err) {
        if (!controller.signal.aborted)
          setError(err.message || "Не удалось загрузить товары");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadData();
    return () => controller.abort();
  }, [attempt]);
  useEffect(() => {
    setFilteredProducts(filterProducts(products, filters));
  }, [products, filters]);

  if (loading) return <p role="status">Загрузка товаров…</p>;
  if (error)
    return (
      <div role="alert" className="filters">
        <p className="error">Ошибка: {error}</p>
        <button onClick={() => setAttempt((value) => value + 1)}>
          Повторить загрузку
        </button>
      </div>
    );
  return (
    <section>
      <Filters
        initialFilters={filters}
        onFilterChange={setFilters}
        maxPrice={Math.max(0, ...products.map((product) => product.price))}
      />
      <p role="status" className="result-count">
        Показано товаров: {filteredProducts.length} из {products.length}
      </p>
      {filteredProducts.length === 0 ? (
        <p className="empty">Товары не найдены по выбранным фильтрам.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
