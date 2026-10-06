export const dynamic = "force-dynamic";
import connectDB from "@/app/lib/db";
import Product from "@/models/products";

export async function GET(request) {
  await connectDB();
  const product = await Product.find({});
  return new Response(JSON.stringify(product), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
