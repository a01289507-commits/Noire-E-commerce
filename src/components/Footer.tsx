import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#1182af] to-[#102b36] border-t border-white/10 pt-20 pb-10 text-white">
      {/* Container ko restrict kiya hai taaki content screen ke edges se chipka na rahe */}
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Grid layout jo content ko center mein rakhega */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Left: Brand Column (Fixed width look) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-[0.2em] uppercase">NOIRÉ</h2>
            <p className="text-blue-100/70 text-sm leading-relaxed max-w-xs">
              Defining the essence of modern luxury. Curating timeless scents and essentials for the refined individual.
            </p>
          </div>

          {/* Right: Links (Aligned to specific area) */}
          <div className="md:justify-self-end">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-white/50">Explore</h3>
            <ul className="space-y-4 text-sm text-blue-50">
              <li><Link href="/category/women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/category/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Ab ye content ke width ke saath align hoga */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-blue-200/50">
          <p>© 2026 NOIRÉ. All Rights Reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Instagram</Link>
            <Link href="#" className="hover:text-white transition-colors">Pinterest</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}