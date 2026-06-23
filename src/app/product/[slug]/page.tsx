import { client } from "../../../sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Link from "next/link";
import ProductImageGallery from "./ProductImageGallery";
import ProductActions from "./ProductActions"; // ✅ sirf yeh
import { Truck, RotateCcw, ShieldCheck, ArrowLeft } from "lucide-react";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

async function getProductDetails(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug][0] {
    _id,
    name,
    price,
    compareAtPrice,
    mainImage,
    gallery,
    stock,
    variants,
    "categoryId": categories[0]._ref 
  }`;
  return await client.fetch(query, { slug });
}

async function getRelatedProducts(categoryId: string, currentId: string) {
  if (!categoryId) return [];
  const query = `*[_type == "product" && references($categoryId) && _id != $currentId][0...4] {
    _id,
    name,
    price,
    slug,
    mainImage
  }`;
  return await client.fetch(query, { categoryId, currentId });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductDetails(resolvedParams.slug);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900">
        <div className="p-8 text-center bg-white rounded-3xl shadow-xl max-w-sm border border-zinc-100">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Product Not Found</h2>
          <p className="text-sm text-zinc-500 mb-6">The item you are looking for might be out of stock or removed.</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full px-5 py-3 bg-zinc-950 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const relatedProducts = await getRelatedProducts(product.categoryId, product._id);

  const mainImgUrl = product.mainImage
    ? urlFor(product.mainImage).url()
    : "https://via.placeholder.com/600x700";

  const allImages: string[] = [];
  if (product.mainImage) allImages.push(urlFor(product.mainImage).url());
  if (product.gallery?.length) {
    product.gallery.forEach((img: any) => {
      if (img) allImages.push(urlFor(img).url());
    });
  }
  if (product.variants?.length) {
    product.variants.forEach((variant: any) => {
      Object.keys(variant).forEach((key) => {
        const value = variant[key];
        if (Array.isArray(value)) {
          value.forEach((img: any) => {
            if (img?.asset || img?._type === "image") allImages.push(urlFor(img).url());
          });
        } else if (value?.asset || value?._type === "image") {
          allImages.push(urlFor(value).url());
        }
      });
    });
  }

  const uniqueImages = Array.from(new Set(allImages));
  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50/50 via-white to-zinc-50/50 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">

        {/* BREADCRUMB */}
        <div className="mb-8 lg:mb-12">
          <Link href="/" className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-950 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform" />
            Back to Collection
          </Link>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT — Images */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white p-2 sm:p-4 rounded-3xl shadow-sm border border-zinc-100">
              <ProductImageGallery
                uniqueImages={uniqueImages.length ? uniqueImages : [mainImgUrl]}
                productName={product.name}
              />
            </div>
          </div>

          {/* RIGHT — Product Info */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 flex flex-col gap-6">
            
            {/* Name */}
            <div className="space-y-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-pink-50 text-pink-600 border border-pink-100 uppercase tracking-widest">
                New Arrival
              </span>
              <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-zinc-900 uppercase">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
              <span className="text-3xl font-black text-zinc-950">${product.price}</span>
              {product.compareAtPrice && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-zinc-400 line-through">${product.compareAtPrice}</span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">
                    {discountPercentage}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* ✅ ProductActions — Size + Quantity + Add to Cart sab ek jagah */}
            <ProductActions
              productId={product._id}
              name={product.name}
              price={product.price}
              image={mainImgUrl}
            />

            {/* SPECS */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between text-sm pb-3 border-b border-zinc-100">
                <span className="text-zinc-400 font-medium inline-flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-500" /> Availability
                </span>
                <span className={`font-bold ${product.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pb-3 border-b border-zinc-100">
                <span className="text-zinc-400 font-medium inline-flex items-center gap-2">
                  <Truck className="w-4 h-4 text-zinc-500" /> Shipping
                </span>
                <span className="font-semibold text-zinc-800">Free Express Delivery</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400 font-medium inline-flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-zinc-500" /> Returns
                </span>
                <span className="font-semibold text-zinc-800">30-Day Hassle Free</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="pt-4 border-t border-zinc-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-900 mb-2">Product Details</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Premium fashion piece designed with meticulous attention to detail.
              </p>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-zinc-100">
            <h2 className="text-2xl font-black uppercase tracking-wider mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((item: any) => (
                <div key={item._id} className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm group">
                  <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                    <img
                      src={item.mainImage ? urlFor(item.mainImage).url() : "https://via.placeholder.com/600x800"}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-base mt-4 text-zinc-900 uppercase tracking-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-zinc-500 font-medium">${item.price}</p>
                  <Link
                    href={`/product/${item.slug?.current}`}
                    className="mt-4 block text-center bg-zinc-950 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

