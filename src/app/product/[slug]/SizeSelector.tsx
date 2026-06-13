"use client";

import { Ruler } from "lucide-react";

interface Props {
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({ selectedSize, onSizeChange }: Props) {
  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider">
          Select Size
        </h3>
        <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-black transition">
          <Ruler className="w-3.5 h-3.5" />
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeChange(size)} // ✅ parent ko batao
            className={`
              h-14 rounded-2xl border text-sm font-semibold transition-all duration-300
              ${selectedSize === size
                ? "bg-black text-white border-black shadow-lg scale-105"
                : "bg-white border-zinc-200 hover:border-black hover:bg-black hover:text-white"
              }
            `}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-3">
        <p className="text-sm text-zinc-600">
          Selected Size:
          <span className="font-bold text-black ml-2">{selectedSize}</span>
        </p>
      </div>

      <p className="text-xs text-emerald-600 font-medium">
        ✓ In stock and ready to ship
      </p>
    </div>
  );
}