import { useState } from "react";
import { CATEGORIES, validatePrices } from "../catalog.js";

export function Filters({ initialFilters, onFilterChange, maxPrice }) {
  const [categories, setCategories] = useState(initialFilters.categories);
  const [min, setMin] = useState(String(initialFilters.minPrice ?? ""));
  const [max, setMax] = useState(String(initialFilters.maxPrice ?? ""));
  const [errors, setErrors] = useState({});
  const rangeMax = Math.max(
    1,
    Math.ceil(maxPrice),
    Number(min) || 0,
    Number(max) || 0,
  );

  function changePrice(field, value) {
    (field === "min" ? setMin : setMax)(value);
    setErrors({});
  }

  function apply(event) {
    event.preventDefault();
    const nextErrors = validatePrices(min, max);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onFilterChange({
      categories,
      minPrice: min === "" ? undefined : Number(min),
      maxPrice: max === "" ? undefined : Number(max),
    });
  }

  function reset() {
    setCategories([]);
    setMin("");
    setMax("");
    setErrors({});
    onFilterChange({
      categories: [],
      minPrice: undefined,
      maxPrice: undefined,
    });
  }

  return (
    <form className="filters" onSubmit={apply} noValidate>
      <fieldset>
        <legend>Категории</legend>
        <p className="hint">
          Можно выбрать несколько. Без выбора показаны все категории.
        </p>
        <div className="categories">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="check">
              <input
                type="checkbox"
                checked={categories.includes(category.value)}
                onChange={(event) =>
                  setCategories((current) =>
                    event.target.checked
                      ? [...current, category.value]
                      : current.filter((value) => value !== category.value),
                  )
                }
              />
              {category.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="price-fields">
        {[
          ["min", "Цена от", min, 0],
          ["max", "Цена до", max, rangeMax],
        ].map(([field, label, value, fallback]) => (
          <div key={field}>
            <label htmlFor={field}>{label} ($)</label>
            <input
              id={field}
              type="number"
              min="0"
              step="0.01"
              value={value}
              placeholder={String(fallback)}
              onChange={(event) => changePrice(field, event.target.value)}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={errors[field] ? `${field}-error` : undefined}
            />
            <input
              aria-label={`${label}: ползунок`}
              type="range"
              min="0"
              max={rangeMax}
              step="0.01"
              value={value === "" ? fallback : Math.max(0, Number(value) || 0)}
              onChange={(event) => changePrice(field, event.target.value)}
            />
            {errors[field] && (
              <span className="error" id={`${field}-error`} role="alert">
                {errors[field]}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="actions">
        <button type="submit">Применить фильтры</button>
        <button type="button" className="secondary" onClick={reset}>
          Сбросить
        </button>
      </div>
    </form>
  );
}
