"use client";

import { useState } from "react";

interface Props {
  productId: string;
  name: string;
  price: number;
  size: string;
}

export default function AddToCartButton({ productId, name, price, size }: Props) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      // Get user token from localStorage (or "guest" if not logged in)
      const token = localStorage.getItem("userToken") || "guest";

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, price, size, token }),
      });

      const data = await response.json();

      if (response.status === 409) {
        alert("This item is already in your cart!");
        return;
      }

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add to cart");
      }

      // Trigger header cart count update if you have that logic
      window.dispatchEvent(new Event("cartUpdated"));

      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (error: any) {
      console.error("Add to cart error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || added}
      className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-60
        ${added
          ? "bg-emerald-600 text-white"
          : "bg-zinc-950 text-white hover:bg-zinc-900"
        }`}
    >
      {loading ? "Adding..." : added ? "✓ Added to Cart!" : "Add To Cart"}
    </button>
  );
}