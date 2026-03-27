import { useEffect, useState } from "react";

export default function GoogleReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/google-reviews")
      .then((res) => res.json())
      .then((data) => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <section className="reviews">
      <h2>What Our Students Say</h2>

      <div className="reviews-grid">
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <div className="review-header">
              <strong>{r.author_name}</strong>
              <span className="stars">
                {"★".repeat(r.rating)}
                {"☆".repeat(5 - r.rating)}
              </span>
            </div>

            <p>{r.text}</p>

            <small>
              {new Date(r.time * 1000).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>

      <a
        href="https://www.google.com/maps/place/?q=place_id:ChIJg0HWtx6RyzsRyA1bYmVMUsU"
        target="_blank"
        rel="noreferrer"
      >
        View more on Google
      </a>
    </section>
  );
}
