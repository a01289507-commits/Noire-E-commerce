import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@sanity/client";
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_WRITE_TOKEN!,  // ← yeh change karein
  apiVersion: "2024-01-01",
  useCdn: false,
});

export async function POST(req: NextRequest) {
  try {
    const orderDoc = await req.json();
    const result = await writeClient.create(orderDoc);
    return NextResponse.json({ success: true, id: result._id });
  } catch (error) {
    console.error("Order create error:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}