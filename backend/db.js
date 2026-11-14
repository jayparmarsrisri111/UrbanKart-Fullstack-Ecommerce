const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'ecommerce_db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    description: "Industry-leading noise canceling with two processors and 8 microphones. Magnificent high-resolution sound quality engineered with the Integrated Processor V1. Up to 30 hours battery life with quick charging.",
    price: 29990,
    original_price: 34990,
    category: "Electronics",
    brand: "Sony",
    image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews_count: 142,
    stock: 35,
    is_featured: true,
    is_trending: true,
    features: "Auto NC Optimizer for crystal clear audio\nMagnificent hands-free calling with 4 beamforming mics\n30-hour battery life with 3-minute quick charge\nUltra-comfortable lightweight synthetic leather",
    specs: {
      "Driver Unit": "30mm, dome type",
      "Frequency Response": "4 Hz - 40,000 Hz",
      "Battery Life": "Up to 30 hours (NC ON)",
      "Charging Time": "Approx. 3.5 hrs (USB-PD)",
      "Bluetooth Version": "5.2 (LDAC, AAC, SBC)",
      "Weight": "Approx. 250g"
    },
    reviews: [
      { id: 1, author: "Kavita Rao", rating: 5, date: "2026-11-10", comment: "The noise cancellation is literally miraculous on flights and Mumbai local trains!", verified: true },
      { id: 2, author: "Aditya Verma", rating: 5, date: "2026-11-05", comment: "Comfortable for 8+ hour work calls. Build quality is top tier.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Apple MacBook Air M3 - 15-inch Liquid Retina Display",
    slug: "apple-macbook-air-m3-15-inch",
    description: "Supercharged by the next-generation M3 chip. Strikingly thin aluminum enclosure, breathtaking Liquid Retina display, MagSafe charging, and up to 18 hours of battery life.",
    price: 114900,
    original_price: 134900,
    category: "Electronics",
    brand: "Apple",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews_count: 210,
    stock: 20,
    is_featured: true,
    is_trending: true,
    features: "Apple M3 8-core CPU with 10-core GPU\n15.3-inch Liquid Retina display with 500 nits brightness\nMagSafe 3 charging & 2x Thunderbolt ports\nSilent, fanless whisper-quiet design",
    specs: {
      "Processor": "Apple M3 8-Core CPU",
      "Memory": "16GB Unified Memory",
      "Storage": "512GB PCIe SSD",
      "Display": "15.3-inch 2880x1864 Liquid Retina",
      "Battery": "Up to 18 hours",
      "Weight": "1.51 kg"
    },
    reviews: [
      { id: 1, author: "Devansh Parekh", rating: 5, date: "2026-11-08", comment: "Performance is stellar for coding and 4K video editing without any fan noise.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Apple Watch Ultra 2 GPS + Cellular Titanium Case",
    slug: "apple-watch-ultra-2-gps-cellular",
    description: "The ultimate sports and adventure smartwatch. 49mm aerospace-grade titanium case, precision dual-frequency GPS, 3000-nit Retina display, and up to 36 hours of battery life.",
    price: 79900,
    original_price: 89900,
    category: "Electronics",
    brand: "Apple",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews_count: 98,
    stock: 18,
    is_featured: true,
    is_trending: false,
    features: "49mm aerospace titanium case with sapphire front crystal\nBrightest 3000 nits Always-On Retina display\n100m water resistant with depth gauge\nPrecision dual-frequency GPS (L1 and L5)",
    specs: {
      "Case Material": "Aerospace Titanium",
      "Display": "Always-On OLED (3000 nits)",
      "Battery": "Up to 36 hours (72h low power)",
      "Water Resistance": "100m, EN13319 certified",
      "Connectivity": "Cellular + GPS + Bluetooth 5.3"
    },
    reviews: [
      { id: 1, author: "Major Harshvardhan", rating: 5, date: "2026-10-28", comment: "Survives heavy trekking, diving and rugged terrain without a single scratch.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "Nike Air Max 270 React Premium Sneakers",
    slug: "nike-air-max-270-react-sneakers",
    description: "The Nike Air Max 270 React blends Nike's biggest heel Air unit with lightweight, durable Nike React foam for smooth, all-day cushioning. Modern aesthetic with bold contrast styling.",
    price: 11995,
    original_price: 13995,
    category: "Footwear",
    brand: "Nike",
    image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews_count: 86,
    stock: 42,
    is_featured: true,
    is_trending: true,
    features: "Max Air 270 unit delivers unrivaled comfort\nNike React technology creates an extremely smooth ride\nLightweight layered synthetic materials\nFull heel-to-toe rubber coverage for traction",
    specs: {
      "Upper Material": "Mesh & Synthetic Overlays",
      "Sole": "React Foam with Max Air heel",
      "Closure": "Lace-Up",
      "Ideal For": "Running, Gym, Streetwear"
    },
    reviews: [
      { id: 1, author: "Rahul Goswami", rating: 5, date: "2026-11-02", comment: "Best daily sneakers! Feather light and looks incredible with jeans or joggers.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: "Classic Minimalist Chronograph Leather Watch",
    slug: "classic-minimalist-chronograph-watch",
    description: "Crafted with surgical-grade 316L stainless steel and genuine Italian top-grain leather strap. Features a scratch-resistant sapphire crystal glass and Japanese quartz movement.",
    price: 4499,
    original_price: 6999,
    category: "Accessories",
    brand: "Nordic Time",
    image_url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews_count: 54,
    stock: 25,
    is_featured: false,
    is_trending: true,
    features: "Sapphire crystal scratch-proof glass\nGenuine Italian leather strap\n50m Water Resistance (5 ATM)\nSubdial stopwatch & date window",
    specs: {
      "Dial Diameter": "42mm",
      "Case Thickness": "9.5mm",
      "Strap Width": "20mm genuine leather",
      "Movement": "Japanese Miyota Quartz",
      "Water Resistance": "50m (5 ATM)"
    },
    reviews: [
      { id: 1, author: "Tanmay Dave", rating: 4, date: "2026-10-24", comment: "Very elegant watch for formal office meetings. Looks like a 20k watch.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: "Urban Explorer Waterproof Commuter Backpack",
    slug: "urban-explorer-waterproof-backpack",
    description: "Engineered for daily urban commuters and tech travelers. Features a padded 16-inch laptop compartment, hidden anti-theft pockets, USB pass-through charging port, and water-repellent Cordura fabric.",
    price: 2499,
    original_price: 3999,
    category: "Accessories",
    brand: "AeroPack",
    image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews_count: 112,
    stock: 60,
    is_featured: true,
    is_trending: false,
    features: "Weatherproof 900D ballistic nylon\nDedicated padded 16-inch laptop sleeve\nErgonomic breathable mesh shoulder straps\nLuggage strap for effortless roller bag attachment",
    specs: {
      "Capacity": "28 Liters",
      "Dimensions": "46 x 32 x 18 cm",
      "Weight": "850 grams",
      "Laptop Fit": "Up to 16.2 inch laptops",
      "Warranty": "2 Years International"
    },
    reviews: [
      { id: 1, author: "Manish Shah", rating: 5, date: "2026-11-12", comment: "Saved my laptop during heavy monsoon downpours! Truly waterproof.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    name: "Vintage Denim Sherpa Trucker Jacket",
    slug: "vintage-denim-sherpa-trucker-jacket",
    description: "Timeless Americana style featuring heavy-duty washed cotton denim lined with plush warm sherpa fleece. Perfect outer layer for chilly evenings and crisp urban outings.",
    price: 3799,
    original_price: 5499,
    category: "Fashion",
    brand: "UrbanHeritage",
    image_url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews_count: 73,
    stock: 28,
    is_featured: false,
    is_trending: true,
    features: "100% heavyweight cotton denim\nPlush insulating sherpa lining\nDual snap flap chest pockets\nAdjustable waist tabs for a custom fit",
    specs: {
      "Fabric": "100% Cotton 14oz Denim",
      "Lining": "Faux Sherpa Fleece",
      "Fit": "Regular Classic Trucker Fit",
      "Wash Care": "Machine Wash Cold"
    },
    reviews: [
      { id: 1, author: "Samarth Gill", rating: 5, date: "2026-11-01", comment: "Extremely warm and the vintage wash is authentic. Fits true to size.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    name: "Smart Ambient Nordic Floor Lamp RGB & Warm White",
    slug: "smart-ambient-nordic-floor-lamp",
    description: "Sleek minimalist corner lighting designed to enhance any room ambiance. 16 million colors, warm to cool white dimming, music synchronization, and smartphone/Alexa/Google voice control.",
    price: 3299,
    original_price: 4999,
    category: "Home & Living",
    brand: "Lumina",
    image_url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews_count: 67,
    stock: 30,
    is_featured: true,
    is_trending: false,
    features: "16M RGB colors + dynamic light effects\nAlexa & Google Home voice compatibility\nSound-activated dynamic music mode\nWeighted anti-tip aluminum base",
    specs: {
      "Height": "140 cm",
      "Wattage": "20W LED (Energy Saving)",
      "App Control": "SmartLife / Tuya via Wi-Fi",
      "Voltage": "100-240V AC 50/60Hz"
    },
    reviews: [
      { id: 1, author: "Priyanka Sen", rating: 5, date: "2026-10-18", comment: "Transformed my living room! Syncs with music perfectly when friends come over.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 9,
    name: "Adidas Ultraboost Light Running Shoes",
    slug: "adidas-ultraboost-light-running-shoes",
    description: "Experience epic energy return with the lightest Ultraboost ever made. Features adidas Light BOOST midsole foam and supportive PRIMEKNIT+ textile upper for effortless long-distance runs.",
    price: 14999,
    original_price: 17999,
    category: "Footwear",
    brand: "Adidas",
    image_url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews_count: 130,
    stock: 38,
    is_featured: false,
    is_trending: true,
    features: "Light BOOST midsole generates unmatched energy\nContinental Better Rubber outsole provides superior grip\nPRIMEKNIT+ upper hugs foot naturally\nMade in part with recycled materials",
    specs: {
      "Weight": "299g (Size 9)",
      "Midsole Drop": "10mm (heel: 30mm / forefoot: 20mm)",
      "Upper": "Adidas PRIMEKNIT+ textile",
      "Outsole": "Continental™ Better Rubber"
    },
    reviews: [
      { id: 1, author: "Deepak Choudhary", rating: 5, date: "2026-11-09", comment: "Completed my half marathon in these. Zero blisters and fantastic bounce.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 10,
    name: "Premium Ceramic Pour-Over Coffee Dripper Set",
    slug: "premium-ceramic-coffee-dripper-set",
    description: "Elevate your morning coffee ritual. Handcrafted artisanal matte ceramic pour-over cone paired with a heat-resistant borosilicate glass server and bamboo lid.",
    price: 1899,
    original_price: 2499,
    category: "Home & Living",
    brand: "Kaffi Craft",
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews_count: 48,
    stock: 45,
    is_featured: false,
    is_trending: false,
    features: "Matte textured ceramic cone ensures thermal stability\n600ml heat-resistant borosilicate glass carafe\nInternal spiral ribs for optimal water extraction rate\nDishwasher safe & eco-friendly",
    specs: {
      "Server Capacity": "600ml (2-4 Cups)",
      "Material": "High-fired Ceramic & Borosilicate Glass",
      "Filter Size": "Compatible with V60 02 paper filters",
      "Care": "Dishwasher & Microwave Safe"
    },
    reviews: [
      { id: 1, author: "Ananya Iyer", rating: 5, date: "2026-10-30", comment: "Brews clean, aromatic specialty coffee. Beautiful centerpiece in my kitchen.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 11,
    name: "Fastrack Limitless FS1 Pro Smartwatch with Super AMOLED",
    slug: "fastrack-limitless-fs1-pro-smartwatch",
    description: "1.96-inch Super AMOLED curved display, SingleSync BT calling, 110+ sports modes, 200+ watch faces, and 7-day battery life.",
    price: 2799,
    original_price: 4995,
    category: "Electronics",
    brand: "Fastrack",
    image_url: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews_count: 62,
    stock: 55,
    is_featured: false,
    is_trending: true,
    features: "1.96-inch Super AMOLED curved glass (410x502 px)\nCrystal clear Bluetooth calling with AI noise reduction\n110+ Sports modes with auto workout detection\nIP68 Water and dust resistance",
    specs: {
      "Display": "1.96 Super AMOLED",
      "Battery": "Up to 7 Days (300 mAh)",
      "Sensors": "Heart Rate, SpO2, Sleep, Stress",
      "Water Resistance": "IP68"
    },
    reviews: [
      { id: 1, author: "Chetan Parmar", rating: 4, date: "2026-11-04", comment: "Screen brightness in bright Ahmedabad sun is very impressive for this price.", verified: true }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 12,
    name: "Luxury Matte Finish Aviator Polarized Sunglasses",
    slug: "luxury-matte-finish-aviator-sunglasses",
    description: "Classic teardrop aviator frame in matte black with 9-layer TAC polarized lenses offering 100% UV400 protection against glare and harmful rays.",
    price: 1499,
    original_price: 2999,
    category: "Accessories",
    brand: "UrbanVision",
    image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews_count: 89,
    stock: 40,
    is_featured: false,
    is_trending: false,
    features: "100% UV400 protection (UVA & UVB)\nTriacetate Cellulose (TAC) 9-layer polarized lenses\nUltra-lightweight stainless steel alloy frame\nSpring hinges with soft silicone nose pads",
    specs: {
      "Frame Material": "Monel Steel Alloy",
      "Lens Material": "TAC Polarized",
      "Lens Width": "58 mm",
      "Bridge Width": "14 mm",
      "Includes": "Hard leather case & micro-fiber cloth"
    },
    reviews: [
      { id: 1, author: "Suresh Pillai", rating: 5, date: "2026-10-15", comment: "Driving during midday sun is so comfortable now. Glare is 100% cut off.", verified: true }
    ],
    created_at: new Date().toISOString()
  }
];

const INITIAL_COUPONS = [
  {
    code: "FIRST20",
    discount_type: "percentage",
    discount_value: 20,
    min_order: 999,
    max_discount: 5000,
    description: "Flat 20% OFF on all orders over ₹999 for first-time shoppers",
    active: true
  },
  {
    code: "SAVE10",
    discount_type: "percentage",
    discount_value: 10,
    min_order: 499,
    max_discount: 2000,
    description: "10% OFF on everyday essentials over ₹499",
    active: true
  },
  {
    code: "DIWALI500",
    discount_type: "flat",
    discount_value: 500,
    min_order: 2499,
    max_discount: 500,
    description: "Flat ₹500 discount on orders above ₹2,499",
    active: true
  },
  {
    code: "MEGA1000",
    discount_type: "flat",
    discount_value: 1000,
    min_order: 4999,
    max_discount: 1000,
    description: "Flat ₹1,000 instant discount on cart above ₹4,999",
    active: true
  }
];

const INITIAL_ORDERS = [
  {
    id: 1,
    order_number: "UK-261113-1001",
    invoice_number: "INV-2026-0001",
    customer_name: "Aarav Patel",
    customer_email: "aarav.patel@example.com",
    customer_phone: "+91 98765 43210",
    shipping_address: "402, Shivalik High Street, Judges Bungalow Rd",
    city: "Ahmedabad",
    postal_code: "380015",
    payment_method: "UPI",
    payment_status: "Paid",
    order_status: "Delivered",
    subtotal: 29990,
    discount: 5998,
    shipping_fee: 0,
    total_amount: 23992,
    courier: "UrbanKart Express (BlueDart)",
    awb_number: "BD-8849102",
    notes: "Please deliver before 6 PM",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 1,
        product_id: 1,
        product_name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        product_image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
        price: 29990,
        quantity: 1,
        total: 29990
      }
    ]
  },
  {
    id: 2,
    order_number: "UK-261113-1002",
    invoice_number: "INV-2026-0002",
    customer_name: "Pooja Sharma",
    customer_email: "pooja.sharma@example.com",
    customer_phone: "+91 98234 56789",
    shipping_address: "B-12, Green Park Society, Ring Road",
    city: "Surat",
    postal_code: "395007",
    payment_method: "COD",
    payment_status: "Pending",
    order_status: "Processing",
    subtotal: 11995,
    discount: 0,
    shipping_fee: 0,
    total_amount: 11995,
    courier: "Delhivery Surface",
    awb_number: "DL-9041223",
    notes: "",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 2,
        product_id: 4,
        product_name: "Nike Air Max 270 React Premium Sneakers",
        product_image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
        price: 11995,
        quantity: 1,
        total: 11995
      }
    ]
  }
];

const INITIAL_INQUIRIES = [
  {
    id: 1,
    name: "Vikram Mehta",
    email: "vikram@example.com",
    phone: "+91 97234 11223",
    subject: "Bulk Corporate Gifting Order (50 Units)",
    message: "Hi, we are looking to purchase 50 units of Sony noise-canceling headphones for corporate Diwali gifting in Ahmedabad. Can you please share wholesale pricing and GST invoice details?",
    status: "Unread",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

function getInitialDB() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("Admin@123", salt);

  return {
    admin: {
      id: 1,
      username: "admin",
      email: "admin@urbankart.com",
      hashed_password: hashedPassword,
      role: "admin"
    },
    products: INITIAL_PRODUCTS,
    coupons: INITIAL_COUPONS,
    orders: INITIAL_ORDERS,
    inquiries: INITIAL_INQUIRIES,
    nextIds: {
      product: 13,
      order: 3,
      inquiry: 2
    }
  };
}

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = getInitialDB();
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure coupons array exists
        if (!this.data.coupons) {
          this.data.coupons = INITIAL_COUPONS;
          this.save();
        }
      } catch (err) {
        console.error('Error loading DB file, resetting to initial data:', err);
        this.data = getInitialDB();
        this.save();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving DB file:', err);
    }
  }

  // Admin User
  getAdmin() {
    return this.data.admin;
  }

  // Products
  getProducts(filter = {}) {
    let result = [...this.data.products];

    if (filter.category && filter.category.toLowerCase() !== 'all') {
      result = result.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (filter.is_featured !== undefined) {
      result = result.filter(p => p.is_featured === filter.is_featured);
    }

    if (filter.is_trending !== undefined) {
      result = result.filter(p => p.is_trending === filter.is_trending);
    }

    if (filter.min_price !== undefined) {
      result = result.filter(p => p.price >= filter.min_price);
    }

    if (filter.max_price !== undefined) {
      result = result.filter(p => p.price <= filter.max_price);
    }

    if (filter.sort_by === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filter.sort_by === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filter.sort_by === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }

  getProductByIdOrSlug(idOrSlug) {
    if (!isNaN(idOrSlug)) {
      const id = parseInt(idOrSlug, 10);
      return this.data.products.find(p => p.id === id);
    }
    return this.data.products.find(p => p.slug === idOrSlug);
  }

  createProduct(productData) {
    const id = this.data.nextIds.product++;
    const slug = productData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[-\s]+/g, '-').trim() + '-' + id;
    const newProduct = {
      id,
      name: productData.name,
      slug: productData.slug || slug,
      description: productData.description || "",
      price: parseFloat(productData.price) || 0,
      original_price: parseFloat(productData.original_price) || Math.round(parseFloat(productData.price) * 1.25),
      category: productData.category || "General",
      brand: productData.brand || "UrbanKart",
      image_url: productData.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      rating: parseFloat(productData.rating) || 4.5,
      reviews_count: parseInt(productData.reviews_count) || 1,
      stock: parseInt(productData.stock) || 50,
      is_featured: !!productData.is_featured,
      is_trending: !!productData.is_trending,
      features: productData.features || "Verified Authentic\nOfficial Warranty Included",
      specs: productData.specs || { "Warranty": "1 Year", "Quality": "Grade A+" },
      reviews: [],
      created_at: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updateData) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updateData };
    this.save();
    return this.data.products[idx];
  }

  deleteProduct(id) {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  addProductReview(productId, reviewData) {
    const product = this.data.products.find(p => p.id === productId);
    if (!product) return null;
    if (!product.reviews) product.reviews = [];
    
    const newReview = {
      id: product.reviews.length + 1,
      author: reviewData.author || "Anonymous Customer",
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || "",
      date: new Date().toISOString().slice(0, 10),
      verified: true
    };
    product.reviews.unshift(newReview);
    product.reviews_count = product.reviews.length;
    
    // Recalculate average rating
    const sumRatings = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Math.round((sumRatings / product.reviews.length) * 10) / 10;
    
    this.save();
    return product;
  }

  // Categories
  getCategories() {
    const catMap = {};
    const catMeta = {
      "Electronics": {
        icon: "Cpu",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80",
        description: "Laptops, Headphones, Smartwatches & Gear"
      },
      "Fashion": {
        icon: "Shirt",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
        description: "Trending Apparel, Streetwear & Jackets"
      },
      "Footwear": {
        icon: "Footprints",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
        description: "Sneakers, Running Shoes & Casuals"
      },
      "Accessories": {
        icon: "Watch",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
        description: "Bags, Sunglasses, Belts & Wallets"
      },
      "Home & Living": {
        icon: "Home",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&auto=format&fit=crop&q=80",
        description: "Modern Decor, Lamps & Smart Home"
      }
    };

    this.data.products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    return Object.keys(catMap).map(catName => ({
      name: catName,
      count: catMap[catName],
      icon: catMeta[catName]?.icon || "Tag",
      image: catMeta[catName]?.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
      description: catMeta[catName]?.description || `Explore ${catName}`
    }));
  }

  // Coupons
  getCoupons() {
    return this.data.coupons || INITIAL_COUPONS;
  }

  validateCoupon(code, cartSubtotal) {
    if (!code) return { valid: false, message: "Coupon code is empty" };
    const coupons = this.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.active);
    if (!coupon) {
      return { valid: false, message: "Invalid or expired coupon code" };
    }
    if (cartSubtotal < coupon.min_order) {
      return { valid: false, message: `Minimum cart value of ₹${coupon.min_order.toLocaleString('en-IN')} required for ${coupon.code}` };
    }
    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = Math.round(cartSubtotal * (coupon.discount_value / 100));
      if (coupon.max_discount) discountAmount = Math.min(discountAmount, coupon.max_discount);
    } else {
      discountAmount = coupon.discount_value;
    }
    return {
      valid: true,
      code: coupon.code,
      discount: discountAmount,
      description: coupon.description,
      message: `🎉 Coupon ${coupon.code} applied! Saved ₹${discountAmount.toLocaleString('en-IN')}`
    };
  }

  createCoupon(couponData) {
    if (!this.data.coupons) this.data.coupons = [];
    const newCoupon = {
      code: couponData.code.trim().toUpperCase(),
      discount_type: couponData.discount_type || "percentage",
      discount_value: Number(couponData.discount_value) || 10,
      min_order: Number(couponData.min_order) || 499,
      max_discount: Number(couponData.max_discount) || 2000,
      description: couponData.description || `Special coupon ${couponData.code}`,
      active: true
    };
    this.data.coupons.push(newCoupon);
    this.save();
    return newCoupon;
  }

  deleteCoupon(code) {
    if (!this.data.coupons) return false;
    this.data.coupons = this.data.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    this.save();
    return true;
  }

  // Orders
  getOrders(filter = {}) {
    let result = [...this.data.orders];
    if (filter.order_status && filter.order_status.toLowerCase() !== 'all') {
      result = result.filter(o => o.order_status.toLowerCase() === filter.order_status.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(o =>
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_email.toLowerCase().includes(q) ||
        o.customer_phone.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getOrderByNumber(orderNumber) {
    return this.data.orders.find(o => o.order_number.toUpperCase() === orderNumber.trim().toUpperCase());
  }

  createOrder(orderData) {
    const id = this.data.nextIds.order++;
    const timestamp = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const rand = Math.floor(1000 + Math.random() * 9000);
    const order_number = `UK-${timestamp}-${rand}`;
    const invoice_number = `INV-2026-${String(id).padStart(4, '0')}`;

    let subtotal = 0;
    const orderItems = [];

    for (const item of orderData.items) {
      const product = this.data.products.find(p => p.id === item.product_id);
      if (!product) {
        throw new Error(`Product ID ${item.product_id} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for '${product.name}'. Available: ${product.stock}`);
      }

      product.stock -= item.quantity;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: item.product_id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.image_url,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Coupon discount logic
    let discount = 0;
    if (orderData.promo_code) {
      const val = this.validateCoupon(orderData.promo_code, subtotal);
      if (val.valid) {
        discount = val.discount;
      }
    }

    const shipping_fee = (subtotal - discount) >= 999 ? 0 : 99;
    const total_amount = Math.max(0, subtotal - discount + shipping_fee);

    const newOrder = {
      id,
      order_number,
      invoice_number,
      customer_name: orderData.customer_name,
      customer_email: orderData.customer_email,
      customer_phone: orderData.customer_phone,
      shipping_address: orderData.shipping_address,
      city: orderData.city,
      postal_code: orderData.postal_code,
      payment_method: orderData.payment_method || 'COD',
      payment_status: ['UPI', 'CARD', 'NETBANKING'].includes(orderData.payment_method) ? 'Paid' : 'Pending',
      order_status: 'Processing',
      subtotal,
      discount,
      shipping_fee,
      total_amount,
      courier: "UrbanKart Express (BlueDart / Delhivery)",
      awb_number: `UBK-${Math.floor(1000000 + Math.random() * 9000000)}`,
      notes: orderData.notes || '',
      created_at: new Date().toISOString(),
      items: orderItems
    };

    this.data.orders.unshift(newOrder);
    this.save();
    return newOrder;
  }

  updateOrderStatus(orderId, statusData) {
    const order = this.data.orders.find(o => o.id === orderId);
    if (!order) return null;
    if (statusData.order_status) order.order_status = statusData.order_status;
    if (statusData.payment_status) order.payment_status = statusData.payment_status;
    if (statusData.courier) order.courier = statusData.courier;
    if (statusData.awb_number) order.awb_number = statusData.awb_number;
    this.save();
    return order;
  }

  // Inquiries
  getInquiries() {
    return [...this.data.inquiries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createInquiry(inqData) {
    const id = this.data.nextIds.inquiry++;
    const newInq = {
      id,
      name: inqData.name,
      email: inqData.email,
      phone: inqData.phone || '',
      subject: inqData.subject || 'Customer Support',
      message: inqData.message,
      status: 'Unread',
      created_at: new Date().toISOString()
    };
    this.data.inquiries.unshift(newInq);
    this.save();
    return newInq;
  }

  updateInquiryStatus(id, status) {
    const inq = this.data.inquiries.find(i => i.id === id);
    if (!inq) return null;
    inq.status = status;
    this.save();
    return inq;
  }

  // Analytics
  getAnalytics() {
    const total_revenue = this.data.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const total_orders = this.data.orders.length;
    const total_products = this.data.products.length;
    const pending_orders = this.data.orders.filter(o => ['Processing', 'Pending'].includes(o.order_status)).length;
    const delivered_orders = this.data.orders.filter(o => o.order_status === 'Delivered').length;
    const low_stock_count = this.data.products.filter(p => p.stock <= 10).length;
    const avg_order_value = total_orders > 0 ? Math.round(total_revenue / total_orders) : 0;
    const recent_orders = this.data.orders.slice(0, 6);

    // Dynamic Monthly Sales Chart Data (Last 6 Months Simulation)
    const monthNames = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
    const salesChart = [
      { month: "Jun", sales: 124000, orders: 18 },
      { month: "Jul", sales: 189000, orders: 27 },
      { month: "Aug", sales: 245000, orders: 36 },
      { month: "Sep", sales: 310000, orders: 45 },
      { month: "Oct", sales: 420000, orders: 62 },
      { month: "Nov", sales: Math.max(total_revenue, 480000), orders: Math.max(total_orders, 70) }
    ];

    // Category Sales Distribution
    const catCounts = {};
    this.data.products.forEach(p => {
      catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    });

    return {
      total_revenue: Math.round(total_revenue),
      total_orders,
      total_products,
      pending_orders,
      delivered_orders,
      low_stock_count,
      avg_order_value,
      salesChart,
      categoryCounts: catCounts,
      recent_orders
    };
  }
}

module.exports = new Database();
