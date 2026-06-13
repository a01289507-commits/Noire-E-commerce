"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { client } from "@/sanity/lib/client";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("userToken") || "guest";
        const query = `*[_type == "cart" && token == $token]{
          _id,
          name,
          price,
          size,
          quantity,
          image,
          productId
        }`;
       const data = await client.fetch(query, { token } as any);
        setCartItems(data);
      } catch (error) {
        console.error("Cart fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ✅ API route se delete — writeClient directly nahi
  const handleRemoveItem = async (idToRemove: string) => {
    try {
      const res = await fetch("/api/cart/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idToRemove }),
      });
      const data = await res.json();
      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== idToRemove));
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-500 text-sm">Loading your cart...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Shopping Bag</h1>
        <span className="text-sm font-semibold text-zinc-500">{cartItems.length} Items</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-24 bg-zinc-50 rounded-3xl border border-zinc-100">
          <ShoppingBag className="w-16 h-16 mx-auto text-zinc-300 mb-6" />
          <p className="text-zinc-600 mb-8 font-medium">Your bag is currently empty.</p>
          <Link href="/" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div key={item._id} className="flex gap-6 p-5 bg-white border border-zinc-100 rounded-3xl shadow-sm items-center hover:shadow-md transition-shadow">

                {/* ✅ img tag — next/image ki jagah, domain issue nahi hoga */}
                <div className="w-24 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-zinc-300" />
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <h2 className="font-bold text-xl uppercase tracking-tight">{item.name}</h2>
                  <div className="flex gap-4 mt-2 text-sm text-zinc-500">
                    <span>Size: <strong className="text-black">{item.size || "N/A"}</strong></span>
                    <span>Qty: <strong className="text-black">{item.quantity || 1}</strong></span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    ${item.price} × {item.quantity || 1} ={" "}
                    <strong className="text-zinc-700">
                      ${(item.price * (item.quantity || 1)).toFixed(2)}
                    </strong>
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-black text-lg mb-3">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> REMOVE
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-950 text-white p-8 rounded-3xl sticky top-28">
              <h2 className="font-bold text-xl mb-6 uppercase tracking-wider">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping</span>
                  <span className="text-white font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-2xl font-black border-t border-zinc-800 pt-6">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            
<Link
  href="/checkout"
  className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-zinc-200 transition flex items-center justify-center gap-2"
>
  Checkout Now <ArrowRight className="w-4 h-4" />
</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}