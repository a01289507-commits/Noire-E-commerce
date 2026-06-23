import { client } from "@/sanity/lib/client";
import { Mail, Phone, MapPin } from "lucide-react";

async function getContactData() {
  return await client.fetch(`*[_type == "contactPage"][0]`);
}

export default async function ContactPage() {
  const data = await getContactData();

  return (
   <div className="bg-gradient-to-b from-white to-[#F1EFE9] border-t border-zinc-200 ">
   <main className="max-w-7xl mx-auto px-6 py-12 text-zinc-900 w-full">
  
      <div className="grid md:grid-cols-2 gap-20">
        
        {/* Left: Contact Details */}
        <section className="space-y-12">
          <div>
            <h1 className="text-5xl font-light uppercase tracking-widest mb-6">{data?.title || "Get In Touch"}</h1>
            <p className="text-zinc-500 leading-relaxed max-w-sm">{data?.description}</p>
          </div>

          <div className="space-y-6">
            <p className="text-sm uppercase tracking-widest text-zinc-400 mb-4">Direct Contact</p>
            
            <a href={`mailto:${data?.email}`} className="flex items-center gap-4 text-lg hover:text-zinc-500 transition-colors">
              <Mail className="w-5 h-5 text-zinc-400" />
              {data?.email}
            </a>
            
            <a href={`tel:${data?.phone}`} className="flex items-center gap-4 text-lg hover:text-zinc-500 transition-colors">
              <Phone className="w-5 h-5 text-zinc-400" />
              {data?.phone}
            </a>
            
            <div className="flex items-start gap-4 text-zinc-600">
              <MapPin className="w-5 h-5 text-zinc-400 mt-1" />
              <p className="max-w-[250px]">{data?.address}</p>
            </div>
          </div>
        </section>

        {/* Right: Contact Form (Connect with Formspree) */}
        <section className="bg-[#a68a64] p-10 border border-zinc-100 rounded-3xl">
          <form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST" className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-medium">Name</label>
              <input type="text" name="name" required className="w-full bg-white border border-zinc-200 p-3 focus:outline-none focus:border-zinc-900" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-medium">Email</label>
              <input type="email" name="email" required className="w-full bg-white border border-zinc-200 p-3 focus:outline-none focus:border-zinc-900" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 font-medium">Message</label>
              <textarea name="message" rows={4} required className="w-full bg-white border border-zinc-200 p-3 focus:outline-none focus:border-zinc-900"></textarea>
            </div>
            <button type="submit" className="w-full bg-zinc-900 text-white py-4 uppercase tracking-widest text-sm hover:bg-black transition-all">
              Send Message
            </button>
          </form>
        </section>
      </div>

      {/* Map Section */}
      <section className="mt-20">
        <div className="w-full h-[450px] bg-zinc-100 grayscale hover:grayscale-0 transition-all duration-700 border border-zinc-200 p-1">
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.5234!2d74.3436!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEzLjQiTiA3NMKwMjAnMzcuMCJF!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen={true} 
             loading="lazy"
           />
        </div>
      </section>
    </main>
    </div>
  );
}