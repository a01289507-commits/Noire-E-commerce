"use client";

import { useState, useEffect } from "react";
import SizeSelector from "./SizeSelector";
import { ShoppingBag, CheckCircle2, Plus, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductActions({ productId, name, price, image }: Props) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(true);
  const router = useRouter();

  // ✅ Page load hote hi check karo — kya yeh product cart mein hai?
  useEffect(() => {
    const checkCart = async () => {
      try {
        const token = localStorage.getItem("userToken") || "guest";
        const res = await fetch(`/api/cart/check?productId=${productId}&token=${token}`);
        const data = await res.json();
        setAlreadyInCart(data.exists);
      } catch (err) {
        console.error("Cart check error:", err);
      } finally {
        setCheckingCart(false);
      }
    };
    checkCart();
  }, [productId]);

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken") || "guest";

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          name,
          price,
          size: selectedSize,
          quantity, // ✅ quantity bhi bhejo
          image,
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to add to cart");
      }

      window.dispatchEvent(new Event("cartUpdated"));
      setAlreadyInCart(true); // ✅ button change ho jaye
    } catch (error: any) {
      console.error("Add to cart error:", error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Size Selector */}
      <div className="space-y-3">
        <SizeSelector
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
        />
      </div>

      {/* ✅ Quantity Selector */}
      <div className="space-y-2">
        <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider">
          Quantity
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-zinc-200 rounded-2xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-12 h-12 flex items-center justify-center hover:bg-zinc-100 transition text-zinc-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-bold text-zinc-900 text-lg">
              {quantity}
            </span>
            <button
  onClick={() => setQuantity((q) => q + 1)} // یہاں سے 20 کی لمٹ ہٹا دی گئی ہے
  className="w-12 h-12 flex items-center justify-center hover:bg-zinc-100 transition text-zinc-700"
> <Plus className="w-4 h-4" /> </button>
          </div>
        </div>
      </div>

      {/* ✅ Total Price preview */}
      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 flex justify-between items-center">
        <span className="text-sm text-zinc-500">Total</span>
        <span className="font-black text-zinc-900 text-lg">
          ${(price * quantity).toFixed(2)}
        </span>
      </div>

      {/* ✅ Add to Cart Button — 3 states: loading, already in cart, normal */}
      <div className="space-y-3 pt-2">
        {checkingCart ? (
          <div className="w-full py-4 rounded-2xl bg-zinc-100 animate-pulse" />
        ) : alreadyInCart ? (
          // Already in cart — 2 options dikhao
          <div className="space-y-3">
            <div className="w-full py-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-emerald-700 text-sm uppercase tracking-wider">
                Already in Cart
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => router.push("/cart")}
                className="py-3 rounded-2xl bg-zinc-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition"
              >
                View Cart
              </button>
              <button
                onClick={() => {
                  setAlreadyInCart(false); // allow karo dubara add
                }}
                className="py-3 rounded-2xl border border-zinc-300 text-zinc-700 font-bold text-xs uppercase tracking-wider hover:border-zinc-900 transition"
              >
                Add Again
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2
              ${loading
                ? "bg-zinc-300 text-zinc-500 cursor-not-allowed"
                : "bg-zinc-950 text-white hover:bg-zinc-800"
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            {loading ? "Adding..." : `Add ${quantity > 1 ? `(${quantity})` : ""} to Cart`}
          </button>
        )}
      </div>
    </>
  );
}