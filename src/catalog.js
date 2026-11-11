export const CATEGORIES = [
  { value: "electronics", label: "Электроника" },
  { value: "jewelery", label: "Ювелирные изделия" },
  { value: "men's clothing", label: "Мужская одежда" },
  { value: "women's clothing", label: "Женская одежда" },
];

export function validatePrices(minText, maxText) {
  const errors = {};
  const min = minText === "" ? undefined : Number(minText);
  const max = maxText === "" ? undefined : Number(maxText);
  for (const [name, value] of [
    ["min", min],
    ["max", max],
  ]) {
    if (value !== undefined && !Number.isFinite(value))
      errors[name] = "Введите число";
    else if (value < 0) errors[name] = "Цена не может быть отрицательной";
  }
  if (
    !Object.keys(errors).length &&
    min !== undefined &&
    max !== undefined &&
    min > max
  ) {
    errors.min = "Цена «от» не может быть больше цены «до»";
    errors.max = "Цена «до» не может быть меньше цены «от»";
  }
  return errors;
}

export function filterProducts(products, filters) {
  return products.filter(
    (product) =>
      (!filters.categories.length ||
        filters.categories.includes(product.category)) &&
      (filters.minPrice === undefined || product.price >= filters.minPrice) &&
      (filters.maxPrice === undefined || product.price <= filters.maxPrice),
  );
}
