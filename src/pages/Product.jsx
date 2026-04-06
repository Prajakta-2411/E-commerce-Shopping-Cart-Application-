import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { FaSearch, FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/productSlice";

function Product() {
  const dispatch = useDispatch();

  // ✅ Redux state
  const { products, loading } = useSelector((state) => state.products);

  // ✅ Local UI state (keep this)
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // ✅ Fetch products using Redux
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // ✅ Fetch categories (still local - OK)
  useEffect(() => {
    fetch("https://dummyjson.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setCategories([]);
      });
  }, []);

  // ✅ Filtering logic (same)
  const filteredProducts = products.filter((product) => {
    const matchSearch = product.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      appliedCategories.length === 0 ||
      appliedCategories.includes(product.category);

    return matchSearch && matchCategory;
  });

  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const paginationItems = (() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    const leftSibling = Math.max(2, currentPage - 1);
    const rightSibling = Math.min(totalPages - 1, currentPage + 1);

    if (leftSibling > 2) {
      pages.push("left-ellipsis");
    }

    for (let page = leftSibling; page <= rightSibling; page += 1) {
      pages.push(page);
    }

    if (rightSibling < totalPages - 1) {
      pages.push("right-ellipsis");
    }

    pages.push(totalPages);
    return pages;
  })();

  useEffect(() => {
    setCurrentPage(1);
  }, [search, appliedCategories]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="w-[90vw] mx-auto mt-24 flex flex-col items-center">

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-xl mb-10">

        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

        <FaFilter
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-purple-600"
          onClick={() => setShowFilter((prev) => !prev)}
        />

        <input
          type="text"
          placeholder="Search products..."
          className="w-full text-[15px] text-black border pl-10 pr-10 py-2 rounded-lg border-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* FILTER PANEL */}
      {showFilter && (
        <div className="absolute top-14 right-0 z-40 w-[300px] bg-white border border-gray-200 rounded-lg shadow-lg p-4">

          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={() => setShowFilter(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Category</p>

            {categories.map((cat) => (
              <div key={cat.slug} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={tempCategories.includes(cat.slug)}
                  onChange={() => {
                    if (tempCategories.includes(cat.slug)) {
                      setTempCategories(tempCategories.filter((c) => c !== cat.slug));
                    } else {
                      setTempCategories([...tempCategories, cat.slug]);
                    }
                  }}
                />
                <label className="capitalize">{cat.name}</label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              disabled={tempCategories.length === 0}
              onClick={() => {
                setTempCategories([]);
                setAppliedCategories([]);
                setShowFilter(false);
              }}
              className={`px-3 py-1 border rounded ${tempCategories.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
                }`}
            >
              Reset
            </button>

            <button
              onClick={() => {
                setAppliedCategories(tempCategories);
                setShowFilter(false);
              }}
              className="px-3 py-1 bg-purple-600 text-white rounded"
            >
              Apply
            </button>
          </div>

        </div>
      )}

      {/* PRODUCTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-24 w-full">

        {loading ? (
          <div className="col-span-full text-center text-gray-500 text-[16px] mt-24">
            Loading all products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-[16px] mt-24">
            No filtered products found.
          </div>
        ) : (
          paginatedProducts.map((product) => (
            <Card
              key={product.id}
              img={product.thumbnail || product.image || product.images?.[0]}
              productId={product.id}
              title={product.title}
              price={product.price}
              rating={product.rating}
            />
          ))
        )}

      </div>

      {/* PAGINATION */}
      {!loading && filteredProducts.length > 0 && (
        <div className="flex justify-end mt-8 mb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Prev
            </button>
            {paginationItems.map((item, index) =>
              typeof item === "string" ? (
                <span key={`${item}-${index}`} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(item)}
                  className={`px-3 py-1 border rounded ${currentPage === item
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-100"
                    }`}
                >
                  {item}
                </button>
              )
            )}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Product;