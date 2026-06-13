"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import gsap from "gsap";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function HomePage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);

  const heroRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Hero Slides
        const heroData = await client.fetch(`
          *[_type == "heroBanner"][0]{
            slides
          }
        `);

        setSlides(heroData?.slides || []);

        // Products
        const productsData = await client.fetch(`
          *[_type == "product" && status == "active"]{
            _id,
            name,
            "slug": slug.current,
            price,
            compareAtPrice,
            mainImage,
            showOnHomePage,
            isFeatured,
            featured
          }
        `);

        const featuredProducts = productsData.filter(
          (product: any) =>
            product.showOnHomePage === true ||
            product.isFeatured === true ||
            product.featured === true
        );

        setProducts(featuredProducts);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        }
      );
    }, heroRef);

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [current, slides]);

  if (slides.length === 0) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  const activeSlide = slides[current];

  return (
    <main className="min-h-screen bg-[#ffffff] overflow-x-hidden">
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: `url('${urlFor(
              activeSlide.bannerImage
            ).url()}')`,
          }}
        />

        <div
          className={`absolute inset-0 ${
            activeSlide.theme === "light"
              ? "bg-black/10"
              : "bg-black/50"
          }`}
        />

        <div className="hero-content relative z-10 text-center px-6 max-w-4xl">
          <span
            className={`inline-block py-1 px-3 border uppercase tracking-[0.3em] text-[10px] md:text-xs mb-8 backdrop-blur-sm ${
              activeSlide.theme === "light"
                ? "border-black/20 text-black"
                : "border-white/20 text-white"
            }`}
          >
            New Collection 2026
          </span>

              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.9] mb-8 uppercase max-w-3xl mx-auto ${
              activeSlide.theme === "light"
                ? "text-black"
                : "text-white"
            }`}
          >
            {activeSlide.heading}
          </h1>
          

          <p
            className={`text-base md:text-lg font-light max-w-xl mx-auto mb-12 tracking-wide leading-relaxed ${
              activeSlide.theme === "light"
                ? "text-gray-700"
                : "text-gray-300"
            }`}
          >
            {activeSlide.subHeading}
          </p>

          <Link
            href={activeSlide.buttonUrl}
            className={`inline-block border px-12 py-4 text-sm uppercase tracking-widest transition-all duration-500 ${
              activeSlide.theme === "light"
                ? "border-black text-black hover:bg-black hover:text-white"
                : "border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            {activeSlide.buttonText}
          </Link>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
    
       <section className="max-w-[1500px] mx-auto px-6 pt-40 pb-28 bg-[radial-gradient(circle_at_top,_#cfbccd,_#f5f5f5,_#dcdfe8)]">
        <div className="text-center mb-20">
          
          <p className="uppercase tracking-[0.4em] text-gray-500 text-sm mb-4">
            Latest Collection
          </p>

          <h2 className="text-4xl md:text-6xl font-black">
            New Arrivals
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => {
            const productImg = product.mainImage
              ? urlFor(product.mainImage).url()
              : "https://via.placeholder.com/500x600";

            return (
              <div key={product._id} className="group">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative overflow-hidden rounded-3xl bg-[#f5f5f5] aspect-[4/5]">
                    <img
                      src={productImg}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {product.compareAtPrice && (
                      <span className="absolute top-4 left-4 bg-black text-white px-3 py-1 rounded-full text-xs">
                        SALE
                      </span>
                    )}

                    <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <div className="bg-white rounded-full py-3 text-center text-sm font-medium shadow-lg">
                        View Product
                      </div>
                    </div>
                  </div>

                  <div className="pt-5">
                    <h3 className="font-semibold text-lg">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2">
                      <span className="font-bold text-lg">
                        ${product.price}
                      </span>

                      {product.compareAtPrice && (
                        <span className="text-gray-400 line-through">
                          ${product.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}