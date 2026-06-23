import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";

async function getAboutData() {
  // Sanity se About Page ka data fetch karein
  return await client.fetch(`*[_type == "aboutPage"][0]`);
}

export default async function AboutPage() {
  const data = await getAboutData();
  if (!data) return <div className="text-center py-20">Loading...</div>;

  return (
    <main className="bg-gradient-to-b from-white to-[#c2e8e9] border-t border-zinc-200 text-zinc-900 text-zinc-900 pb-20">
      {/* Editorial Hero */}
      <section className="grid md:grid-cols-12 gap-6 p-6 md:p-12 items-center">
        <div className="md:col-span-5 space-y-8">
          <h1 className="text-7xl font-serif font-medium uppercase italic">
            {data.title}
          </h1>
          <p className="text-lg leading-relaxed text-zinc-600 border-l border-zinc-900 pl-6">
            {data.missionStatement}
          </p>
        </div>
        <div className="md:col-span-7 h-[70vh] bg-zinc-100 overflow-hidden">
          <img 
            src={urlFor(data.heroImage).url()} 
            className="w-full h-full border-[12px] border-white outline outline-1 outline-zinc-200  object-cover hover:scale-105 transition-transform duration-700"
          />
        </div>
      </section>

      {/* Story Layout: Two Column */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16">
          <h2 className="text-4xl font-bold uppercase tracking-widest self-start">The Vision</h2>
          <div className="prose prose-zinc prose-lg">
            <PortableText value={data.brandStory} />
          </div>
        </div>
      </section>

      {/* Quote Layout: Full Width Feature */}
      <section className="bg-zinc-900 text-white py-32 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-3xl font-serif mb-8 italic">"{data.founderQuote?.quote}"</p>
          <span className="uppercase tracking-[0.3em] text-zinc-400 font-bold">— {data.founderQuote?.author}</span>
        </div>
      </section>
    </main>
  );
}