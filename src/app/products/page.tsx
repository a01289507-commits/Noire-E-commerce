import { client } from "@/sanity/lib/client";
import Link from "next/link";

// Query: Bina kisi filter ke SARI products mangwa rhe hain
async function getAllProducts() {
  const query = `*[_type == "product"] {
    _id,
    name,
    price,
    compareAtPrice,
    slug,
    "imageUrl": mainImage.asset->url
  }`;
  return await client.fetch(query);
}

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className="text-3xl font-black uppercase tracking-wider text-center mb-12">
          Full Collection ({products.length})
        </h1>

        {/* Grid System: Yahan SAB categories sath dikhengi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm group">
              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-100">
                <img 
                  src={product.imageUrl || "https://via.placeholder.com/600x800"} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="font-bold text-lg mt-4 text-zinc-900 uppercase tracking-tight line-clamp-1">{product.name}</h3>
              <p className="text-zinc-600 font-medium">${product.price}</p>
              
              <Link 
                href={`/product/${product.slug?.current}`}
                className="mt-4 block text-center bg-zinc-950 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wider"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}