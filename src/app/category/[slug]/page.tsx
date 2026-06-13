import { client } from "@/sanity/lib/client";
import CategoryProductsContainer from "./CategoryProductsContainer";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getCategoryData(slug: string) {
  const query = `*[_type == "product" && $slug in categories[]->slug.current] {
    _id,
    name,
    price,
    compareAtPrice,
    slug,
    mainImage,
    "categories": categories[]->title
  }`;
  
  const rawProducts = await client.fetch(query, { slug }, { cache: 'no-store' });

  // Agar products nahi mile, toh empty array return karein
  if (!rawProducts || rawProducts.length === 0) return [];

  return rawProducts.map((product: any) => ({
    ...product,
    // Optional chaining se error nahi aayega agar categories missing ho
    subCategory: product.categories?.[0] || "Others", 
  }));
}

export default async function CategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const currentSlug = resolvedParams.slug; 

  // Agar route "about" ya "contact" hai, toh direct return null ya 404
  if (['about', 'contact'].includes(currentSlug)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-xl font-light">Page not found in collection.</h2>
      </div>
    );
  }

  const products = await getCategoryData(currentSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-white text-zinc-900">
      
      {/* HEADER SECTION */}
      <div className="mb-12 mt-4 border-b border-zinc-100 pb-6">
        <h1 className="text-sm font-bold uppercase tracking-[0.2em] text-zinc-400">
          Collection
        </h1>
        <h2 className="text-3xl font-black uppercase tracking-tight text-black mt-1 capitalize">
          {currentSlug.replace("-", " ")}
        </h2>
      </div>

      {/* Conditional Rendering: Agar products nahi hain toh message dikhayein */}
      {products.length > 0 ? (
        <CategoryProductsContainer initialProducts={products} />
      ) : (
        <div className="text-center py-20">
          <p className="text-zinc-500">No products found in this category.</p>
        </div>
      )}

    </div>
  );
}