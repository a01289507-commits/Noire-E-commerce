import { writeClient } from "@/src/sanity/lib/writeClient";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false }, { status: 400 });
    await writeClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}