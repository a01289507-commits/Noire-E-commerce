"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/sanity/lib/client";

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    shippingAddress: "",
    city: "",
  });

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("userToken") || "guest";
        const query = `*[_type == "cart" && token == $token]{
          _id, name, price, size, quantity, image, productId
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

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateOrderNumber = () => {
    return `ORD-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .substring(2, 7)
      .toUpperCase()}`;
  };

  const handlePlaceOrder = async () => {
    if (
      !form.customerName ||
      !form.email ||
      !form.phone ||
      !form.shippingAddress ||
      !form.city
    ) {
      alert("Sab fields fill karein!");
      return;
    }
    if (cartItems.length === 0) {
      alert("Cart khali hai!");
      return;
    }

    setPlacing(true);
    try {
      const orderNumber = generateOrderNumber();

      const orderDoc = {
        _type: "order",
        orderNumber,
        customerName: form.customerName,
        email: form.email,
        phone: form.phone,
        shippingAddress: form.shippingAddress,
        city: form.city,
        products: cartItems.map((item) => ({
          _type: "object",
          _key: item._id,
          variantTitle: item.size || "N/A",
          quantity: item.quantity || 1,
          price: item.price || 0,
          ...(item.productId
            ? { product: { _type: "reference", _ref: item.productId } }
            : {}),
        })),
        totalAmount,
        paymentMethod,
        status: "pending",
        orderDate: new Date().toISOString(),
      };

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDoc),
      });

      const data = await res.json();
      if (!data.success) throw new Error("Order save nahi hua");

      // Cart clear karo
      for (const item of cartItems) {
        await fetch("/api/cart/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item._id }),
        });
      }

      window.dispatchEvent(new Event("cartUpdated"));
      router.push(`/order-success?order=${orderNumber}`);
    } catch (error) {
      console.error("Order error:", error);
      alert("Order place karne mein masla aaya. Dobara try karein.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500 text-sm">Loading...</p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 min-h-screen">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
        Checkout
      </h1>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* LEFT — Form */}
        <div className="lg:col-span-7 space-y-8">

          {/* Delivery Info */}
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-lg uppercase tracking-wider mb-6">
              Delivery Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block">
                    Full Name *
                  </label>
                  <input
                    name="customerName"
                    value={form.customerName}
                    onChange={handleChange}
                    placeholder="Ali Hassan"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block">
                    Phone *
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="03001234567"
                    className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block">
                  Email *
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ali@example.com"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block">
                  Shipping Address *
                </label>
                <textarea
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  placeholder="Ghar number, gali, mohalla..."
                  rows={3}
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition resize-none"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-widest text-zinc-500 mb-1 block">
                  City *
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Lahore"
                  className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-lg uppercase tracking-wider mb-6">
              Payment Method
            </h2>
            <div className="space-y-3">

              {/* COD */}
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-black bg-zinc-50"
                    : "border-zinc-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="hidden"
                />
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-zinc-500">
                    Delivery pe payment karein
                  </p>
                </div>
                {paymentMethod === "cod" && (
                  <span className="ml-auto font-bold text-lg">✓</span>
                )}
              </label>

              {/* EasyPaisa / JazzCash */}
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "mobile_wallet"
                    ? "border-black bg-zinc-50"
                    : "border-zinc-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="mobile_wallet"
                  checked={paymentMethod === "mobile_wallet"}
                  onChange={() => setPaymentMethod("mobile_wallet")}
                  className="hidden"
                />
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">
                    EasyPaisa / JazzCash
                  </p>
                  <p className="text-xs text-zinc-500">
                    Mobile wallet se payment karein
                  </p>
                </div>
                {paymentMethod === "mobile_wallet" && (
                  <span className="ml-auto font-bold text-lg">✓</span>
                )}
              </label>

              {/* Card */}
              <label
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === "card"
                    ? "border-black bg-zinc-50"
                    : "border-zinc-200"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="hidden"
                />
                <span className="text-2xl">💳</span>
                <div>
                  <p className="font-bold text-sm uppercase tracking-wide">
                    Credit / Debit Card
                  </p>
                  <p className="text-xs text-zinc-500">
                    Visa, Mastercard accepted
                  </p>
                </div>
                {paymentMethod === "card" && (
                  <span className="ml-auto font-bold text-lg">✓</span>
                )}
              </label>

            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-950 text-white p-8 rounded-3xl sticky top-28">
            <h2 className="font-bold text-xl mb-6 uppercase tracking-wider">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-zinc-300"
                >
                  <span>
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span>
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-zinc-800 pt-4 mb-6">
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-sm">
                <span>Shipping</span>
                <span className="text-white font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-2xl font-black border-t border-zinc-800 pt-4">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {placing ? "Placing Order..." : "Place Order →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}