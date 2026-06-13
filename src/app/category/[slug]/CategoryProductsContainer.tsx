"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import createImageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";

const builder = createImageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function CategoryProductsContainer({ initialProducts = [] }: { initialProducts: any[] }) {
  
  // Unique sub-categories (Oud, Floral, Shirts) nikalne ke liye
  const availableSubCats = Array.from(
    new Set(initialProducts?.map((p) => p?.subCategory || "other") || [])
  ).filter(Boolean);

  const [activeSubCat, setActiveSubCat] = useState<string>("All");

  // Filter logic
  const filteredProducts = activeSubCat === "All"
    ? initialProducts
    : initialProducts?.filter((p) => (p?.subCategory || "other") === activeSubCat) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
      
      {/* LEFT SIDEBAR FILTERS */}
      <aside className="lg:col-span-3 space-y-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-5">
            Filter By Type
          </h3>
          
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveSubCat("All")}
              className={`flex items-center justify-between px-5 py-3 transition-all border rounded-xl text-sm font-semibold capitalize ${
                activeSubCat === "All" ? "bg-black text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span>All Products</span>
              <span className="text-xs">({initialProducts.length})</span>
            </button>

            {availableSubCats.map((subCat: string) => {
              const count = initialProducts.filter((p) => (p?.subCategory || "other") === subCat).length;
              const isActive = activeSubCat === subCat;
              const formattedName = subCat.toLowerCase().endsWith('s') ? subCat : `${subCat}s`;

              return (
                <button
                  key={subCat}
                  onClick={() => setActiveSubCat(subCat)}
                  className={`flex items-center justify-between px-5 py-3 transition-all border rounded-xl text-sm font-semibold capitalize ${
                    isActive ? "bg-black text-white" : "bg-white text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  <span>{formattedName}</span>
                  <span className="text-xs">({count})</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* RIGHT SIDE PRODUCT GRID */}
      <main className="lg:col-span-9 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-zinc-400">Is type mein koi items nahi mile.</div>
        ) : (
          /* RESPONSIVE GRID LAYOUT WITH MAX-WIDTH FOR CARD PROTECTION */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product: any) => {
              const imageSource = product?.mainImage || product?.productImage || product?.image;
              const finalImageUrl = imageSource ? urlFor(imageSource).url() : "https://via.placeholder.com/400";

              return (
                <Link 
                  href={`/product/${product?.slug?.current}`} 
                  key={product?._id} 
                  className="group flex flex-col w-full max-w-[340px] mx-auto sm:mx-0 border border-zinc-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 bg-white"
                >
                  {/* Aspect ratio layout for perfect luxury imagery size */}
                  <div className="w-full aspect-[4/5] relative bg-zinc-50 overflow-hidden">
                    <Image 
                      src={finalImageUrl} 
                      alt={product?.name || "Product"} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      unoptimized 
                    />
                  </div>
                  <div className="p-5 flex flex-col gap-1.5 border-t border-zinc-50">
                    <h4 className="text-sm font-semibold text-zinc-900 tracking-wide line-clamp-1 group-hover:text-black transition-colors">
                      {product?.name}
                    </h4>
                    
                    {/* FIXED PRICING SECTION WITH COMPARE AT PRICE SUPPORT */}
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base font-black text-zinc-950">
                        ${product?.price}
                      </span>
                      {product?.compareAtPrice && product?.compareAtPrice > product?.price && (
                        <span className="text-xs font-semibold text-zinc-400 line-through">
                          ${product?.compareAtPrice}
                        </span>
                      )}
                    </div>

                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}