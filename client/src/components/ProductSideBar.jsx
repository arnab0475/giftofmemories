import React from "react";

const SidebarFilter = ({
  categories,
  selectedCategories,
  onToggleCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  clearFilters,
}) => {
  return (
    <aside className="hidden lg:block w-[280px] shrink-0  top-28 h-fit">
      <div className=" shadow-md p-6 space-y-6">

        <h3 className="text-xl font-playfair">Filter</h3>

        {/* Category */}
        <details open className="border-b pb-4">
          <summary className="cursor-pointer font-medium">
            Category
          </summary>

          <div className="mt-4 space-y-2">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => onToggleCategory(cat.name)}
                  className="accent-gold-accent"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </details>

        {/* Price */}
        <details className="border-b pb-4">
          <summary className="cursor-pointer font-medium">
            Price
          </summary>

          <div className="mt-4 flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-1/2 border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-1/2 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </details>

        <button
          onClick={clearFilters}
          className="text-sm text-gold-accent underline"
        >
          Clear Filters
        </button>
      </div>
    </aside>
  );
};

export default SidebarFilter;