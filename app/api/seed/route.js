import connectDB from "@/app/lib/db";
import Product from "@/models/products";

export async function GET(req) {
  await connectDB();
  await Product.deleteMany();

  const rawProducts = [
    {
      title: "Air Max Runner",
      description:
        "Lightweight everyday running shoe with responsive cushioning and breathable mesh for all-day comfort.",
      price: 89.99,
      category: "Footwear",
      image: "/AirMax.jpg",
    },
    {
      title: "Classic Leather Sneaker",
      description:
        "Premium leather sneaker built for a smart casual look with everyday support and durable soles.",
      price: 94.99,
      category: "Footwear",
      image: "/LeatherS.jpg",
    },
    {
      title: "Trail Hiking Boot",
      description:
        "Rugged waterproof boot with grippy traction and reinforced protection for outdoor adventures.",
      price: 119.99,
      category: "Footwear",
      image: "/Hiking.jpg",
    },
    {
      title: "Ultra Flex Court Shoe",
      description:
        "Flexible training sneaker designed for quick movement, comfort, and reliable grip on indoor surfaces.",
      price: 74.99,
      category: "Footwear",
      image: "/CourtShoe.jpg",
    },
    {
      title: "City Slip-On",
      description:
        "Modern slip-on shoe offering soft cushioning, a sleek silhouette, and easy daily wear.",
      price: 69.99,
      category: "Footwear",
      image: "/CityS.jpg",
    },
    {
      title: "Performance Tennis Shoe",
      description:
        "Responsive tennis sneaker with breathable support, stable sides, and shock-absorbing comfort.",
      price: 99.99,
      category: "Footwear",
      image: "/TennisS.jpg",
    },
    {
      title: "Commuter Leather Loafer",
      description:
        "Polished loafer with premium finish, soft insole, and refined style for work or travel.",
      price: 109.99,
      category: "Footwear",
      image: "/Loafer.jpg",
    },
    {
      title: "Urban Skate Shoe",
      description:
        "Canvas-inspired skate shoe with a relaxed fit, durable sole, and street-ready finish.",
      price: 79.99,
      category: "Footwear",
      image: "/Urban.jpg",
    },
    {
      title: "Winter Snow Boot",
      description:
        "Warm insulated boot with moisture protection and traction for cold, slippery conditions.",
      price: 129.99,
      category: "Footwear",
      image: "/Snow.jpg",
    },
    {
      title: "Minimal Runner Pro",
      description:
        "Built for smooth motion and lightweight support, this runner delivers an agile feel for everyday training.",
      price: 84.99,
      category: "Footwear",
      image: "/Runing.jpg",
    },
    {
      title: "Classic White Shirt",
      description:
        "Crisp cotton shirt with a clean tailored fit and versatile styling for office, travel, and workwear.",
      price: 39.99,
      category: "Clothing",
      image: "/WhiteShirt.jpg",
    },
    {
      title: "Oxford Button Down",
      description:
        "Structured Oxford shirt with soft fabric and a confident collar that works from casual to smart casual.",
      price: 49.99,
      category: "Clothing",
      image: "/Overshirt.jpg",
    },
    {
      title: "Cotton Polo Shirt",
      description:
        "Comfortable polo shirt in breathable cotton with a polished look for daily wear and layering.",
      price: 34.99,
      category: "Clothing",
      image: "/Polo.jpg",
    },
    {
      title: "Relaxed Denim Jacket",
      description:
        "Modern denim jacket with a relaxed fit, sturdy construction, and a timeless casual appearance.",
      price: 79.99,
      category: "Clothing",
      image: "/Denim.jpg",
    },
    {
      title: "Soft Knit Crewneck",
      description:
        "Everyday crewneck knit designed for comfort, layering, and a minimal modern silhouette.",
      price: 29.99,
      category: "Clothing",
      image: "/Crewneck.jpg",
    },
    {
      title: "Slim Fit Chino Pants",
      description:
        "Tailored chinos with a comfortable stretch finish, ideal for smart casual styling and all-day wear.",
      price: 54.99,
      category: "Clothing",
      image: "/Chinos.jpg",
    },
    {
      title: "Lightweight Hoodie",
      description:
        "Soft fleece hoodie with a relaxed fit and practical pocket storage for daily comfort.",
      price: 44.99,
      category: "Clothing",
      image: "/Hoodie.jpg",
    },
    {
      title: "Classic Crew Sweatshirt",
      description:
        "Heavier cotton sweatshirt built for easy layering with warmth, softness, and timeless appeal.",
      price: 42.99,
      category: "Clothing",
      image: "/Sweatshirt.jpg",
    },
    {
      title: "Stretch Cargo Pants",
      description:
        "Flexible cargo pants featuring roomy pockets and a clean shape for active everyday use.",
      price: 59.99,
      category: "Clothing",
      image: "/Cargo.jpg",
    },
    {
      title: "Overshirt Utility Jacket",
      description:
        "Versatile utility overshirt with a structured fit and durable fabric for casual workwear and travel.",
      price: 89.99,
      category: "Clothing",
      image: "/Overshirt.jpg",
    },
  ];

  const products = await Product.insertMany(rawProducts);
  return new Response(JSON.stringify(products), { status: 200 });
}
