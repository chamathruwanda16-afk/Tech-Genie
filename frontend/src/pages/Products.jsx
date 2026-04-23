import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import curatedProducts from "../data/curatedProducts";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  // DB compare ids (legacy)
  const [compareList, setCompareList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("compare")) || [];
    } catch {
      return [];
    }
  });
  // AI/curated compare entries
  const [compareAI, setCompareAI] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("compare_ai")) || [];
    } catch {
      return [];
    }
  });
  const navigate = useNavigate();

  // Load curated catalog (replaces previous dynamic fetches for this UI)
  useEffect(() => {
    // keep as sync work; trivial
    setProducts(curatedProducts);
    setLoading(false);
  }, []);

  const handleCompareToggle = (productId) => {
    setCompareList((prev) => {
      let updated;
      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        if (prev.length >= 2) {
          alert("You can only compare 2 products at a time.");
          return prev;
        }
        updated = [...prev, productId];
      }
      localStorage.setItem("compare", JSON.stringify(updated));
      return updated;
    });
  };

  const handleViewProduct = (product) => {
    if (product.link) {
      window.open(product.link, "_blank", "noopener,noreferrer");
    } else {
      navigate(`/product/${encodeURIComponent(product.title)}`, {
        state: { product },
      });
    }
  };

  const handleCompareAIToggle = (product) => {
    setCompareAI((prev) => {
      const list = Array.isArray(prev) ? prev.slice() : [];
      const id = product.id || product._id || product.title;
      const exists = list.find((p) => p.id === id);
      if (exists) {
        const updated = list.filter((p) => p.id !== id);
        localStorage.setItem("compare_ai", JSON.stringify(updated));
        return updated;
      }
      if (list.length >= 2) {
        alert("You can only compare 2 products at a time.");
        return list;
      }
      const entry = {
        id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: product.price || null,
        rating: product.rating || null,
        category: product.category,
        source: "curated",
        specs: product.specs || undefined,
      };
      const updated = [...list, entry];
      localStorage.setItem("compare_ai", JSON.stringify(updated));
      return updated;
    });
  };

  if (loading) return <p className="loading">Loading products...</p>;
  if (products.length === 0)
    return <p className="no-products">No products available.</p>;

  const filteredProducts =
    categoryFilter === "All"
      ? products
      : products.filter((p) => p.category === categoryFilter);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <div className="products-container">
      <h2 className="page-title products-title">Explore Products</h2>

      <div className="filter-row">
        <select
          className="category-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="products-grid">
        {filteredProducts.map((p) => (
          <div key={p._id} className="product-card">
            <img
              src={p.thumbnail}
              alt={p.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/fallback.jpg";
              }}
              className="product-image"
            />
            <h4 className="product-title">{p.title}</h4>
            <p className="product-info">
              <strong>Price:</strong>{" "}
              {p.price ? `LKR ${Number(p.price).toLocaleString()}` : "N/A"}
              <br />
              <strong>Rating:</strong> {p.rating || "No rating"}
            </p>
            <div className="product-actions">
              <button className="btn-primary" onClick={() => handleViewProduct(p)}>
                View Product
              </button>
              <button
                className="btn-secondary compare-btn"
                onClick={() => handleCompareAIToggle(p)}
              >
                {compareAI.find((i) => (i.id || i._id) === (p.id || p._id))
                  ? "Remove"
                  : "Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {(compareList.length >= 2 || compareAI.length >= 2) && (
        <div className="compare-bar">
          <button
            onClick={() => navigate("/compare")}
            className="btn-secondary"
          >
            Compare Now ({Math.max(compareList.length, compareAI.length)})
          </button>
        </div>
      )}
    </div>
  );
}
