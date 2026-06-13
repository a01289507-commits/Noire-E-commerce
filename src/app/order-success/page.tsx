import Link from "next/link";

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-3">
          Order Placed!
        </h1>
        <p className="text-zinc-500 mb-2">Shukriya aapke order ke liye!</p>
        <div className="bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 mb-8">
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">
            Order Number
          </p>
          <p className="text-xl font-black text-black">{searchParams.order}</p>
        </div>
        <p className="text-sm text-zinc-400 mb-8">
          Hum jald hi aapse rabta karenge delivery ke liye.
        </p>
        <Link
          href="/"
          className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-zinc-800 transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}