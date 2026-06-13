"use client";

import { useState } from "react";

interface ProductImageGalleryProps {
  uniqueImages: string[];
  productName: string;
}

export default function ProductImageGallery({
  uniqueImages,
  productName,
}: ProductImageGalleryProps) {
  const [activeImage, setActiveImage] = useState(uniqueImages[0]);

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      
      {/* Thumbnails */}
      {uniqueImages.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible">
          {uniqueImages.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(imgUrl)}
              className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 flex-shrink-0
                ${
                  activeImage === imgUrl
                    ? "border-black shadow-lg scale-105"
                    : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                }`}
            >
              <img
                src={imgUrl}
                alt={`${productName} ${index + 1}`}
                className="w-20 h-24 object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1">
        <div className="group relative overflow-hidden rounded-3xl bg-zinc-50 border border-zinc-100">

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
            New
          </div>

          <img
            src={activeImage}
            alt={productName}
            className="
              w-full
              h-[450px]
              lg:h-[600px]
              xl:h-[650px]
              object-cover
              transition-transform
              duration-700
              group-hover:scale-110
            "
          />
        </div>
      </div>
    </div>
  );
}
