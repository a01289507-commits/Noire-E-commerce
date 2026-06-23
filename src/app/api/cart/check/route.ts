import { client } from "../../../../sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const token = searchParams.get("token");

    // ✅ Validation
    if (!productId || !token) {
      return NextResponse.json(
        { exists: false, message: "productId aur token required hain" },
        { status: 400 }
      );
    }

    // ✅ Sanity mein check karo
   const existing = await client.fetch(
  `*[_type == "cart" && productId == $productId && token == $token][0]._id`,
  { productId, token } as any
);

    return NextResponse.json({ exists: !!existing });

  } catch (error) {
    console.error("Cart check error:", error);
    return NextResponse.json(
      { exists: false, message: "Server error" },
      { status: 500 }
    );
  }
}