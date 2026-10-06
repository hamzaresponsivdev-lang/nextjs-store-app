"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const fieldClassName =
  "mt-2 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100";
const fallbackImage =
  "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80";

export default function CheckoutPage() {
  const { id: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageSource, setImageSource] = useState(fallbackImage);

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      try {
        const response = await fetch("/api/product");
        if (!response.ok) throw new Error("We couldn't load this product.");
        const products = await response.json();
        const selectedProduct = products.find(
          (item) => String(item._id) === String(productId),
        );
        if (!selectedProduct) throw new Error("This product is unavailable.");
        if (isActive) {
          setProduct(selectedProduct);
          setImageSource(selectedProduct.image || fallbackImage);
        }
      } catch (loadError) {
        if (isActive) setError(loadError.message);
      } finally {
        if (isActive) setIsLoadingProduct(false);
      }
    }

    loadProduct();
    return () => {
      isActive = false;
    };
  }, [productId]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const orderDetails = {
      productId,
      quantity: Number(quantity),
      userName: formData.get("name"),
      userEmail: formData.get("email"),
      userPhone: formData.get("phone"),
      userAddress: formData.get("address"),
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to place your order.");
      setOrderId(result.orderId);
    } catch (submitError) {
      setError(submitError.message || "Unable to place your order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const unitPrice = Number(product?.price || 0);

  return (
    <main className="min-h-screen bg-[#f5f7f8] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
          <Link
            href="/"
            className="font-serif text-xl font-semibold text-slate-950"
          >
            The Prime Collection
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-sky-700"
          >
            Continue shopping
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 lg:px-8 lg:pt-14">
        <div className="mb-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-700">
            Secure checkout
          </p>
          <h1 className="mt-2 font-serif text-4xl text-slate-950">
            Your order
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Add your contact and delivery details to place your order.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16">
          <section aria-labelledby="details-heading">
            <h2
              id="details-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Customer details
            </h2>

            {orderId ? (
              <div
                className="mt-6 border-l-4 border-emerald-600 bg-emerald-50 p-5"
                role="status"
              >
                <h3 className="font-semibold text-emerald-950">Order placed</h3>
                <p className="mt-1 text-sm leading-6 text-emerald-900">
                  Thank you. Your order reference is{" "}
                  <span className="font-semibold">{orderId}</span>.
                </p>
              </div>
            ) : (
              <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-slate-700"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    className={fieldClassName}
                    placeholder="Jamie Morgan"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={254}
                      className={fieldClassName}
                      placeholder="jamie@example.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-slate-700"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      maxLength={24}
                      className={fieldClassName}
                      placeholder="+1 555 010 2040"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="text-sm font-medium text-slate-700"
                  >
                    Delivery address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    autoComplete="street-address"
                    required
                    maxLength={500}
                    rows={3}
                    className={`${fieldClassName} resize-y`}
                    placeholder="Street, city, postal code, country"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-700" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingProduct || !product}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-52"
                >
                  {isSubmitting ? "Placing order..." : "Place order"}
                </button>
              </form>
            )}
          </section>

          <aside className="h-fit border-t border-slate-300 pt-6 lg:border-l lg:border-t-0 lg:pl-8">
            <h2 className="text-lg font-semibold text-slate-900">
              Order summary
            </h2>
            {isLoadingProduct ? (
              <p className="mt-5 text-sm text-slate-500" role="status">
                Loading product...
              </p>
            ) : product ? (
              <div className="mt-5">
                <div className="flex gap-4">
                  <Image
                    src={imageSource}
                    alt={product.title}
                    width={96}
                    height={96}
                    loading="eager"
                    unoptimized
                    onError={() => setImageSource(fallbackImage)}
                    className="size-24 shrink-0 rounded-lg bg-slate-100 object-cover"
                  />
                  <div className="min-w-0 py-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
                      {product.category}
                    </p>
                    <h3 className="mt-1 font-semibold text-slate-900">
                      {product.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      ${unitPrice.toFixed(2)} each
                    </p>
                  </div>
                </div>

                <div className="mt-7 flex items-center justify-between gap-4 border-b border-slate-200 pb-5">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-slate-700"
                  >
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="99"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(
                        Math.min(
                          99,
                          Math.max(1, Number(event.target.value) || 1),
                        ),
                      )
                    }
                    className="w-20 rounded-lg border border-slate-300 bg-white px-3 py-2 text-center text-sm outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>

                <div className="flex items-center justify-between pt-5">
                  <span className="text-sm font-medium text-slate-600">
                    Total
                  </span>
                  <span className="text-xl font-bold text-slate-950">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="mt-5 text-sm text-slate-500">
                Product details are unavailable.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
