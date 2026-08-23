const base = 'auto=format&fit=crop&w=1200&q=84';

export const demoCategories = [
  { _id: 'wearables', name: 'Wearables', slug: 'wearables', image: `https://images.unsplash.com/photo-1523275335684-37898b6baf30?${base}` },
  { _id: 'audio', name: 'Audio', slug: 'audio', image: `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?${base}` },
  { _id: 'workspace', name: 'Workspace', slug: 'workspace', image: `https://images.unsplash.com/photo-1497215842964-222b430dc094?${base}` },
  { _id: 'cameras', name: 'Cameras', slug: 'cameras', image: `https://images.unsplash.com/photo-1516035069371-29a1b244cc32?${base}` },
  { _id: 'mobile', name: 'Mobile', slug: 'mobile', image: `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?${base}` },
  { _id: 'accessories', name: 'Accessories', slug: 'accessories', image: `https://images.unsplash.com/photo-1544816155-12df9643f363?${base}` }
];

export const demoProducts = [
  { _id: 'orbit-watch', name: 'Orbit Chronograph', category: demoCategories[0], price: 229, discountPrice: 189, ratings: 4.8, numReviews: 38, stock: 12, isFeatured: true, images: [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?${base}`], description: 'A measured everyday chronograph with a quiet profile, tactile crown, and a brushed steel case made for long days.' },
  { _id: 'studio-headphones', name: 'Studio One Headphones', category: demoCategories[1], price: 159, discountPrice: 129, ratings: 4.9, numReviews: 74, stock: 8, isFeatured: true, images: [`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?${base}`], description: 'Balanced sound, soft memory foam, and a calm matte finish give these wireless headphones a considered studio feel.' },
  { _id: 'pixel-camera', name: 'Pixel Frame Camera', category: demoCategories[3], price: 629, discountPrice: 549, ratings: 4.7, numReviews: 21, stock: 5, isFeatured: true, images: [`https://images.unsplash.com/photo-1516035069371-29a1b244cc32?${base}`], description: 'A compact mirrorless camera for bright street frames, unhurried weekend trips, and the images worth keeping.' },
  { _id: 'signal-phone', name: 'Signal Pro Phone', category: demoCategories[4], price: 799, ratings: 4.6, numReviews: 19, stock: 7, isFeatured: true, images: [`https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?${base}`], description: 'A polished everyday phone with a bright display, generous battery, and a camera system tuned for natural color.' },
  { _id: 'haze-lamp', name: 'Haze Desk Lamp', category: demoCategories[2], price: 108, discountPrice: 88, ratings: 4.8, numReviews: 46, stock: 16, isFeatured: true, images: [`https://images.unsplash.com/photo-1507473885765-e6ed057f782c?${base}`], description: 'A warm, low-profile desk lamp with a weighted base and just enough glow for a focused evening at your desk.' },
  { _id: 'atlas-stand', name: 'Atlas Laptop Stand', category: demoCategories[2], price: 94, ratings: 4.5, numReviews: 32, stock: 14, images: [`https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?${base}`], description: 'A solid aluminum stand that lifts your screen into a more comfortable line of sight without crowding your desk.' },
  { _id: 'field-sleeve', name: 'Field Notes Tablet Sleeve', category: demoCategories[5], price: 72, ratings: 4.7, numReviews: 18, stock: 11, images: [`https://images.unsplash.com/photo-1544816155-12df9643f363?${base}`], description: 'Soft felt, clean seams, and a snug magnetic closure make this a quiet companion for your tablet and notebook.' },
  { _id: 'sprint-earbuds', name: 'Sprint Runner Earbuds', category: demoCategories[1], price: 179, discountPrice: 149, ratings: 4.6, numReviews: 57, stock: 10, images: [`https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?${base}`], description: 'Small, secure, and ready for the commute, with clear calls, a compact case, and a little more calm in your day.' }
];

export const demoOrders = [
  { _id: 'MER-10483', createdAt: '2026-06-06T09:00:00.000Z', status: 'Delivered', totalPrice: 249, isPaid: true, orderItems: [{ product: demoProducts[1]._id, name: demoProducts[1].name, image: demoProducts[1].images[0], price: demoProducts[1].price, quantity: 1 }] },
  { _id: 'MER-10394', createdAt: '2026-05-21T09:00:00.000Z', status: 'Shipped', totalPrice: 189, isPaid: true, orderItems: [{ product: demoProducts[0]._id, name: demoProducts[0].name, image: demoProducts[0].images[0], price: demoProducts[0].price, quantity: 1 }] }
];
