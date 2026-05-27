require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const categoryData = [
  {
    name: 'Điện thoại di động',
    image: 'https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp',
    description: 'Điện thoại thông minh chính hãng từ Apple, Samsung, Xiaomi, Oppo, Sony. Đa dạng phân khúc từ phổ thông đến cao cấp.'
  },
  {
    name: 'Laptop & Macbook',
    image: 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp',
    description: 'Laptop, MacBook cho học tập, làm việc, gaming từ Apple, Dell, Asus, HP. Hiệu năng mạnh mẽ, thiết kế mỏng nhẹ cao cấp.'
  },
  {
    name: 'Máy tính bảng',
    image: 'https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp',
    description: 'iPad, Samsung Galaxy Tab, Xiaomi Pad - màn hình lớn, pin bền, phù hợp giải trí và làm việc mọi lúc mọi nơi.'
  },
  {
    name: 'Đồng hồ thông minh',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp',
    description: 'Apple Watch, Samsung Galaxy Watch theo dõi sức khỏe toàn diện: nhịp tim, SpO2, GPS, thông báo thông minh.'
  },
  {
    name: 'Tai nghe & Loa',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp',
    description: 'AirPods, Sony WH/WF, JBL, Samsung Buds - chống ồn chủ động, âm thanh Hi-Res, kết nối không dây mượt mà.'
  },
  {
    name: 'Phụ kiện',
    image: 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/1.webp',
    description: 'Sạc nhanh, cáp, bút stylus, chuột, bàn phím và các phụ kiện chính hãng hỗ trợ thiết bị của bạn tốt nhất.'
  },
];

async function updateCategories() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected!');
  for (const cat of categoryData) {
    const result = await Category.updateOne(
      { name: cat.name },
      { $set: { image: cat.image, description: cat.description } }
    );
    console.log('Updated:', cat.name, '- matched:', result.matchedCount, '- modified:', result.modifiedCount);
  }
  console.log('Done!');
  process.exit(0);
}
updateCategories().catch(e => { console.error(e.message); process.exit(1); });
