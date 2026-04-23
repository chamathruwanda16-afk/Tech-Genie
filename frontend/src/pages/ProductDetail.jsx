import { useLocation, useNavigate } from "react-router-dom";
import "../App.css";

export default function ProductDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="product-detail__error">
        <h2>Could not fetch the product details.</h2>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      {/* Back Button */}
      <button className="btn-secondary" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Main Product Info */}
      <div className="product-detail__main">
        <img
          src={product.thumbnail || "/fallback.jpg"}
          alt={product.title}
          className="product-detail__image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/fallback.jpg";
          }}
        />

        <div className="product-detail__info">
          <h2>{product.title}</h2>

          <p className="product-price">
            <strong>Price:</strong>{" "}
            {product.priceFormatted !== "N/A"
              ? product.priceFormatted
              : "Price Not Available"}
          </p>

          {product.priceUSD && (
            <p>
              <strong>USD Price:</strong> ${product.priceUSD.toFixed(2)}
            </p>
          )}

          {product.rating && (
            <p>
              <strong>Rating:</strong> {product.rating}
            </p>
          )}

          {/* Buy Now Button */}
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Buy Now
            </a>
          )}
        </div>
      </div>

      {/* Product Specifications */}
      {product.specs && (
        <div className="product-section">
          <h3>Specifications</h3>
          <table className="specs-table">
            <tbody>
              {Object.entries(product.specs).map(([key, value], idx) => (
                <tr key={idx}>
                  <td className="spec-key">{key}</td>
                  <td className="spec-value">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pros & Cons */}
      {(product.pros || product.cons) && (
        <div className="product-section pros-cons">
          {product.pros && (
            <div>
              <h3>Pros</h3>
              <ul>
                {product.pros.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {product.cons && (
            <div>
              <h3>Cons</h3>
              <ul>
                {product.cons.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Summary */}
      {product.summary && (
        <div className="product-section">
          <h3>Summary</h3>
          <p>{product.summary}</p>
        </div>
      )}
    </div>
  );
}
