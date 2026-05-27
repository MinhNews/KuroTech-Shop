// fixImages.js - Cập nhật hình ảnh thật cho tất cả sản phẩm
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = process.env.MONGO_URI;

// ===== HÌNH ẢNH THẬT TỪ CDN DUMMYJSON (ĐÃ VERIFY) =====
const IMG = {
  // Smartphones
  iphone13pro: ['https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/1.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/2.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/3.webp'],
  iphoneX:     ['https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-x/2.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-x/3.webp'],
  iphone6:     ['https://cdn.dummyjson.com/product-images/smartphones/iphone-6/1.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-6/2.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-6/3.webp'],
  iphone5s:    ['https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/1.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/2.webp','https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/3.webp'],
  samsungS10:  ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/1.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/2.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/3.webp'],
  samsungS8:   ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/1.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/2.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s8/3.webp'],
  samsungS7:   ['https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/1.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/2.webp','https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s7/3.webp'],
  oppoA57:     ['https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/1.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/2.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-a57/3.webp'],
  oppoF19:     ['https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/1.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/2.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-f19-pro-plus/3.webp'],
  oppoK1:      ['https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/1.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/2.webp','https://cdn.dummyjson.com/product-images/smartphones/oppo-k1/3.webp'],
  realmeX:     ['https://cdn.dummyjson.com/product-images/smartphones/realme-x/1.webp','https://cdn.dummyjson.com/product-images/smartphones/realme-x/2.webp','https://cdn.dummyjson.com/product-images/smartphones/realme-x/3.webp'],
  vivoS1:      ['https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/1.webp','https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/2.webp','https://cdn.dummyjson.com/product-images/smartphones/vivo-s1/3.webp'],
  // Laptops
  macbook14:   ['https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/1.webp','https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/2.webp','https://cdn.dummyjson.com/product-images/laptops/apple-macbook-pro-14-inch-space-grey/3.webp'],
  asusZenbook: ['https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/1.webp','https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/2.webp','https://cdn.dummyjson.com/product-images/laptops/asus-zenbook-pro-dual-screen-laptop/3.webp'],
  dellXps:     ['https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/1.webp','https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/2.webp','https://cdn.dummyjson.com/product-images/laptops/new-dell-xps-13-9300-laptop/3.webp'],
  lenovoYoga:  ['https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/1.webp','https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/2.webp','https://cdn.dummyjson.com/product-images/laptops/lenovo-yoga-920/3.webp'],
  huawei:      ['https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/1.webp','https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/2.webp','https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/3.webp'],
  // Tablets
  ipadMini:    ['https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/1.webp','https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/2.webp','https://cdn.dummyjson.com/product-images/tablets/ipad-mini-2021-starlight/3.webp'],
  samsungTab:  ['https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/1.webp','https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/2.webp','https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/3.webp'],
  samsungTabW: ['https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/1.webp','https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/2.webp','https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-white/3.webp'],
  // Accessories
  airpods:     ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/3.webp'],
  airpodsMax:  ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods/2.webp'],
  appleWatch:  ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/2.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-watch-series-4-gold/3.webp'],
  charger:     ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-iphone-charger/2.webp'],
  magsafe:     ['https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/apple-magsafe-battery-pack/2.webp'],
  echo:        ['https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/1.webp','https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/2.webp'],
};

// Map tên sản phẩm -> hình ảnh phù hợp nhất
const imageMap = [
  // Apple Phones
  { match: /iPhone 16 Pro Max/i,     images: IMG.iphone13pro },
  { match: /iPhone 16 Pro\b/i,       images: IMG.iphone13pro },
  { match: /iPhone 16 Plus/i,        images: IMG.iphoneX },
  { match: /iPhone 16\b/i,           images: IMG.iphoneX },
  { match: /iPhone 15 Pro Max/i,     images: IMG.iphone13pro },
  { match: /iPhone 15 Pro\b/i,       images: IMG.iphone13pro },
  { match: /iPhone 15 Plus/i,        images: IMG.iphoneX },
  { match: /iPhone 15\b/i,           images: IMG.iphoneX },
  { match: /iPhone 14 Pro Max/i,     images: IMG.iphone13pro },
  { match: /iPhone 14 Pro\b/i,       images: IMG.iphone13pro },
  { match: /iPhone 14\b/i,           images: IMG.iphone6 },
  { match: /iPhone 13\b/i,           images: IMG.iphone13pro },
  { match: /iPhone/i,                images: IMG.iphoneX },
  // Samsung Phones
  { match: /Galaxy S25 Ultra/i,      images: IMG.samsungS10 },
  { match: /Galaxy S25\+/i,          images: IMG.samsungS10 },
  { match: /Galaxy S25\b/i,          images: IMG.samsungS10 },
  { match: /Galaxy S24 Ultra/i,      images: IMG.samsungS10 },
  { match: /Galaxy S24/i,            images: IMG.samsungS10 },
  { match: /Galaxy Z Fold/i,         images: IMG.samsungS8 },
  { match: /Galaxy Z Flip/i,         images: IMG.samsungS8 },
  { match: /Galaxy A55/i,            images: IMG.samsungS7 },
  { match: /Galaxy A35/i,            images: IMG.samsungS7 },
  { match: /Samsung Galaxy/i,        images: IMG.samsungS8 },
  // Xiaomi Phones
  { match: /Xiaomi 14 Ultra/i,       images: IMG.realmeX },
  { match: /Xiaomi 15/i,             images: IMG.realmeX },
  { match: /Redmi Note 14/i,         images: IMG.vivoS1 },
  { match: /Redmi Note 13/i,         images: IMG.vivoS1 },
  { match: /Redmi 14C/i,             images: IMG.vivoS1 },
  // Oppo Phones
  { match: /Oppo Find X8/i,          images: IMG.oppoF19 },
  { match: /Oppo Find N5/i,          images: IMG.oppoF19 },
  { match: /Oppo Reno 1[23]/i,       images: IMG.oppoA57 },
  { match: /Oppo A3/i,               images: IMG.oppoK1 },
  { match: /Oppo/i,                  images: IMG.oppoA57 },
  // Sony Phones
  { match: /Sony Xperia/i,           images: IMG.realmeX },
  // Asus Gaming Phone
  { match: /ROG Phone/i,             images: IMG.samsungS10 },
  // Laptops
  { match: /MacBook Pro/i,           images: IMG.macbook14 },
  { match: /MacBook Air/i,           images: IMG.macbook14 },
  { match: /MacBook/i,               images: IMG.macbook14 },
  { match: /Dell XPS/i,              images: IMG.dellXps },
  { match: /Dell G15/i,              images: IMG.dellXps },
  { match: /Dell Inspiron/i,         images: IMG.dellXps },
  { match: /Dell Latitude/i,         images: IMG.dellXps },
  { match: /Asus ROG Zephyrus/i,     images: IMG.asusZenbook },
  { match: /Asus ROG Strix/i,        images: IMG.asusZenbook },
  { match: /Asus VivoBook/i,         images: IMG.asusZenbook },
  { match: /Asus Zenbook/i,          images: IMG.asusZenbook },
  { match: /HP Spectre/i,            images: IMG.lenovoYoga },
  { match: /HP Envy/i,               images: IMG.lenovoYoga },
  { match: /HP Pavilion/i,           images: IMG.lenovoYoga },
  { match: /HP Omen/i,               images: IMG.lenovoYoga },
  { match: /HP EliteBook/i,          images: IMG.huawei },
  // Tablets
  { match: /iPad Pro/i,              images: IMG.ipadMini },
  { match: /iPad Air/i,              images: IMG.ipadMini },
  { match: /iPad mini/i,             images: IMG.ipadMini },
  { match: /iPad/i,                  images: IMG.ipadMini },
  { match: /Galaxy Tab S10 Ultra/i,  images: IMG.samsungTab },
  { match: /Galaxy Tab S10\+/i,      images: IMG.samsungTab },
  { match: /Galaxy Tab S10\b/i,      images: IMG.samsungTabW },
  { match: /Galaxy Tab A9/i,         images: IMG.samsungTabW },
  { match: /Xiaomi Pad/i,            images: IMG.samsungTabW },
  // Watches
  { match: /Apple Watch Ultra/i,     images: IMG.appleWatch },
  { match: /Apple Watch Series/i,    images: IMG.appleWatch },
  { match: /Apple Watch SE/i,        images: IMG.appleWatch },
  { match: /Apple Watch/i,           images: IMG.appleWatch },
  { match: /Galaxy Watch Ultra/i,    images: IMG.appleWatch },
  { match: /Galaxy Watch/i,          images: IMG.appleWatch },
  { match: /Xiaomi Watch/i,          images: IMG.appleWatch },
  // Headphones / Speakers / Audio
  { match: /AirPods Max/i,           images: IMG.airpodsMax },
  { match: /AirPods Pro/i,           images: IMG.airpods },
  { match: /AirPods 4/i,             images: IMG.airpods },
  { match: /AirPods/i,               images: IMG.airpods },
  { match: /Sony WH/i,               images: IMG.airpodsMax },
  { match: /Sony WF/i,               images: IMG.airpods },
  { match: /Galaxy Buds/i,           images: IMG.airpods },
  { match: /JBL Charge/i,            images: IMG.echo },
  { match: /JBL Flip/i,              images: IMG.echo },
  { match: /JBL PartyBox/i,          images: IMG.echo },
  { match: /JBL Tune/i,              images: IMG.airpods },
  { match: /Xiaomi Buds/i,           images: IMG.airpods },
  { match: /Logitech G435/i,         images: IMG.airpodsMax },
  // Accessories
  { match: /MagSafe Charger/i,       images: IMG.magsafe },
  { match: /Apple Pencil/i,          images: IMG.charger },
  { match: /Apple USB-C/i,           images: IMG.charger },
  { match: /Apple Magic Keyboard/i,  images: IMG.charger },
  { match: /Apple AirTag/i,          images: IMG.magsafe },
  { match: /Samsung 25W/i,           images: IMG.charger },
  { match: /Samsung 45W/i,           images: IMG.charger },
  { match: /Samsung SmartTag/i,      images: IMG.magsafe },
  { match: /Xiaomi 67W/i,            images: IMG.charger },
  { match: /Logitech MX Master/i,    images: IMG.echo },
  { match: /Logitech MX Keys/i,      images: IMG.echo },
  { match: /Logitech G Pro/i,        images: IMG.echo },
];

function getImages(name) {
  for (const rule of imageMap) {
    if (rule.match.test(name)) return rule.images;
  }
  return IMG.iphoneX; // fallback
}

async function fixImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Kết nối MongoDB thành công!');

    const products = await Product.find({});
    console.log(`📦 Tổng sản phẩm cần cập nhật: ${products.length}`);

    let updated = 0;
    for (const product of products) {
      const images = getImages(product.name);
      await Product.updateOne({ _id: product._id }, { $set: { images } });
      updated++;
      process.stdout.write(`\r✏️  Đã cập nhật: ${updated}/${products.length} - ${product.name.substring(0, 40)}`);
    }

    console.log(`\n\n✅ Hoàn tất! Đã cập nhật hình ảnh cho ${updated} sản phẩm.`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Lỗi:', error.message);
    process.exit(1);
  }
}

fixImages();
