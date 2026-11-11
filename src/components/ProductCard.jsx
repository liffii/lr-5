import { CATEGORIES } from "../catalog.js";

export function ProductCard({ product }) {
  const category =
    CATEGORIES.find((item) => item.value === product.category)?.label ??
    product.category;
  const placeholder = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="140"><rect width="300" height="140" fill="#edf2f7"/><text x="50%" y="55%" text-anchor="middle" fill="#52657a" font-size="14" font-family="Arial">${category}</text></svg>`)}`;
  return (
    <article className="product-card">
      <img src={placeholder} alt={`Категория: ${category}`} />
      <p className="hint">{category}</p>
      <h2>{product.title}</h2>
      <p className="price">
        {product.price.toLocaleString("ru-RU", {
          style: "currency",
          currency: "USD",
        })}
      </p>
    </article>
  );
}
