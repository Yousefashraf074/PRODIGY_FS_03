const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

const products = [
  // ── Electronics ──────────────────────────────────────────
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality over-ear wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Electronics',
    stock: 50,
  },
  {
    name: 'Smart Watch',
    description: 'Feature-packed smartwatch with heart rate monitor, GPS tracking, sleep analysis, and 7-day battery life.',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Electronics',
    stock: 30,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI. Silent click technology. Compatible with all devices.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    category: 'Electronics',
    stock: 80,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360° sound, 20-hour battery life, and built-in microphone for calls.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    category: 'Electronics',
    stock: 60,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX Blue switches. Full-size layout with detachable USB-C cable.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500',
    category: 'Electronics',
    stock: 45,
  },
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with active noise cancellation, transparency mode, and 8-hour battery life per charge.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500',
    category: 'Electronics',
    stock: 70,
  },
  {
    name: 'USB-C Hub Adapter',
    description: '7-in-1 USB-C hub with HDMI 4K, USB 3.0 ports, SD card reader, and 100W power delivery pass-through.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=500',
    category: 'Electronics',
    stock: 90,
  },
  {
    name: 'Webcam HD 1080p',
    description: 'Full HD webcam with auto-focus, built-in stereo microphone, and wide-angle lens for video calls.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500',
    category: 'Electronics',
    stock: 40,
  },

  // ── Clothing ─────────────────────────────────────────────
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors. Perfect for everyday wear.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    category: 'Clothing',
    stock: 100,
  },
  {
    name: 'Denim Jacket',
    description: 'Classic denim jacket with a modern fit. Made from premium selvedge denim with brass button closures.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500',
    category: 'Clothing',
    stock: 35,
  },
  {
    name: 'Linen Summer Shirt',
    description: 'Breathable linen button-down shirt, perfect for warm weather. Relaxed fit with a mandarin collar.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
    category: 'Clothing',
    stock: 55,
  },
  {
    name: 'Wool Beanie',
    description: 'Soft merino wool beanie hat. Warm, lightweight, and available in 6 colors. One size fits most.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500',
    category: 'Clothing',
    stock: 120,
  },
  {
    name: 'Slim Fit Chinos',
    description: 'Stretch cotton chinos with a slim, tailored fit. Comfortable enough for all-day wear.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
    category: 'Clothing',
    stock: 65,
  },
  {
    name: 'Hoodie Sweatshirt',
    description: 'Heavyweight cotton-blend hoodie with kangaroo pocket. Soft fleece interior for maximum warmth.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500',
    category: 'Clothing',
    stock: 80,
  },
  {
    name: 'Printed Maxi Dress',
    description: 'Flowy maxi dress with a vibrant floral print. Adjustable straps and side pockets.',
    price: 64.99,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
    category: 'Clothing',
    stock: 40,
  },
  {
    name: 'Leather Belt',
    description: 'Genuine full-grain leather belt with a brushed nickel buckle. Classic design for formal or casual wear.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=500',
    category: 'Clothing',
    stock: 70,
  },

  // ── Home & Kitchen ───────────────────────────────────────
  {
    name: 'Stainless Steel Water Bottle',
    description: 'Double-wall vacuum insulated water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
    category: 'Home & Kitchen',
    stock: 75,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic coffee mugs. Microwave and dishwasher safe. Holds 12oz each.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    category: 'Home & Kitchen',
    stock: 45,
  },
  {
    name: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness and color temperature. USB charging port. Touch control.',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500',
    category: 'Home & Kitchen',
    stock: 25,
  },
  {
    name: 'Cast Iron Skillet',
    description: 'Pre-seasoned 12-inch cast iron skillet. Oven safe up to 500°F. Perfect for searing, baking, and frying.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
    category: 'Home & Kitchen',
    stock: 30,
  },
  {
    name: 'Scented Candle Set',
    description: 'Set of 3 hand-poured soy wax candles in lavender, vanilla, and ocean breeze. 40-hour burn time each.',
    price: 27.99,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500',
    category: 'Home & Kitchen',
    stock: 90,
  },
  {
    name: 'Bamboo Cutting Board',
    description: 'Extra-large organic bamboo cutting board with juice grooves and easy-grip handles. Knife-friendly surface.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1594226801341-41427b4e5c22?w=500',
    category: 'Home & Kitchen',
    stock: 50,
  },
  {
    name: 'Indoor Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots with bamboo saucers. Perfect for succulents and herbs.',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500',
    category: 'Home & Kitchen',
    stock: 55,
  },
  {
    name: 'French Press Coffee Maker',
    description: 'Borosilicate glass French press with stainless steel filter. Brews 34oz of rich, full-bodied coffee.',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500',
    category: 'Home & Kitchen',
    stock: 40,
  },

  // ── Sports ───────────────────────────────────────────────
  {
    name: 'Running Shoes',
    description: 'Lightweight and responsive running shoes with cushioned sole. Perfect for daily training and long-distance runs.',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    category: 'Sports',
    stock: 40,
  },
  {
    name: 'Yoga Mat',
    description: 'Premium non-slip yoga mat with alignment lines. Extra thick for comfort. Includes carrying strap.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
    category: 'Sports',
    stock: 55,
  },
  {
    name: 'Resistance Bands Set',
    description: 'Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and carry bag.',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1598632640487-6ea4a4e8b963?w=500',
    category: 'Sports',
    stock: 100,
  },
  {
    name: 'Foam Roller',
    description: 'High-density EVA foam roller for deep tissue massage and muscle recovery. 18-inch length.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
    category: 'Sports',
    stock: 60,
  },
  {
    name: 'Jump Rope',
    description: 'Adjustable speed jump rope with ball-bearing handles. Tangle-free steel cable with PVC coating.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1517130038641-a774d04afb3c?w=500',
    category: 'Sports',
    stock: 85,
  },
  {
    name: 'Dumbbell Set',
    description: 'Pair of neoprene-coated dumbbells. Anti-roll design. Available in 5lb, 10lb, and 15lb weights.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500',
    category: 'Sports',
    stock: 50,
  },
  {
    name: 'Sports Water Bottle',
    description: 'Squeeze sports bottle with flip-top lid and measurement markings. Leak-proof and dishwasher safe. 32oz.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500',
    category: 'Sports',
    stock: 110,
  },
  {
    name: 'Gym Bag',
    description: 'Spacious gym duffel bag with separate shoe compartment, wet pocket, and adjustable shoulder strap.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Sports',
    stock: 45,
  },

  // ── Accessories ──────────────────────────────────────────
  {
    name: 'Leather Wallet',
    description: 'Genuine leather bifold wallet with RFID blocking technology. Slim design with multiple card slots.',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500',
    category: 'Accessories',
    stock: 60,
  },
  {
    name: 'Backpack',
    description: 'Durable and water-resistant backpack with laptop compartment. Perfect for work, travel, or school.',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 35,
  },
  {
    name: 'Sunglasses',
    description: 'Polarized UV400 sunglasses with lightweight titanium frame. Includes hard-shell carrying case.',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Accessories',
    stock: 65,
  },
  {
    name: 'Canvas Tote Bag',
    description: 'Heavy-duty organic canvas tote bag with inner pocket. Perfect for shopping, books, or everyday carry.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
    category: 'Accessories',
    stock: 95,
  },
  {
    name: 'Minimalist Watch',
    description: 'Sleek analog watch with genuine leather strap and sapphire crystal glass. Japanese quartz movement.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
    category: 'Accessories',
    stock: 30,
  },
  {
    name: 'Phone Case',
    description: 'Shockproof silicone phone case with textured grip. Slim profile with raised edges for screen protection.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    category: 'Accessories',
    stock: 150,
  },
  {
    name: 'Silk Scarf',
    description: 'Luxurious 100% mulberry silk scarf with hand-rolled edges. Versatile print, perfect for any occasion.',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1601370690183-1c7796ecec61?w=500',
    category: 'Accessories',
    stock: 40,
  },
  {
    name: 'Travel Organizer',
    description: 'Compact travel organizer pouch for cables, chargers, and tech accessories. Multiple elastic loops and pockets.',
    price: 22.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
    category: 'Accessories',
    stock: 70,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@localstore.com' },
    update: {},
    create: {
      email: 'admin@localstore.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create demo customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      name: 'Demo Customer',
      role: 'CUSTOMER',
    },
  });

  // Clear existing products and seed fresh
  await prisma.review.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
