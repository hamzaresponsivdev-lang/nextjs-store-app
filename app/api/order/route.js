import mongoose from "mongoose";
import connectDB from "@/app/lib/db";
import Order from "@/models/Order";
import Product from "@/models/products";

export async function POST(request) {
  let details;
  try {
    details = await request.json();
  } catch {
    return Response.json({ error: "Invalid order details." }, { status: 400 });
  }

  const { productId, quantity, userName, userEmail, userPhone, userAddress } =
    details || {};
  const normalizedName = typeof userName === "string" ? userName.trim() : "";
  const normalizedEmail = typeof userEmail === "string" ? userEmail.trim() : "";
  const normalizedPhone = typeof userPhone === "string" ? userPhone.trim() : "";
  const normalizedAddress =
    typeof userAddress === "string" ? userAddress.trim() : "";

  if (
    !mongoose.isObjectIdOrHexString(productId) ||
    !normalizedName ||
    normalizedName.length > 120 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedEmail.length > 254 ||
    !/^[0-9+()\s-]{7,24}$/.test(normalizedPhone) ||
    !normalizedAddress ||
    normalizedAddress.length > 500 ||
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 99
  ) {
    return Response.json(
      { error: "Please check the order details and try again." },
      { status: 400 },
    );
  }

  try {
    await connectDB();
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return Response.json(
        { error: "This product is no longer available." },
        { status: 404 },
      );
    }

    const order = await Order.create({
      userName: normalizedName,
      userEmail: normalizedEmail,
      userPhone: normalizedPhone,
      userAddress: normalizedAddress,
      products: [{ product: productId, quantity }],
    });

    return Response.json({ orderId: String(order._id) }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return Response.json(
      { error: "We couldn't save your order. Please try again." },
      { status: 500 },
    );
  }
}
