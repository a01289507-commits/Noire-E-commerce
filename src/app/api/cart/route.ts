import { writeClient } from "@/src/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client"; // read ke liye
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { productId, name, price, size, quantity, image, token } = await req.json();


    if (!productId || !name || !price) {
      return NextResponse.json(
        { success: false, message: "productId, name aur price required hain" },
        { status: 400 }
      );
    }

    // ✅ Check — normal client se (read only)
    const existing = await client.fetch(
      `*[_type == "cart" && productId == $productId && token == $token][0]._id`,
      { productId, token: token || "guest" } as any
    );

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Product already in cart" },
        { status: 409 }
      );
    }

    // ✅ Create — writeClient se (write permission)
    const doc = await writeClient.create({
      _type: "cart",
      productId,
      name,
      price,
      size: size || "M",
      quantity: quantity || 1,
      image: image || "",
      token: token || "guest",
    });

    return NextResponse.json(
      { success: true, message: "Cart mein add ho gaya!", data: doc },
      { status: 201 }
    );

  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}