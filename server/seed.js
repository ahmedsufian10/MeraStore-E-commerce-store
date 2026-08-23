require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Wearables', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=84' },
  { name: 'Audio', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=84' },
  { name: 'Workspace', image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=84' },
  { name: 'Cameras', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=84' },
  { name: 'Mobile', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=84' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=84' }
];

const productSeed = [
  ['Orbit Chronograph', 'A measured everyday chronograph with a quiet profile, tactile crown, and a brushed steel case made for long days.', 229, 189, 'Wearables', 12, true, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=84'],
  ['Studio One Headphones', 'Balanced sound, soft memory foam, and a calm matte finish give these wireless headphones a considered studio feel.', 159, 129, 'Audio', 8, true, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=84'],
  ['Pixel Frame Camera', 'A compact mirrorless camera for bright street frames, unhurried weekend trips, and the images worth keeping.', 629, 549, 'Cameras', 5, true, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=84'],
  ['Signal Pro Phone', 'A polished everyday phone with a bright display, generous battery, and a camera system tuned for natural color.', 799, null, 'Mobile', 7, true, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=84'],
  ['Haze Desk Lamp', 'A warm, low-profile desk lamp with a weighted base and just enough glow for a focused evening at your desk.', 108, 88, 'Workspace', 16, true, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=84'],
  ['Atlas Laptop Stand', 'A solid aluminum stand that lifts your screen into a more comfortable line of sight without crowding your desk.', 94, null, 'Workspace', 14, false, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=84'],
  ['Field Notes Tablet Sleeve', 'Soft felt, clean seams, and a snug magnetic closure make this a quiet companion for your tablet and notebook.', 72, null, 'Accessories', 11, false, 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=84'],
  ['Sprint Runner Earbuds', 'Small, secure, and ready for the commute, with clear calls, a compact case, and a little more calm in your day.', 179, 149, 'Audio', 10, false, 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1200&q=84']
];

async function seed() {
  await connectDB();
  const categoryDocuments = await Promise.all(categories.map((category) => {
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return Category.findOneAndUpdate(
      { slug },
      { ...category, slug },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }));
  const savedCategories = categoryDocuments;
  const categoryMap = new Map(savedCategories.map((category) => [category.name, category._id]));
  await Promise.all(productSeed.map(([name, description, price, discountPrice, category, stock, isFeatured, image]) => Product.findOneAndUpdate(
    { name },
    { name, description, price, discountPrice, category: categoryMap.get(category), stock, isFeatured, images: [image] },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )));
  const existingAdmin = await User.findOne({ email: 'admin@merastore.com' });
  if (!existingAdmin) {
    await User.create({ name: 'Mera Store Admin', email: 'admin@merastore.com', password: 'MeraStoreAdmin123!', role: 'admin' });
  }
  console.log('Mera Store seed complete');
  process.exit(0);
}

seed().catch((error) => { console.error(error); process.exit(1); });
