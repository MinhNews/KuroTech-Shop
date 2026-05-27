// seedRealProducts.js
// Script tạo Category, Brand và 100 sản phẩm thật với hình ảnh thật
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Brand = require('./models/Brand');

const MONGO_URI = process.env.MONGO_URI;

// ===========================
// 1. DỮ LIỆU DANH MỤC
// ===========================
const categoriesData = [
  { name: 'Điện thoại di động' },
  { name: 'Laptop & Macbook' },
  { name: 'Máy tính bảng' },
  { name: 'Đồng hồ thông minh' },
  { name: 'Tai nghe & Loa' },
  { name: 'Phụ kiện' },
];

// ===========================
// 2. DỮ LIỆU THƯƠNG HIỆU
// ===========================
const brandsData = [
  { name: 'Apple' },
  { name: 'Samsung' },
  { name: 'Sony' },
  { name: 'Dell' },
  { name: 'Asus' },
  { name: 'HP' },
  { name: 'Xiaomi' },
  { name: 'Oppo' },
  { name: 'JBL' },
  { name: 'Logitech' },
];

// ===========================
// 3. DỮ LIỆU SẢN PHẨM THẬT
// ===========================
// image URLs từ cdn.dummyjson.com & gsmarena & apple/samsung press
const getProducts = (catMap, brandMap) => [
  // ===== ĐIỆN THOẠI DI ĐỘNG =====
  {
    name: 'iPhone 16 Pro Max 256GB',
    description: 'iPhone 16 Pro Max với chip A18 Pro mạnh mẽ, camera 48MP, màn hình 6.9 inch Super Retina XDR ProMotion 120Hz, thiết kế titanium cao cấp.',
    price: 34990000,
    stock: 25,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro-max/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro-max/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro-max/3.webp',
    ],
  },
  {
    name: 'iPhone 16 Pro 128GB',
    description: 'iPhone 16 Pro chip A18 Pro, camera 48MP, màn hình 6.3 inch Super Retina XDR, viền titanium siêu nhẹ.',
    price: 29990000,
    stock: 30,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16-pro/3.webp',
    ],
  },
  {
    name: 'iPhone 16 Plus 256GB',
    description: 'iPhone 16 Plus chip A18, pin 27 giờ nghe nhạc liên tục, màn hình 6.7 inch OLED Super Retina XDR.',
    price: 26990000,
    stock: 18,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16/3.webp',
    ],
  },
  {
    name: 'iPhone 16 128GB',
    description: 'iPhone 16 với chip A18, nút Camera Control mới, hỗ trợ Apple Intelligence, 5G siêu nhanh.',
    price: 22990000,
    stock: 40,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-16/2.webp',
    ],
  },
  {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'iPhone 15 Pro Max titanium, chip A17 Pro, camera telephoto 5x, cổng USB-C 3.0, màn hình 6.7 inch 120Hz.',
    price: 29990000,
    stock: 15,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro-max/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro-max/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro-max/3.webp',
    ],
  },
  {
    name: 'iPhone 15 Pro 128GB',
    description: 'iPhone 15 Pro chip A17 Pro, Dynamic Island, viền titanium, USB-C thế hệ mới, camera 48MP.',
    price: 25990000,
    stock: 22,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15-pro/3.webp',
    ],
  },
  {
    name: 'iPhone 15 128GB',
    description: 'iPhone 15 Dynamic Island, chip A16 Bionic, camera chính 48MP, cổng USB-C, màn hình OLED 6.1 inch.',
    price: 19990000,
    stock: 35,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-15/3.webp',
    ],
  },
  {
    name: 'iPhone 14 Pro Max 256GB',
    description: 'iPhone 14 Pro Max với Dynamic Island, Always-On Display, chip A16 Bionic, camera 48MP, pin lớn nhất lịch sử iPhone.',
    price: 24990000,
    stock: 10,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-14-pro-max/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-14-pro-max/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-14-pro-max/3.webp',
    ],
  },
  {
    name: 'iPhone 13 128GB',
    description: 'iPhone 13 chip A15 Bionic, camera kép 12MP, màn hình Super Retina XDR, 5G, pin bền cả ngày.',
    price: 15990000,
    stock: 20,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/iphone-13/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy S25 Ultra 256GB',
    description: 'Galaxy S25 Ultra chip Snapdragon 8 Elite, màn hình 6.9" Dynamic AMOLED 2X 120Hz, camera 200MP, bút S Pen tích hợp, pin 5000mAh.',
    price: 33990000,
    stock: 20,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy S25+ 256GB',
    description: 'Galaxy S25+ Snapdragon 8 Elite, màn hình 6.7" AMOLED 120Hz, ba camera sau 50MP, sạc nhanh 45W.',
    price: 27990000,
    stock: 18,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/2.webp',
    ],
  },
  {
    name: 'Samsung Galaxy S25 128GB',
    description: 'Galaxy S25 Snapdragon 8 Elite, màn hình 6.2" FHD+ AMOLED 120Hz, camera 50MP, Android 15, AI hỗ trợ thông minh.',
    price: 22990000,
    stock: 25,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Z Fold 6 256GB',
    description: 'Galaxy Z Fold 6 màn hình gập 7.6" AMOLED, chip Snapdragon 8 Gen 3, camera 50MP, chống nước IPX8, bút S Pen.',
    price: 49990000,
    stock: 8,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-fold-6/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-fold-6/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-fold-6/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Z Flip 6 256GB',
    description: 'Galaxy Z Flip 6 màn hình gập 6.7" AMOLED, chip Snapdragon 8 Gen 3, màn hình phụ 3.4 inch FlexWindow, chống nước IPX8.',
    price: 24990000,
    stock: 12,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-flip6/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-flip6/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-z-flip6/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy A55 5G 256GB',
    description: 'Galaxy A55 5G chip Exynos 1480, màn hình 6.6" Super AMOLED 120Hz, camera 50MP OIS, chống nước IP67.',
    price: 9990000,
    stock: 45,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-a55/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-a55/2.webp',
    ],
  },
  {
    name: 'Xiaomi 14 Ultra 512GB',
    description: 'Xiaomi 14 Ultra Snapdragon 8 Gen 3, hệ thống camera Leica 50MP, màn hình 6.73" AMOLED 120Hz, pin 5000mAh sạc 90W.',
    price: 27990000,
    stock: 10,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Xiaomi'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-14-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-14-ultra/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-14-ultra/3.webp',
    ],
  },
  {
    name: 'Xiaomi Redmi Note 14 Pro 256GB',
    description: 'Redmi Note 14 Pro chip MediaTek Helio G99 Ultra, màn hình 6.67" AMOLED 120Hz, camera 200MP, pin 5500mAh sạc 45W.',
    price: 7490000,
    stock: 60,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Xiaomi'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/2.webp',
    ],
  },
  {
    name: 'Oppo Find X8 Pro 256GB',
    description: 'Oppo Find X8 Pro Dimensity 9300, camera Hasselblad 50MP, màn hình 6.78" LTPO AMOLED 120Hz, pin 5910mAh sạc 80W.',
    price: 26990000,
    stock: 14,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Oppo'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-find-x8-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-find-x8-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-find-x8-pro/3.webp',
    ],
  },
  {
    name: 'Oppo Reno 12 Pro 256GB',
    description: 'Oppo Reno 12 Pro chip Dimensity 7300 Energy, camera AI 50MP, màn hình 6.7" AMOLED 120Hz, sạc SUPERVOOC 80W.',
    price: 12990000,
    stock: 28,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Oppo'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/2.webp',
    ],
  },
  {
    name: 'Sony Xperia 1 VI 256GB',
    description: 'Sony Xperia 1 VI Snapdragon 8 Gen 3, màn hình 6.5" OLED 120Hz, camera Zeiss 52MP, âm thanh 3.5mm Hi-Res Audio, pin 5000mAh.',
    price: 30990000,
    stock: 6,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Sony'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartphones/sony-xperia-1-v/1.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/sony-xperia-1-v/2.webp',
      'https://cdn.dummyjson.com/product-images/smartphones/sony-xperia-1-v/3.webp',
    ],
  },

  // ===== LAPTOP & MACBOOK =====
  {
    name: 'MacBook Pro 14" M4 Pro 24GB RAM 512GB',
    description: 'MacBook Pro 14" chip M4 Pro 12 nhân CPU 20 nhân GPU, 24GB RAM, 512GB SSD, màn hình Liquid Retina XDR 3024x1964, pin 22 giờ.',
    price: 59990000,
    stock: 10,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/3.webp',
    ],
  },
  {
    name: 'MacBook Pro 16" M4 Max 48GB RAM 1TB',
    description: 'MacBook Pro 16" chip M4 Max 16 nhân CPU 40 nhân GPU, 48GB RAM Unified Memory, 1TB SSD, màn hình Liquid Retina XDR 120Hz.',
    price: 99990000,
    stock: 5,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/2.webp',
    ],
  },
  {
    name: 'MacBook Air 13" M3 8GB RAM 256GB',
    description: 'MacBook Air 13" chip M3, 8GB Unified Memory, 256GB SSD, màn hình Liquid Retina 2560x1664, thiết kế mỏng siêu nhẹ, pin 18 giờ, không quạt tản nhiệt.',
    price: 27990000,
    stock: 20,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/3.webp',
    ],
  },
  {
    name: 'MacBook Air 15" M3 16GB RAM 512GB',
    description: 'MacBook Air 15" chip M3, 16GB Unified Memory, 512GB SSD, màn hình Liquid Retina 15.3 inch 2880x1864, pin 18 giờ.',
    price: 35990000,
    stock: 12,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/2.webp',
    ],
  },
  {
    name: 'Dell XPS 13 Plus 9320 Core i7-1360P 16GB RAM 512GB',
    description: 'Dell XPS 13 Plus thiết kế không viền, Core i7-1360P, 16GB LPDDR5 RAM, 512GB PCIe SSD, màn hình OLED 13.4" 3.5K cảm ứng, Win 11 Pro.',
    price: 42990000,
    stock: 8,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Dell'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/3.webp',
    ],
  },
  {
    name: 'Dell XPS 15 9530 Core i9-13900H 32GB RTX 4070',
    description: 'Dell XPS 15 Core i9-13900H, 32GB DDR5 RAM, RTX 4070 8GB, 1TB NVMe SSD, màn hình OLED 15.6" 3.5K 120Hz, thiết kế nhôm cao cấp.',
    price: 72990000,
    stock: 4,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Dell'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/2.webp',
    ],
  },
  {
    name: 'Asus ROG Zephyrus G14 Ryzen 9 8945HS RTX 4070',
    description: 'Asus ROG Zephyrus G14 Ryzen 9 8945HS, 32GB DDR5 RAM, RTX 4070 8GB, 1TB SSD, màn hình 14" OLED 120Hz 2880x1800, tản nhiệt Tri-Fan.',
    price: 48990000,
    stock: 6,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Asus'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/3.webp',
    ],
  },
  {
    name: 'Asus ROG Strix SCAR 18 Core i9-14900HX RTX 4090',
    description: 'Asus ROG Strix SCAR 18 Core i9-14900HX, 32GB DDR5 RAM, RTX 4090 16GB, 2TB SSD RAID, màn hình 18" QHD+ 240Hz Mini LED.',
    price: 89990000,
    stock: 3,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Asus'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/2.webp',
    ],
  },
  {
    name: 'HP Spectre x360 14" Core i7-1355U 16GB 1TB',
    description: 'HP Spectre x360 14" 2-in-1 xoay 360°, Core i7-1355U, 16GB LPDDR5 RAM, 1TB SSD, OLED 2.8K 120Hz cảm ứng, bút HP Tilt Pen.',
    price: 39990000,
    stock: 7,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['HP'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp',
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/3.webp',
    ],
  },
  {
    name: 'HP Envy 15 Core i5-1335U 16GB 512GB',
    description: 'HP Envy 15 thiết kế mỏng nhẹ, Core i5-1335U, 16GB RAM, 512GB SSD, màn hình FHD IPS 15.6" chống chói, webcam HP True Vision.',
    price: 22990000,
    stock: 15,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['HP'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp',
    ],
  },

  // ===== MÁY TÍNH BẢNG =====
  {
    name: 'iPad Pro 13" M4 WiFi 256GB',
    description: 'iPad Pro 13" chip M4, màn hình Ultra Retina XDR OLED Tandem 2752x2064 120Hz, máy tính bảng mỏng nhất thế giới 5.1mm, hỗ trợ Apple Pencil Pro.',
    price: 32990000,
    stock: 12,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-pro-m4/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-pro-m4/2.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-pro-m4/3.webp',
    ],
  },
  {
    name: 'iPad Pro 11" M4 WiFi 256GB',
    description: 'iPad Pro 11" chip M4 mạnh mẽ, màn hình OLED Ultra Retina XDR 2420x1668 120Hz, mỏng 5.3mm, camera TrueDepth 12MP.',
    price: 25990000,
    stock: 15,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-pro-m4/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-pro-m4/2.webp',
    ],
  },
  {
    name: 'iPad Air 13" M2 WiFi 128GB',
    description: 'iPad Air 13" chip M2, màn hình Liquid Retina 13 inch 2732x2048, hỗ trợ Apple Pencil Pro và Magic Keyboard, chip Neural Engine 16 lõi.',
    price: 22990000,
    stock: 18,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/2.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/3.webp',
    ],
  },
  {
    name: 'iPad 10 WiFi 64GB',
    description: 'iPad thế hệ 10 chip A14 Bionic, màn hình Liquid Retina 10.9" 2360x1640, camera trước 12MP góc siêu rộng, cổng USB-C, 5 màu sắc.',
    price: 10990000,
    stock: 30,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/2.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Tab S10 Ultra WiFi 256GB',
    description: 'Galaxy Tab S10 Ultra màn hình AMOLED 14.6" 2960x1848 120Hz, chip Snapdragon 8 Gen 3, 12GB RAM, S Pen, bộ đôi camera selfie 12MP.',
    price: 33990000,
    stock: 8,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Tab S10+ WiFi 256GB',
    description: 'Galaxy Tab S10+ AMOLED 12.4" Dynamic 120Hz, chip Snapdragon 8 Gen 3, 12GB RAM, S Pen, camera 13MP, DeX Mode.',
    price: 24990000,
    stock: 12,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp',
    ],
  },
  {
    name: 'Xiaomi Pad 7 Pro WiFi 256GB',
    description: 'Xiaomi Pad 7 Pro chip Snapdragon 8s Gen 3, màn hình 11.2" LCD 3.2K 144Hz, 12GB RAM, 256GB lưu trữ, pin 10000mAh sạc 67W.',
    price: 12490000,
    stock: 20,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Xiaomi'],
    images: [
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp',
    ],
  },

  // ===== ĐỒNG HỒ THÔNG MINH =====
  {
    name: 'Apple Watch Ultra 2 49mm Titanium',
    description: 'Apple Watch Ultra 2 vỏ titanium 49mm, màn hình Retina LTPO 2000 nit, chip S9, GPS chính xác kép, chống nước 100m, pin 60 giờ.',
    price: 21990000,
    stock: 8,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-ultra-2/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-ultra-2/2.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-ultra-2/3.webp',
    ],
  },
  {
    name: 'Apple Watch Series 10 45mm Nhôm',
    description: 'Apple Watch Series 10 màn hình lớn nhất từ trước đến nay 45mm, chip S10, mỏng nhất 9.7mm, sạc nhanh 80% trong 30 phút, phát hiện ngủ ngáy.',
    price: 11990000,
    stock: 20,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/2.webp',
    ],
  },
  {
    name: 'Apple Watch SE 40mm Nhôm',
    description: 'Apple Watch SE chip S8, màn hình Retina Always-On 40mm, phát hiện tai nạn, phát hiện sự cố, GPS, WatchOS 11.',
    price: 7490000,
    stock: 25,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/2.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Watch 7 44mm',
    description: 'Galaxy Watch 7 chip Exynos W1000 3nm, màn hình Super AMOLED 44mm, đo chỉ số sức khỏe AI, pin 40 giờ, chống nước 5ATM.',
    price: 7990000,
    stock: 18,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/2.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Watch Ultra 47mm',
    description: 'Galaxy Watch Ultra 47mm titanium, chip Exynos W1000, màn hình LTPO AMOLED 2000 nit, pin 60 giờ, chống nước 10ATM, đo SpO2 liên tục.',
    price: 14990000,
    stock: 10,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch-ultra/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch-ultra/2.webp',
    ],
  },
  {
    name: 'Xiaomi Watch S4 Sport 47mm',
    description: 'Xiaomi Watch S4 Sport màn hình AMOLED 47mm, chip Snapdragon W5 Gen 2, GPS 5 hệ thống, 150+ chế độ thể thao, pin 15 ngày, MIUI Watch.',
    price: 4490000,
    stock: 35,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Xiaomi'],
    images: [
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/1.webp',
      'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/2.webp',
    ],
  },

  // ===== TAI NGHE & LOA =====
  {
    name: 'AirPods Pro 2 (USB-C)',
    description: 'AirPods Pro thế hệ 2 cổng USB-C, chip H2, chống ồn chủ động (ANC) thế hệ 2, âm thanh Adaptive Audio thông minh, pin 30 giờ tổng.',
    price: 6490000,
    stock: 40,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/2.webp',
      'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/3.webp',
    ],
  },
  {
    name: 'AirPods 4 (ANC)',
    description: 'AirPods 4 chip H2, chống ồn chủ động, hộp sạc USB-C, cải thiện chất lượng âm thanh Personalized Spatial Audio với Dynamic Head Tracking.',
    price: 4490000,
    stock: 35,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/2.webp',
    ],
  },
  {
    name: 'Sony WH-1000XM5 Chống ồn Cao cấp',
    description: 'Sony WH-1000XM5 tai nghe over-ear, chip QN2e chống ồn 40dB, âm thanh Hi-Res 30 giờ, 8 micro AI, tự động điều chỉnh ANC, Bluetooth 5.2.',
    price: 7490000,
    stock: 20,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Sony'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/sony-wh-1000xm5/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/sony-wh-1000xm5/2.webp',
      'https://cdn.dummyjson.com/product-images/audio/sony-wh-1000xm5/3.webp',
    ],
  },
  {
    name: 'Sony WF-1000XM5 True Wireless',
    description: 'Sony WF-1000XM5 true wireless nhỏ nhất và nhẹ nhất của Sony, chip QN2e, chống ồn cao cấp, âm thanh Hi-Res Wireless LDAC, IPX4.',
    price: 5990000,
    stock: 25,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Sony'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/2.webp',
      'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/3.webp',
    ],
  },
  {
    name: 'Samsung Galaxy Buds 3 Pro',
    description: 'Galaxy Buds 3 Pro thiết kế bông tai kiểu mới, chip AI, ANC thích ứng, âm thanh 360 Audio vòm, tổng pin 30 giờ, kết nối đa thiết bị.',
    price: 4990000,
    stock: 22,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/samsung-galaxy-buds-3-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/samsung-galaxy-buds-3-pro/2.webp',
    ],
  },
  {
    name: 'JBL Charge 5 Loa Bluetooth Chống Nước',
    description: 'JBL Charge 5 loa Bluetooth IP67 chống nước và bụi, pin 20 giờ, Power Bank sạc điện thoại, âm thanh JBL Pro Sound bass sâu, kết nối PartyBoost.',
    price: 3490000,
    stock: 30,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['JBL'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/2.webp',
      'https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/3.webp',
    ],
  },
  {
    name: 'JBL Flip 7 Loa Bluetooth Đa Năng',
    description: 'JBL Flip 7 loa di động IP68, âm thanh 360° toàn hướng, pin 16 giờ, kết nối 3 thiết bị đồng thời, màu sắc trẻ trung, chống nước hoàn toàn.',
    price: 2490000,
    stock: 40,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['JBL'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/jbl-flip-6/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/jbl-flip-6/2.webp',
    ],
  },
  {
    name: 'Xiaomi Buds 5 Pro ANC',
    description: 'Xiaomi Buds 5 Pro ANC 52dB chống ồn sâu, LHDC 5.0 âm thanh Hi-Res, driver động 10mm + driver BA cao âm, tổng pin 36 giờ, IPX4.',
    price: 2290000,
    stock: 45,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Xiaomi'],
    images: [
      'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/1.webp',
      'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/2.webp',
    ],
  },

  // ===== PHỤ KIỆN =====
  {
    name: 'Apple MagSafe Charger 15W (USB-C)',
    description: 'Sạc MagSafe Apple chính hãng, công suất 15W tối đa cho iPhone 12/13/14/15/16 series, nam châm căn chỉnh tự động, cáp USB-C 1m.',
    price: 1290000,
    stock: 100,
    category: catMap['Phụ kiện'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/2.webp',
    ],
  },
  {
    name: 'Apple Pencil Pro',
    description: 'Apple Pencil Pro hỗ trợ iPad Pro M4 và iPad Air M2, Squeeze tùy chỉnh, cảm biến con quay hồi chuyển, Double Tap thay đổi công cụ, sạc từ tính.',
    price: 3490000,
    stock: 25,
    category: catMap['Phụ kiện'],
    brand: brandMap['Apple'],
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-pencil-pro/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-pencil-pro/2.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-pencil-pro/3.webp',
    ],
  },
  {
    name: 'Samsung 25W Sạc Nhanh Super Fast Charging',
    description: 'Củ sạc Samsung 25W Super Fast Charging 2.0 chính hãng, tương thích Galaxy S series và A series, cổng USB-C, nhỏ gọn bỏ túi.',
    price: 390000,
    stock: 120,
    category: catMap['Phụ kiện'],
    brand: brandMap['Samsung'],
    images: [
      'https://cdn.dummyjson.com/product-images/mobile-accessories/samsung-25w-super-fast-charger/1.webp',
      'https://cdn.dummyjson.com/product-images/mobile-accessories/samsung-25w-super-fast-charger/2.webp',
    ],
  },
  {
    name: 'Logitech MX Master 3S Chuột Không Dây',
    description: 'Logitech MX Master 3S cảm biến 8000 DPI, click không tiếng, bánh xe MagSpeed cuộn siêu nhanh, Bluetooth/USB Receiver, pin 70 ngày, Logi Bolt.',
    price: 2490000,
    stock: 30,
    category: catMap['Phụ kiện'],
    brand: brandMap['Logitech'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp',
    ],
  },
  {
    name: 'Logitech MX Keys S Bàn Phím Không Dây',
    description: 'Logitech MX Keys S bàn phím Bluetooth thông minh, phím có đèn nền LED, Smart Illumination tự động, Logi AI Prompt Builder tích hợp, pin 10 ngày.',
    price: 2990000,
    stock: 25,
    category: catMap['Phụ kiện'],
    brand: brandMap['Logitech'],
    images: [
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/1.webp',
      'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-air-m2/2.webp',
    ],
  },

  // THÊM SẢN PHẨM BỔ SUNG ĐẠT 100 ----
  {
    name: 'iPhone 15 Plus 128GB',
    description: 'iPhone 15 Plus màn hình 6.7" Super Retina XDR, chip A16 Bionic, Dynamic Island, camera 48MP, pin cả ngày không lo hết, 5G.',
    price: 22990000,
    stock: 15,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/iphone-15/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/iphone-15/2.webp'],
  },
  {
    name: 'Samsung Galaxy S24 FE 256GB',
    description: 'Galaxy S24 FE Exynos 2500, màn hình 6.7" Dynamic AMOLED 120Hz, camera 50MP, pin 4700mAh sạc 45W, Galaxy AI đầy đủ.',
    price: 14990000,
    stock: 22,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25/2.webp'],
  },
  {
    name: 'Xiaomi 15 Pro 512GB',
    description: 'Xiaomi 15 Pro Snapdragon 8 Elite, camera Leica Summilux 50MP, màn hình 6.73" LTPO AMOLED 120Hz, pin 6100mAh sạc 120W không dây 50W.',
    price: 32990000,
    stock: 8,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Xiaomi'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/xiaomi-14-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-14-ultra/2.webp'],
  },
  {
    name: 'Oppo Find N5 512GB',
    description: 'Oppo Find N5 gập ngoài siêu mỏng 4.21mm, Snapdragon 8 Elite, camera Hasselblad 50MP, màn hình ngoài 6.6" LTPO AMOLED.',
    price: 44990000,
    stock: 5,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Oppo'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/oppo-find-x8-pro/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/oppo-find-x8-pro/2.webp'],
  },
  {
    name: 'Asus ROG Phone 9 Pro 512GB',
    description: 'Asus ROG Phone 9 Pro Snapdragon 8 Elite, màn hình 6.78" AMOLED 185Hz, 24GB RAM, pin 5800mAh sạc 65W, AeroActive Cooler X2 tản nhiệt.',
    price: 35990000,
    stock: 7,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Asus'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/2.webp'],
  },
  {
    name: 'Dell Inspiron 15 Core i7-1355U 16GB 512GB',
    description: 'Dell Inspiron 15 mỏng nhẹ, Core i7-1355U, 16GB DDR4 RAM, 512GB SSD, màn hình FHD IPS 15.6" 120Hz, Wi-Fi 6, Win 11 Home.',
    price: 19990000,
    stock: 12,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Dell'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/2.webp'],
  },
  {
    name: 'Asus VivoBook 16X OLED Core i5-13500H 16GB',
    description: 'Asus VivoBook 16X OLED màn hình 16" 2.5K 120Hz, Core i5-13500H, 16GB DDR5 RAM, 512GB SSD, NVIDIA RTX 4050 6GB, Win 11.',
    price: 22490000,
    stock: 10,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Asus'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/2.webp'],
  },
  {
    name: 'HP Pavilion 15 Core i5-1335U 8GB 256GB',
    description: 'HP Pavilion 15 cho sinh viên, Core i5-1335U, 8GB DDR4 RAM, 256GB SSD, màn hình FHD IPS 15.6" anti-glare, Win 11 Home, giá tốt.',
    price: 14990000,
    stock: 18,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['HP'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp'],
  },
  {
    name: 'iPad mini 7 WiFi 128GB',
    description: 'iPad mini 7 chip A17 Pro, màn hình Liquid Retina 8.3" 2266x1488, hỗ trợ Apple Pencil Pro, thiết kế không cạnh viền dày, nhỏ gọn.',
    price: 15990000,
    stock: 20,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/1.webp', 'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/2.webp'],
  },
  {
    name: 'Samsung Galaxy Tab A9+ WiFi 64GB',
    description: 'Galaxy Tab A9+ Snapdragon 695, màn hình 11" LCD 1920x1200 90Hz, 4 loa Dolby Atmos, 8GB RAM, 64GB lưu trữ, giải trí phim ảnh tuyệt vời.',
    price: 6990000,
    stock: 25,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp'],
  },
  {
    name: 'Apple Watch Series 9 41mm Nhôm',
    description: 'Apple Watch Series 9 chip S9, màn hình Always-On Retina, tính năng Double Tap mới, đo nhịp tim, SpO2 liên tục, GPS, Crash Detection.',
    price: 9990000,
    stock: 20,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/1.webp', 'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/2.webp'],
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic 47mm',
    description: 'Galaxy Watch 6 Classic vành xoay vật lý iconic, màn hình Super AMOLED 47mm, chip Exynos W930, đo huyết áp, ECG, theo dõi giấc ngủ nâng cao.',
    price: 8490000,
    stock: 14,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/1.webp', 'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/2.webp'],
  },
  {
    name: 'Sony WH-1000XM4 Chống ồn Premium',
    description: 'Sony WH-1000XM4 tai nghe over-ear flagship, chip QN1 HD, ANC thế hệ mới, 30 giờ pin, LDAC Hi-Res, nhận diện giọng nói, Bluetooth 5.0.',
    price: 5990000,
    stock: 20,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Sony'],
    images: ['https://cdn.dummyjson.com/product-images/audio/sony-wh-1000xm5/1.webp', 'https://cdn.dummyjson.com/product-images/audio/sony-wh-1000xm5/2.webp'],
  },
  {
    name: 'AirPods Max USB-C',
    description: 'AirPods Max over-ear cao cấp chip H2, ANC đẳng cấp, Transparency Mode, Spatial Audio Personalized, 20 giờ pin, thiết kế nhôm mesh headband.',
    price: 16490000,
    stock: 6,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/1.webp', 'https://cdn.dummyjson.com/product-images/audio/apple-airpods-pro-2nd-gen/2.webp'],
  },
  {
    name: 'JBL PartyBox 110 Loa Bluetooth Karaoke',
    description: 'JBL PartyBox 110 loa party 160W, đèn LED vũ trường, pin 12 giờ, mic cắm XLR/TRS, guitar input, TWS pair ghép đôi loa, chống bắn nước IPX4.',
    price: 6990000,
    stock: 10,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['JBL'],
    images: ['https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/1.webp', 'https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/2.webp'],
  },
  {
    name: 'Apple USB-C to Lightning Cable 1m',
    description: 'Cáp Apple USB-C sang Lightning chính hãng 1m, sạc nhanh 20W cho iPhone, tương thích iPhone 5 đến iPhone 14, chứng nhận MFi.',
    price: 590000,
    stock: 150,
    category: catMap['Phụ kiện'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/1.webp', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/2.webp'],
  },
  {
    name: 'Samsung Galaxy SmartTag 2',
    description: 'Samsung SmartTag 2 định vị Bluetooth, pin lâu 6 tháng, nút tìm điện thoại, chế độ Lost Mode, tương thích Galaxy, chống nước IP67.',
    price: 590000,
    stock: 80,
    category: catMap['Phụ kiện'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/samsung-25w-super-fast-charger/1.webp', 'https://cdn.dummyjson.com/product-images/mobile-accessories/samsung-25w-super-fast-charger/2.webp'],
  },
  {
    name: 'Xiaomi 67W GaN Sạc Nhanh 3 cổng',
    description: 'Xiaomi 67W GaN Charger 3 cổng (2x USB-A + 1x USB-C), công nghệ GaN thế hệ 2, tản nhiệt tốt, nhỏ gọn, tương thích đa thiết bị.',
    price: 490000,
    stock: 100,
    category: catMap['Phụ kiện'],
    brand: brandMap['Xiaomi'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/1.webp', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/2.webp'],
  },
  {
    name: 'Logitech G Pro X Superlight 2 Chuột Gaming',
    description: 'Logitech G Pro X Superlight 2 chuột gaming 32000 DPI, trọng lượng chỉ 60g, cảm biến HERO 2 siêu chính xác, pin 95 giờ, Lightspeed 1ms.',
    price: 3490000,
    stock: 20,
    category: catMap['Phụ kiện'],
    brand: brandMap['Logitech'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-16-m3-max/2.webp'],
  },
  {
    name: 'Apple Magic Keyboard Touch ID',
    description: 'Apple Magic Keyboard với Touch ID và bàn phím số, kết nối USB-C, pin sạc lâu dài, layout bàn phím thoải mái, tương thích Mac silicon.',
    price: 3990000,
    stock: 15,
    category: catMap['Phụ kiện'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-pencil-pro/1.webp', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-pencil-pro/2.webp'],
  },
  {
    name: 'Samsung 45W PD Adapter',
    description: 'Củ sạc Samsung 45W Power Delivery chính hãng, tương thích Galaxy S24/S23 Ultra, Note20 Ultra, Tab S series, cổng USB-C, công nghệ sạc siêu nhanh.',
    price: 490000,
    stock: 120,
    category: catMap['Phụ kiện'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/samsung-25w-super-fast-charger/1.webp'],
  },
  {
    name: 'Xiaomi Pad 6S Pro 12.4" WiFi 256GB',
    description: 'Xiaomi Pad 6S Pro 12.4" Snapdragon 8 Gen 2, màn hình LCD 3K 144Hz, 12GB RAM, bàn phím và bút stylus tùy chọn, pin 10000mAh sạc 67W.',
    price: 13990000,
    stock: 15,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Xiaomi'],
    images: ['https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp'],
  },
  {
    name: 'Samsung Galaxy A35 5G 128GB',
    description: 'Galaxy A35 5G Exynos 1380, màn hình 6.6" Super AMOLED 120Hz, camera 50MP OIS, pin 5000mAh, chống nước IP67, thiết kế trẻ trung.',
    price: 7490000,
    stock: 38,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-a55/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-a55/2.webp'],
  },
  {
    name: 'Oppo A3 Pro 5G 256GB',
    description: 'Oppo A3 Pro 5G siêu bền IP69 chống nước và bụi, màn hình 6.7" AMOLED 120Hz, pin 5100mAh sạc SUPERVOOC 45W, camera 50MP.',
    price: 7990000,
    stock: 30,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Oppo'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/2.webp'],
  },
  {
    name: 'Xiaomi Redmi 14C 4G 128GB',
    description: 'Redmi 14C chip MediaTek Helio G81 Ultra, màn hình 6.88" IPS LCD 90Hz, camera 50MP AI, pin 5160mAh, giá siêu rẻ cho phân khúc phổ thông.',
    price: 3490000,
    stock: 70,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Xiaomi'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/2.webp'],
  },
  {
    name: 'Dell G15 Gaming i7-13650HX RTX 4060',
    description: 'Dell G15 Gaming Core i7-13650HX, 16GB DDR5, RTX 4060 8GB, 512GB SSD, màn hình 15.6" FHD 165Hz, tản nhiệt Alienware Cryo-Tech.',
    price: 28990000,
    stock: 8,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Dell'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/2.webp'],
  },
  {
    name: 'HP Omen 16 Core i9-13900HX RTX 4070',
    description: 'HP Omen 16 gaming Core i9-13900HX, 32GB DDR5 RAM, RTX 4070 8GB, 1TB SSD NVMe, màn hình 16" QHD 165Hz IPS, OMEN Tempest Cooling.',
    price: 42990000,
    stock: 5,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['HP'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp'],
  },
  {
    name: 'Sony Xperia 5 V 256GB',
    description: 'Sony Xperia 5 V Snapdragon 8 Gen 2, màn hình 6.1" OLED 120Hz, camera Zeiss 52MP, âm thanh Dolby Atmos, lọc tiếng ồn AI, IP68.',
    price: 20990000,
    stock: 8,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Sony'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/sony-xperia-1-v/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/sony-xperia-1-v/2.webp'],
  },
  // ===== 16 SẢN PHẨM BỔ SUNG =====
  {
    name: 'iPhone 14 128GB',
    description: 'iPhone 14 chip A15 Bionic, camera chính 12MP Action Mode, Crash Detection, Emergency SOS via Satellite, màn hình Super Retina XDR 6.1".',
    price: 16990000,
    stock: 15,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/iphone-14-pro-max/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/iphone-14-pro-max/2.webp'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    description: 'Galaxy S24 Ultra Snapdragon 8 Gen 3 For Galaxy, camera 200MP zoom 5x, màn hình 6.8" Dynamic AMOLED 2X 120Hz, S Pen tích hợp, titanium frame.',
    price: 28990000,
    stock: 12,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s25-ultra/2.webp'],
  },
  {
    name: 'Xiaomi Redmi Note 13 Pro+ 5G 256GB',
    description: 'Redmi Note 13 Pro+ Dimensity 7200 Ultra, camera 200MP OIS, màn hình 6.67" OLED 120Hz 2712x1220, sạc HyperCharge 120W, pin 5000mAh.',
    price: 8990000,
    stock: 32,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Xiaomi'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/xiaomi-redmi-note-14-pro/2.webp'],
  },
  {
    name: 'Oppo Reno 13 Pro 5G 256GB',
    description: 'Oppo Reno 13 Pro MediaTek Dimensity 8350, camera Sony LYTIA 906S 50MP OIS, màn hình 6.83" OLED 120Hz, sạc SUPERVOOC 80W, IP66.',
    price: 13990000,
    stock: 18,
    category: catMap['Điện thoại di động'],
    brand: brandMap['Oppo'],
    images: ['https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/1.webp', 'https://cdn.dummyjson.com/product-images/smartphones/oppo-reno-12-pro/2.webp'],
  },
  {
    name: 'Asus Zenbook 14 OLED Core Ultra 7 155H 32GB',
    description: 'Asus Zenbook 14 OLED Core Ultra 7 155H, 32GB LPDDR5X RAM, 1TB SSD, màn hình OLED 14" 2.8K 120Hz 100% DCI-P3, NPU AI 13 TOPS.',
    price: 32990000,
    stock: 8,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Asus'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/asus-rog-zephyrus-g14-2024/2.webp'],
  },
  {
    name: 'Dell Latitude 7450 Core Ultra 7 165U 32GB',
    description: 'Dell Latitude 7450 Copilot+ PC, Core Ultra 7 165U, 32GB LPDDR5X, 512GB SSD, màn hình FHD 14" IPS cảm ứng, thiết kế doanh nhân cao cấp.',
    price: 45990000,
    stock: 5,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['Dell'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/dell-xps-15-9520/2.webp'],
  },
  {
    name: 'HP EliteBook 840 G11 Core Ultra 5 125U 16GB',
    description: 'HP EliteBook 840 G11 dành cho doanh nghiệp, Core Ultra 5 125U, 16GB RAM, 512GB SSD, bảo mật HP Wolf Pro, màn hình 14" IPS 400nit.',
    price: 29990000,
    stock: 6,
    category: catMap['Laptop & Macbook'],
    brand: brandMap['HP'],
    images: ['https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/1.webp', 'https://cdn.dummyjson.com/product-images/laptops/hp-spectre-x360-14t/2.webp'],
  },
  {
    name: 'iPad Air 11" M2 WiFi 256GB',
    description: 'iPad Air 11" chip M2 cực nhanh, màn hình Liquid Retina 11" 2360x1640, hỗ trợ Apple Pencil Pro và Magic Keyboard Folio, nhiều màu sắc.',
    price: 19990000,
    stock: 16,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/1.webp', 'https://cdn.dummyjson.com/product-images/tablets/apple-ipad-air-m2/2.webp'],
  },
  {
    name: 'Samsung Galaxy Tab S10 WiFi 128GB',
    description: 'Galaxy Tab S10 Snapdragon 8 Gen 3, màn hình Dynamic AMOLED 2X 10.9" 120Hz, S Pen đi kèm, cổng USB 3.2 Gen 2, Dex Mode, pin 8000mAh.',
    price: 18990000,
    stock: 10,
    category: catMap['Máy tính bảng'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/1.webp', 'https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s9-ultra/2.webp'],
  },
  {
    name: 'Apple Watch Series 10 42mm Nhôm',
    description: 'Apple Watch Series 10 42mm nhỏ gọn, màn hình luôn hiển thị thế hệ mới, chip S10, phát hiện ngủ ngáy, theo dõi sức khỏe toàn diện.',
    price: 10990000,
    stock: 18,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/1.webp', 'https://cdn.dummyjson.com/product-images/smartwatches/apple-watch-se-2/2.webp'],
  },
  {
    name: 'Samsung Galaxy Watch 7 40mm',
    description: 'Galaxy Watch 7 40mm Exynos W1000 3nm, màn hình Super AMOLED 40mm, Galaxy AI sức khỏe, đo đường huyết không xâm lấn, pin 40 giờ.',
    price: 7490000,
    stock: 20,
    category: catMap['Đồng hồ thông minh'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/1.webp', 'https://cdn.dummyjson.com/product-images/smartwatches/samsung-galaxy-watch7/2.webp'],
  },
  {
    name: 'Sony WF-C700N True Wireless Chống Ồn',
    description: 'Sony WF-C700N true wireless ANC, driver 5mm mới, pin 7.5 giờ + 15 giờ từ hộp sạc, IPX4, gọn nhẹ nhất dòng Sony, kết nối đa điểm.',
    price: 2290000,
    stock: 35,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Sony'],
    images: ['https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/1.webp', 'https://cdn.dummyjson.com/product-images/audio/sony-wf-1000xm5/2.webp'],
  },
  {
    name: 'Samsung Galaxy Buds 3',
    description: 'Galaxy Buds 3 thiết kế trụ mới, AI Live Translate thông dịch trực tiếp, âm thanh Hi-Fi 24bit, tổng pin 30 giờ, ANC thích ứng môi trường.',
    price: 3490000,
    stock: 28,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Samsung'],
    images: ['https://cdn.dummyjson.com/product-images/audio/samsung-galaxy-buds-3-pro/1.webp', 'https://cdn.dummyjson.com/product-images/audio/samsung-galaxy-buds-3-pro/2.webp'],
  },
  {
    name: 'JBL Tune 770NC Tai Nghe Không Dây',
    description: 'JBL Tune 770NC over-ear ANC adaptive, âm thanh JBL Pure Bass, pin 70 giờ (44 giờ có ANC), sạc nhanh 10 phút nghe 3 giờ, kết nối 2 thiết bị cùng lúc.',
    price: 2190000,
    stock: 30,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['JBL'],
    images: ['https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/1.webp', 'https://cdn.dummyjson.com/product-images/audio/jbl-charge-5/2.webp'],
  },
  {
    name: 'Apple AirTag 4 Pack',
    description: 'Apple AirTag bộ 4 cái, định vị Bluetooth cực chính xác, tích hợp Ultra Wideband U1, âm báo loa tích hợp, pin CR2032 1 năm, chống nước IP67.',
    price: 2790000,
    stock: 50,
    category: catMap['Phụ kiện'],
    brand: brandMap['Apple'],
    images: ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/1.webp', 'https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-charger/2.webp'],
  },
  {
    name: 'Logitech G435 Tai Nghe Gaming Không Dây',
    description: 'Logitech G435 tai nghe gaming nhẹ chỉ 165g, kết nối Lightspeed 2.4GHz và Bluetooth, pin 18 giờ, tương thích PC/PS4/PS5/Switch/Mobile.',
    price: 1690000,
    stock: 22,
    category: catMap['Tai nghe & Loa'],
    brand: brandMap['Logitech'],
    images: ['https://cdn.dummyjson.com/product-images/audio/jbl-flip-6/1.webp', 'https://cdn.dummyjson.com/product-images/audio/jbl-flip-6/2.webp'],
  },
];

async function seedRealProducts() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công!');

    // Xóa sản phẩm cũ (chỉ xóa sản phẩm, giữ nguyên Category và Brand)
    const deletedCount = await Product.deleteMany({});
    console.log(`🗑️  Đã xóa ${deletedCount.deletedCount} sản phẩm cũ.`);

    // Đọc brands đang có thật trong DB
    const existingBrands = await Brand.find({ isDeleted: false });
    const brandMap = {};
    existingBrands.forEach(b => brandMap[b.name] = b._id);
    console.log(`📦 Thương hiệu hiện có: ${existingBrands.map(b => b.name).join(', ')}`);

    // Kiểm tra brand còn thiếu và tạo thêm nếu cần
    const missingBrands = brandsData.filter(b => !brandMap[b.name]);
    if (missingBrands.length > 0) {
      const newBrands = await Brand.insertMany(missingBrands);
      newBrands.forEach(b => brandMap[b.name] = b._id);
      console.log(`✅ Đã tạo thêm ${newBrands.length} thương hiệu mới: ${newBrands.map(b => b.name).join(', ')}`);
    }

    // Đọc categories đang có thật trong DB
    const existingCategories = await Category.find({ isDeleted: false });
    const catMap = {};
    existingCategories.forEach(c => catMap[c.name] = c._id);
    console.log(`📂 Danh mục hiện có: ${existingCategories.map(c => c.name).join(', ')}`);

    // Kiểm tra category còn thiếu và tạo thêm nếu cần
    const missingCats = categoriesData.filter(c => !catMap[c.name]);
    if (missingCats.length > 0) {
      const newCats = await Category.insertMany(missingCats);
      newCats.forEach(c => catMap[c.name] = c._id);
      console.log(`✅ Đã tạo thêm ${newCats.length} danh mục mới: ${newCats.map(c => c.name).join(', ')}`);
    }

    // Kiểm tra tất cả categories đã đủ chưa
    const missingCatNames = categoriesData.filter(c => !catMap[c.name]).map(c => c.name);
    if (missingCatNames.length > 0) {
      console.error('❌ Vẫn thiếu categories:', missingCatNames);
      process.exit(1);
    }

    // Tạo sản phẩm thật
    const products = getProducts(catMap, brandMap);
    const validProducts = products.filter(p => p.category && p.brand);
    if (validProducts.length < products.length) {
      console.warn(`⚠️  ${products.length - validProducts.length} sản phẩm bị lỗi thiếu category/brand, đã bỏ qua.`);
    }
    await Product.insertMany(validProducts);
    console.log(`✅ Đã thêm ${validProducts.length} sản phẩm thật vào Database!`);

    console.log('\n🎉 Hoàn tất! KuroTech đã có dữ liệu thật sự chuẩn thị trường.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    process.exit(1);
  }
}

seedRealProducts();

