"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { client } from "../sanity/lib/client";


const formatUrl = (url: string) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  let cleanUrl = url.trim().toLowerCase();
  if (cleanUrl === "about" || cleanUrl === "/about") return "/about";
  if (cleanUrl === "contact" || cleanUrl === "/contact") return "/contact";
  if (cleanUrl.startsWith("/products/") || cleanUrl.startsWith("products/")) {
    cleanUrl = cleanUrl.replace("products/", "").replace("/", "");
  } else if (cleanUrl.startsWith("/product/") || cleanUrl.startsWith("product/")) {
    cleanUrl = cleanUrl.replace("product/", "").replace("/", "");
  }
  if (cleanUrl.startsWith("/")) {
    return cleanUrl.startsWith("/category/") ? cleanUrl : `/category${cleanUrl}`;
  }
  return `/category/${cleanUrl}`;
};

async function getHeaderData() {
  const query = `*[_type == "header"][0] {
    topBarText,
    logoText,
    navLinks[] {
      label,
      url,
      dropdownLinks[] { label, url }
    }
  }`;
  return await client.fetch(query);
}

export default function Header() {
  const [data, setData] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // ✅ FIX: Sanity se cart count fetch karo — localStorage se nahi
  const refreshCartCount = async () => {
    try {
      const token = localStorage.getItem("userToken") || "guest";
      const query = `count(*[_type == "cart" && token == $token])`;
      const count = await client.fetch(query, { token } as any);
      setCartCount(count);
    } catch (error) {
      console.error("Cart count error:", error);
    }
  };

  useEffect(() => {
    getHeaderData().then((res) => setData(res));

    // ✅ Initial load pe Sanity se count fetch karo
    refreshCartCount();

    // ✅ Jab bhi cartUpdated event fire ho, count update karo
    window.addEventListener("cartUpdated", refreshCartCount);
    return () => window.removeEventListener("cartUpdated", refreshCartCount);
  }, []);

  const links = data?.navLinks || [];

  return (
    <div className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* Top Bar */}
      {data?.topBarText && (
        <div className="bg-black text-white text-center py-2 text-[10px] uppercase tracking-[0.2em]">
          {data.topBarText}
        </div>
      )}

      {/* Main Header */}
      <header className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M4 6h16M4 12h16M4 18h16"
              }
            />
          </svg>
        </button>

        <Link
          href="/"
          className="text-2xl font-bold tracking-[0.15em] uppercase"
        >
          {data?.logoText || "NOIRÉ"}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {links.map((link: any, index: number) => (
            <div
              key={index}
              className="relative group h-20 flex items-center"
            >
              <Link
                href={formatUrl(link.url)}
                className="text-xs uppercase tracking-widest text-zinc-700 hover:text-black transition"
              >
                {link.label}
              </Link>

              {link.dropdownLinks && link.dropdownLinks.length > 0 && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 invisible opacity-0 group-hover:visible group-hover:opacity-100 min-w-[200px] bg-white border border-gray-100 shadow-xl rounded-b-xl py-4 transition-all duration-200 flex flex-col z-50">
                  {link.dropdownLinks.map((subLink: any, subIndex: number) => (
                    <Link
                      key={subIndex}
                      href={formatUrl(subLink.url)}
                      className="px-6 py-2 text-[11px] text-zinc-600 hover:text-black hover:bg-zinc-50 uppercase tracking-wider transition"
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-[11px] uppercase tracking-widest hover:text-black">
            Search
          </button>
          <Link
            href="/cart"
            className="text-[11px] uppercase tracking-widest font-semibold hover:text-black transition"
          >
            Cart ({cartCount})
          </Link>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? "max-h-screen border-t border-gray-700"
            : "max-h-0"
        }`}
      >
        <nav className="bg-white p-6 space-y-2">
          {links.map((link: any, index: number) => (
            <div key={index} className="py-2">
              <Link
                href={formatUrl(link.url)}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm uppercase font-medium text-zinc-800"
              >
                {link.label}
              </Link>

              {link.dropdownLinks && link.dropdownLinks.length > 0 && (
                <div className="pl-4 mt-2 border-l border-gray-100 space-y-2">
                  {link.dropdownLinks.map((subLink: any, subIndex: number) => (
                    <Link
                      key={subIndex}
                      href={formatUrl(subLink.url)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-xs uppercase text-zinc-500 hover:text-black"
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link
            href="/cart"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-3 text-sm font-bold uppercase text-zinc-800 border-t pt-4"
          >
            Cart ({cartCount})
          </Link>
        </nav>
      </div>
    </div>
  );
}