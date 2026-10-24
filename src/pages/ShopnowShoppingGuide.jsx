import React, { useState, useEffect, useRef, useMemo } from 'react'
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  Upload,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  User,
  Tag,
  Filter,
  ArrowUpDown,
  ExternalLink,
  RotateCw,
  LayoutGrid,
  List,
  Sparkles,
  TrendingUp,
  FileText,
  Share2,
  CheckSquare
} from 'lucide-react'
import './ShopnowShoppingGuide.css'

// Import asset images
import blog1Img from '../assets/Blog 1.jpeg'
import blog2Img from '../assets/Blog 2.jpeg'
import blog3Img from '../assets/Blog 3.jpeg'
import blog4Img from '../assets/Blog 4.jpeg'
import blog5Img from '../assets/Blog 5.jpeg'

const ASSET_IMAGES = [
  { name: 'Blog 1', img: blog1Img },
  { name: 'Blog 2', img: blog2Img },
  { name: 'Blog 3', img: blog3Img },
  { name: 'Blog 4', img: blog4Img },
  { name: 'Blog 5', img: blog5Img },
]

// Blog 1: 10 Smart Tips for a Better Online Shopping Experience
export const BLOG_1 = {
  id: 'blog-1',
  title: '10 Smart Tips for a Better Online Shopping Experience',
  slug: '10-smart-tips-for-a-better-online-shopping-experience',
  category: 'Shopping Tips',
  author: 'Shopnow4u Team',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  coverImage: blog1Img,
  readTime: '4 min read',
  publishedDate: '2026-10-23',
  createdAt: 1729677600000,
  status: 'Published',
  featured: true,
  views: 3120,
  excerpt: 'Online shopping makes it easy to explore products and shop from the comfort of your home. However, making informed decisions is important to enjoy a smooth and convenient shopping experience.',
  content: `Introduction

Online shopping makes it easy to explore products and shop from the comfort of your home. However, making informed decisions is important to enjoy a smooth and convenient shopping experience.

1. Make a Shopping List
Identify the products you need before browsing. This helps you focus on your requirements and manage your budget.

2. Compare Products
Review product features, specifications, sizes, and prices before making a purchase.

3. Read Product Descriptions
Check the available product details carefully to understand what you are buying.

4. Check the Final Price
Review applicable delivery charges, taxes, discounts, and the total payable amount before checkout.

5. Choose the Right Payment Method
Select an available payment method that suits your needs. Review the payment details before confirming your order.

6. Enter the Correct Address
Provide accurate delivery information to help avoid unnecessary delays.

7. Review Your Cart
Check the product, quantity, size, and price before placing your order.

8. Track Your Orders
Keep your order ID and use the tracking facility if it is available on the website.

9. Understand Return Policies
Review the applicable cancellation, return, and refund conditions before purchasing.

10. Shop Safely
Never share your OTP or confidential banking credentials with anyone. Use official website channels for shopping and support.

Conclusion

Smart shopping starts with careful product selection, secure payment practices, and accurate order information. Follow these tips to make more informed online shopping decisions.

Explore the available products at Shopnow4u.com.`,
  tags: ['Shopping Tips', 'Online Shopping', 'Smart Shopping', 'Shopnow4u', 'Buying Guide']
}

// Blog 2: How to Shop Safely Online
export const BLOG_2 = {
  id: 'blog-2',
  title: 'How to Shop Safely Online: A Customer Guide',
  slug: 'how-to-shop-safely-online-a-customer-guide',
  category: 'Online Safety',
  author: 'Shopnow4u Team',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  coverImage: blog2Img,
  readTime: '3 min read',
  publishedDate: '2026-10-23',
  createdAt: 1729692000000,
  status: 'Published',
  featured: true,
  views: 2840,
  excerpt: 'Online shopping is convenient, but protecting your personal information is essential. A few basic precautions can help you reduce the risk of fraud and unauthorized account access.',
  content: `Introduction

Online shopping is convenient, but protecting your personal information is essential. A few basic precautions can help you reduce the risk of fraud and unauthorized account access.

Verify the Website

Always check the website address before entering personal information or making a payment. Avoid unfamiliar links sent through suspicious messages.

Protect Your OTP

OTPs are used to verify your identity during login or other transactions. Never share an OTP with another person, even if they claim to represent customer support.

Use Secure Payment Methods

Use the payment options provided through the website's official checkout process. Never share your banking password or confidential payment credentials through messages or calls.

Check Order Details

Review the product, quantity, delivery address, and payable amount before confirming your order.

Avoid Suspicious Offers

Be cautious of messages promising unrealistic discounts or asking you to pay through unknown links.

Keep Your Account Secure

Log out when using a shared device and report suspicious account activity through the official support channel.

Conclusion

Safe online shopping depends on awareness, careful verification, and responsible handling of personal information. Make security a priority whenever you shop online.

Visit Shopnow4u.com to explore the website.`,
  tags: ['Online Safety', 'Account Security', 'Safe Shopping', 'Shopnow4u', 'Customer Guide']
}

// Blog 3: How to Choose the Right Product When Shopping Online
export const BLOG_3 = {
  id: 'blog-3',
  title: 'How to Choose the Right Product When Shopping Online',
  slug: 'how-to-choose-the-right-product-when-shopping-online',
  category: 'Product Guides',
  author: 'Shopnow4u Team',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  coverImage: blog3Img,
  readTime: '3 min read',
  publishedDate: '2026-10-24',
  createdAt: 1729764300000,
  status: 'Published',
  featured: true,
  views: 2650,
  excerpt: 'With so many products available online, choosing the right one can sometimes feel confusing. Comparing important details before purchasing helps you select products that match your needs.',
  content: `Introduction

With so many products available online, choosing the right one can sometimes feel confusing. Comparing important details before purchasing helps you select products that match your needs.

Understand Your Requirements

Start by identifying the purpose of the product and the features you need.

Compare Specifications

Check dimensions, materials, compatibility, size, colour, and other relevant specifications depending on the product category.

Set a Budget

Decide how much you want to spend and compare products within your budget.

Read Available Reviews

If customer reviews are available, read them to understand other buyers' experiences. Consider both positive and negative feedback.

Check Delivery and Return Conditions

Review delivery information and the applicable return or replacement policy before placing an order.

Review Before Purchasing

Make sure the selected product and variant match your requirements.

Conclusion

A little research before purchasing can help you make more confident decisions. Focus on your needs, compare relevant features, and review the product information carefully.

Browse the available product categories on Shopnow4u.com.`,
  tags: ['Product Guides', 'Smart Shopping', 'Shopnow4u', 'Buying Guide', 'Product Comparison']
}

// Blog 4: Understanding Online Orders, Delivery and Returns
export const BLOG_4 = {
  id: 'blog-4',
  title: 'A Simple Guide to Online Orders, Delivery and Returns',
  slug: 'a-simple-guide-to-online-orders-delivery-and-returns',
  category: 'Orders & Delivery',
  author: 'Shopnow4u Team',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  coverImage: blog4Img,
  readTime: '4 min read',
  publishedDate: '2026-10-24',
  createdAt: 1729764600000,
  status: 'Published',
  featured: true,
  views: 2430,
  excerpt: 'Understanding the online ordering process helps customers know what to expect after making a purchase. From checkout to delivery, each step plays an important role in a smooth shopping experience.',
  content: `Introduction

Understanding the online ordering process helps customers know what to expect after making a purchase. From checkout to delivery, each step plays an important role in a smooth shopping experience.

Step 1: Select Your Product

Choose the product you want and review its description, price, and available options.

Step 2: Complete Checkout

Enter your delivery information, review the order total, and select an available payment method.

Step 3: Save Your Order Details

Keep the order confirmation and order ID for future reference.

Step 4: Check the Order Status

Use the website's order tracking facility if available. Delivery updates may depend on the order status and logistics provider.

Step 5: Contact Support if Needed

If your order is delayed or you receive an incorrect or damaged product, contact the official customer support team and provide the relevant order details.

Step 6: Review the Return Policy

Before requesting a return or refund, check the product's eligibility, applicable deadlines, and required procedure.

Conclusion

Knowing the ordering and return process helps you manage purchases more effectively. Always keep your order details and review the applicable policies when you need assistance.`,
  tags: ['Orders & Delivery', 'Order Tracking', 'Delivery Guide', 'Returns & Refunds', 'Shopnow4u']
}

// Blog 5: Why Product Information Matters Before Buying
export const BLOG_5 = {
  id: 'blog-5',
  title: 'Why You Should Always Read Product Details Before Buying',
  slug: 'why-you-should-always-read-product-details-before-buying',
  category: 'Shopping Guide',
  author: 'Shopnow4u Team',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
  coverImage: blog5Img,
  readTime: '3 min read',
  publishedDate: '2026-10-24',
  createdAt: 1729764840000,
  status: 'Published',
  featured: true,
  views: 2180,
  excerpt: 'When shopping online, customers cannot always inspect a product physically before purchasing it. This makes product descriptions and specifications especially important.',
  content: `Introduction

When shopping online, customers cannot always inspect a product physically before purchasing it. This makes product descriptions and specifications especially important.

Understand the Product's Features

Read the description to learn about its functionality, materials, dimensions, and intended use.

Check Size and Compatibility

For clothing, furniture, electronics, and accessories, check the relevant size charts or compatibility details where available.

Review Images Carefully

Product images can help you understand appearance and design, but always refer to the written description for exact specifications.

Check What Is Included

Review whether accessories, batteries, installation services, or other items are included, where relevant.

Understand the Applicable Policies

Check warranty information, delivery conditions, and return eligibility where provided.

Make an Informed Decision

Compare the available information with your requirements before completing the purchase.

Conclusion

Reading product details helps set realistic expectations and reduces the chances of choosing an unsuitable item. Take a few moments to review the information before placing an order.`,
  tags: ['Shopping Guide', 'Product Details', 'Smart Buying', 'Online Shopping', 'Shopnow4u']
}

// Default Shopping Guides Library for Shopnow4u (ordered newest-first)
export const DEFAULT_SHOPPING_GUIDES = [
  BLOG_5,
  BLOG_4,
  BLOG_3,
  BLOG_2,
  BLOG_1,
  {
    id: 'guide-1',
    title: 'The Ultimate Smartphone Buying Guide 2026: Budget to Flagship',
    slug: 'the-ultimate-smartphone-buying-guide-2026',
    category: 'Electronics & Gadgets',
    author: 'Shopnow4u Tech Desk',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '6 min read',
    publishedDate: '2026-10-20',
    status: 'Published',
    featured: true,
    views: 14250,
    excerpt: 'Looking for a new phone? Discover our handpicked recommendations across processor speeds, AMOLED displays, 5G bands, and camera setups for every budget on Shopnow4u.',
    content: `Choosing the right smartphone in 2026 comes down to balancing performance, battery life, camera optics, and long-term software support.

### Key Factors to Evaluate:
1. **Processor & RAM**: For seamless multitasking and gaming, look for at least 8GB RAM paired with modern 4nm or 3nm chipsets.
2. **Display Quality**: Opt for 120Hz FHD+ AMOLED panels with high peak nits brightness for crisp outdoor visibility.
3. **Camera Systems**: Don't just chase megapixel numbers. Prioritize Optical Image Stabilization (OIS) and versatile ultrawide or telephoto lenses.
4. **Fast Charging & Battery**: A 5,000mAh battery coupled with 45W+ fast charging ensures you never run out of juice during demanding workdays.

Browse verified vendors on Shopnow4u with genuine warranties and express doorstep delivery!`,
    tags: ['Smartphones', 'Gadgets', 'Buying Guide', 'Tech Deals']
  },
  {
    id: 'guide-2',
    title: 'Top 10 Festive Fashion Trends: Elevate Your Wardrobe with Style',
    slug: 'top-10-festive-fashion-trends-season',
    category: 'Fashion & Style',
    author: 'Priya Sharma (Fashion Stylist)',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '4 min read',
    publishedDate: '2026-10-18',
    status: 'Published',
    featured: true,
    views: 18920,
    excerpt: 'From pastel ethnic ensembles to contemporary Indo-Western fusion wear, explore the seasonal fashion guide curated specifically for Shopnow4u shoppers.',
    content: `The festive season calls for effortless elegance. This year, the fashion world embraces breezy natural fabrics, subtle metallic embroideries, and versatile silhouettes.

### Trending Styles This Season:
- **Pastel Chanderi & Organza Kurtas**: Breathable yet royal, pastel tones like sage green, blush pink, and powder blue dominate festive celebrations.
- **Indo-Western Co-ords**: Perfect for house parties and casual festive evenings where comfort meets chic sophistication.
- **Statement Accessories**: Pair minimalist outfits with bold oxidised or polki earrings from Shopnow4u's jewellery marketplace.

Explore the curated festive collection today with special coupon discounts!`,
    tags: ['Fashion', 'Ethnic Wear', 'Style Guide', 'Festive Offers']
  },
  {
    id: 'guide-3',
    title: 'Smart Shopping Hacks: How to Stack Coupons & Save Up to 40% on Shopnow4u',
    slug: 'smart-shopping-hacks-stack-coupons',
    category: 'Smart Shopping Tips',
    author: 'Shopnow4u Savings Team',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '5 min read',
    publishedDate: '2026-10-15',
    status: 'Published',
    featured: false,
    views: 22410,
    excerpt: 'Unlock hidden savings on your cart. Master the art of combining seasonal discounts, vendor vouchers, and payment gateway cashbacks on Shopnow4u.',
    content: `Why pay full price when you can optimize your cart with smart savings strategies? Here is your insider guide:

### Pro Tips for Maximum Discounts:
1. **Combine Vendor Vouchers with Platform Coupons**: Always check the product page for instant vendor-level coupons before applying sitewide promo codes at checkout.
2. **Preferred Payment Cashbacks**: Look out for bank tie-ups and UPI offers that give instant 5% to 10% direct statement credits.
3. **Add to Wishlist for Price Drop Alerts**: Shopnow4u notifies you in real-time when items in your wishlist go on flash sale.
4. **Bundle Orders for Free Shipping**: Save on delivery fees by consolidating your daily essentials into one single dispatch order.`,
    tags: ['Savings', 'Coupon Codes', 'Cashback', 'Smart Shopping']
  },
  {
    id: 'guide-4',
    title: 'Best Smart Home Appliances for Modern Indian Kitchens in 2026',
    slug: 'best-smart-home-appliances-kitchen',
    category: 'Home & Living',
    author: 'Amit Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '7 min read',
    publishedDate: '2026-10-12',
    status: 'Published',
    featured: false,
    views: 9840,
    excerpt: 'Upgrade your culinary space with energy-efficient air fryers, intelligent dishwashers, and app-controlled multi-cookers reviewed by our home experts.',
    content: `Modern kitchens are smarter, cleaner, and significantly faster thanks to next-gen appliances designed for everyday Indian cooking.

### Essential Appliances to Consider:
- **Digital Dual-Zone Air Fryers**: Cook crispy snacks with up to 85% less oil without compromising on authentic taste.
- **Smart BLDC Inverter Mixers**: Powerful copper motors with silent operations and overload protection for wet and dry grinding.
- **Intelligent Water Purifiers with Mineral Retention**: IoT-enabled alerts when filter cartridges need replacement.

All featured appliances come with brand warranty and official technician installation through Shopnow4u.`,
    tags: ['Kitchen Appliances', 'Home Improvement', 'Air Fryer', 'Smart Home']
  },
  {
    id: 'guide-5',
    title: 'Complete Guide to Choosing the Right Running Shoes: Comfort, Fit & Grip',
    slug: 'guide-to-choosing-running-shoes',
    category: 'Fitness & Sports',
    author: 'Rohan Sen',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150',
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800&h=500',
    readTime: '5 min read',
    publishedDate: '2026-10-08',
    status: 'Draft',
    featured: false,
    views: 0,
    excerpt: 'Prevent running injuries and enhance your athletic stamina. Understand pronation, arch support, and cushioning foams before clicking buy.',
    content: `Finding the perfect running shoe is not just about aesthetics—it directly impacts knee safety, joint longevity, and endurance.

### What to Look For:
1. **Pronation Analysis**: Determine whether you have neutral arches, flat feet (overpronation), or high arches (supination).
2. **Cushioning vs Ground Feel**: Daily trainers need plush nitrogen-infused foam, whereas racing flats prioritize snappy energy return.
3. **Breathable Mesh Upper**: Ensures airflow during high-intensity training sessions.`,
    tags: ['Fitness', 'Running Shoes', 'Sports Gear', 'Health']
  }
]

const CATEGORIES_LIST = [
  'All Categories',
  'Shopping Guide',
  'Shopping Tips',
  'Online Safety',
  'Product Guides',
  'Orders & Delivery',
  'Electronics & Gadgets',
  'Fashion & Style',
  'Smart Shopping Tips',
  'Home & Living',
  'Fitness & Sports',
  'Beauty & Personal Care',
  'Gift Guides'
]

// Helper to calculate exact chronological timestamp so latest blogs are always on top
export const getGuideTimestamp = (item) => {
  if (item?.createdAt) return Number(item.createdAt)
  const parsed = new Date(item?.publishedDate || 0).getTime()
  const numId = parseInt(String(item?.id || '').replace(/\D/g, '') || '0', 10)
  return (isNaN(parsed) ? 0 : parsed) + numId
}

export default function ShopnowShoppingGuide() {
  // 1. Guides State with localStorage persistence and automatic BLOG_1, BLOG_2, BLOG_3, BLOG_4 & BLOG_5 injection
  const [guides, setGuides] = useState(() => {
    try {
      const stored = localStorage.getItem('shopnow4u_shopping_guides')
      if (stored) {
        let parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if BLOG_1 is already present or needs updating with Blog 1.jpeg
          const b1Index = parsed.findIndex(
            g => g.id === 'blog-1' || g.title?.includes('10 Smart Tips for a Better Online Shopping Experience')
          )
          if (b1Index === -1) {
            parsed = [BLOG_1, ...parsed]
          } else {
            parsed[b1Index] = { ...parsed[b1Index], ...BLOG_1, coverImage: blog1Img }
          }

          // Check if BLOG_2 is already present or needs updating with Blog 2.jpeg
          const b2Index = parsed.findIndex(
            g => g.id === 'blog-2' || g.title?.includes('How to Shop Safely Online')
          )
          if (b2Index === -1) {
            const currentB1Idx = parsed.findIndex(g => g.id === 'blog-1')
            if (currentB1Idx !== -1) {
              parsed.splice(currentB1Idx + 1, 0, BLOG_2)
            } else {
              parsed.unshift(BLOG_2)
            }
          } else {
            parsed[b2Index] = { ...parsed[b2Index], ...BLOG_2, coverImage: blog2Img }
          }

          // Check if BLOG_3 is already present or needs updating with Blog 3.jpeg
          const b3Index = parsed.findIndex(
            g => g.id === 'blog-3' || g.title?.includes('How to Choose the Right Product')
          )
          if (b3Index === -1) {
            const currentB2Idx = parsed.findIndex(g => g.id === 'blog-2')
            if (currentB2Idx !== -1) {
              parsed.splice(currentB2Idx + 1, 0, BLOG_3)
            } else {
              const currentB1Idx = parsed.findIndex(g => g.id === 'blog-1')
              if (currentB1Idx !== -1) {
                parsed.splice(currentB1Idx + 1, 0, BLOG_3)
              } else {
                parsed.unshift(BLOG_3)
              }
            }
          } else {
            parsed[b3Index] = { ...parsed[b3Index], ...BLOG_3, coverImage: blog3Img }
          }

          // Check if BLOG_4 is already present or needs updating with Blog 4.jpeg
          const b4Index = parsed.findIndex(
            g => g.id === 'blog-4' || g.title?.includes('A Simple Guide to Online Orders, Delivery and Returns')
          )
          if (b4Index === -1) {
            const currentB3Idx = parsed.findIndex(g => g.id === 'blog-3')
            if (currentB3Idx !== -1) {
              parsed.splice(currentB3Idx + 1, 0, BLOG_4)
            } else {
              const currentB2Idx = parsed.findIndex(g => g.id === 'blog-2')
              if (currentB2Idx !== -1) {
                parsed.splice(currentB2Idx + 1, 0, BLOG_4)
              } else {
                parsed.unshift(BLOG_4)
              }
            }
          } else {
            parsed[b4Index] = { ...parsed[b4Index], ...BLOG_4, coverImage: blog4Img }
          }

          // Check if BLOG_5 is already present or needs updating with Blog 5.jpeg
          const b5Index = parsed.findIndex(
            g => g.id === 'blog-5' || g.title?.includes('Why You Should Always Read Product Details Before Buying')
          )
          if (b5Index === -1) {
            const currentB4Idx = parsed.findIndex(g => g.id === 'blog-4')
            if (currentB4Idx !== -1) {
              parsed.splice(currentB4Idx + 1, 0, BLOG_5)
            } else {
              const currentB3Idx = parsed.findIndex(g => g.id === 'blog-3')
              if (currentB3Idx !== -1) {
                parsed.splice(currentB3Idx + 1, 0, BLOG_5)
              } else {
                parsed.unshift(BLOG_5)
              }
            }
          } else {
            parsed[b5Index] = { ...parsed[b5Index], ...BLOG_5, coverImage: blog5Img }
          }

          // Ensure guide-2 has its distinct cover image so it doesn't conflict with Blog 3
          const g2Index = parsed.findIndex(g => g.id === 'guide-2')
          if (g2Index !== -1 && parsed[g2Index].coverImage === blog3Img) {
            parsed[g2Index] = {
              ...parsed[g2Index],
              coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800&h=500'
            }
          }

          // Ensure guide-3 has its distinct cover image so it doesn't conflict with Blog 4
          const g3Index = parsed.findIndex(g => g.id === 'guide-3')
          if (g3Index !== -1 && parsed[g3Index].coverImage === blog4Img) {
            parsed[g3Index] = {
              ...parsed[g3Index],
              coverImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800&h=500'
            }
          }

          // Ensure guide-4 has its distinct cover image so it doesn't conflict with Blog 5
          const g4Index = parsed.findIndex(g => g.id === 'guide-4')
          if (g4Index !== -1 && parsed[g4Index].coverImage === blog5Img) {
            parsed[g4Index] = {
              ...parsed[g4Index],
              coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800&h=500'
            }
          }

          // Sort loaded guides newest first so the latest uploaded blog is always at the top
          parsed.sort((a, b) => getGuideTimestamp(b) - getGuideTimestamp(a))

          return parsed
        }
      }
    } catch (e) {
      console.warn('Failed to load shopping guides from localStorage:', e)
    }
    return DEFAULT_SHOPPING_GUIDES
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('shopnow4u_shopping_guides', JSON.stringify(guides))
    } catch (e) {
      console.warn('Could not save shopping guides:', e)
    }
  }, [guides])

  // Helper to trigger global toast
  const triggerToast = (text, type = 'success') => {
    window.dispatchEvent(
      new CustomEvent('app:toast', {
        detail: { text, type }
      })
    )
  }

  // 2. Filter & View States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'table'

  // 3. Modal States
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingGuideId, setEditingGuideId] = useState(null)
  const [previewGuide, setPreviewGuide] = useState(null)
  const [deleteConfirmGuide, setDeleteConfirmGuide] = useState(null)

  // 4. Form State for Upload / Edit
  const [formTitle, setFormTitle] = useState('')
  const [formCategory, setFormCategory] = useState('Shopping Tips')
  const [formAuthor, setFormAuthor] = useState('Shopnow4u Team')
  const [formReadTime, setFormReadTime] = useState('4 min read')
  const [formCoverImage, setFormCoverImage] = useState('')
  const [formExcerpt, setFormExcerpt] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formStatus, setFormStatus] = useState('Published')
  const [formFeatured, setFormFeatured] = useState(false)
  const [formTagInput, setFormTagInput] = useState('')
  const [formTags, setFormTags] = useState([])

  const fileInputRef = useRef(null)

  // Reset form
  const resetForm = () => {
    setFormTitle('')
    setFormCategory('Shopping Tips')
    setFormAuthor('Shopnow4u Team')
    setFormReadTime('4 min read')
    setFormCoverImage('')
    setFormExcerpt('')
    setFormContent('')
    setFormStatus('Published')
    setFormFeatured(false)
    setFormTagInput('')
    setFormTags([])
    setIsEditMode(false)
    setEditingGuideId(null)
  }

  // Open Upload Modal
  const handleOpenUploadModal = () => {
    resetForm()
    setIsUploadModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (guide) => {
    setFormTitle(guide.title || '')
    setFormCategory(guide.category || 'Shopping Tips')
    setFormAuthor(guide.author || 'Shopnow4u Team')
    setFormReadTime(guide.readTime || '4 min read')
    setFormCoverImage(guide.coverImage || '')
    setFormExcerpt(guide.excerpt || '')
    setFormContent(guide.content || '')
    setFormStatus(guide.status || 'Published')
    setFormFeatured(Boolean(guide.featured))
    setFormTags(Array.isArray(guide.tags) ? [...guide.tags] : [])
    setFormTagInput('')
    setIsEditMode(true)
    setEditingGuideId(guide.id)
    setIsUploadModalOpen(true)
  }

  // Handle Image Upload from disk (FileReader -> Base64 data URL)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        triggerToast('Image file size must be less than 5MB', 'error')
        return
      }
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormCoverImage(event.target.result)
        triggerToast('Image uploaded successfully', 'success')
      }
      reader.readAsDataURL(file)
    }
  }

  // Add Tag
  const handleAddTag = () => {
    const trimmed = formTagInput.trim().replace(/^#/, '')
    if (trimmed && !formTags.includes(trimmed)) {
      setFormTags([...formTags, trimmed])
      setFormTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormTags(formTags.filter(t => t !== tagToRemove))
  }

  // Handle Form Submit (Create or Update)
  const handleSaveGuide = (e) => {
    e.preventDefault()

    if (!formTitle.trim()) {
      triggerToast('Please provide a blog title', 'error')
      return
    }

    if (!formContent.trim()) {
      triggerToast('Please provide blog content', 'error')
      return
    }

    const defaultImages = [blog1Img, blog2Img, blog3Img, blog4Img, blog5Img]
    const imageToUse = formCoverImage.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)]
    const dateStr = new Date().toISOString().split('T')[0]
    const slugStr = formTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    if (isEditMode && editingGuideId) {
      // Update existing
      setGuides(prev =>
        prev.map(g => {
          if (g.id === editingGuideId) {
            return {
              ...g,
              title: formTitle.trim(),
              slug: slugStr,
              category: formCategory,
              author: formAuthor.trim() || 'Shopnow4u Team',
              readTime: formReadTime.trim() || '4 min read',
              coverImage: imageToUse,
              excerpt: formExcerpt.trim() || formContent.slice(0, 160) + '...',
              content: formContent.trim(),
              status: formStatus,
              featured: formFeatured,
              tags: formTags.length > 0 ? formTags : ['Shopping Tips', 'Guide']
            }
          }
          return g
        })
      )
      triggerToast('Shopping Guide updated successfully!', 'success')
    } else {
      // Create new with current timestamp
      const now = Date.now()
      const newGuide = {
        id: `guide-${now}`,
        createdAt: now,
        title: formTitle.trim(),
        slug: slugStr,
        category: formCategory,
        author: formAuthor.trim() || 'Shopnow4u Team',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
        coverImage: imageToUse,
        readTime: formReadTime.trim() || '4 min read',
        publishedDate: dateStr,
        status: formStatus,
        featured: formFeatured,
        views: 0,
        excerpt: formExcerpt.trim() || formContent.slice(0, 160) + '...',
        content: formContent.trim(),
        tags: formTags.length > 0 ? formTags : ['Shopping Tips', 'Guide']
      }

      setGuides([newGuide, ...guides])
      triggerToast('New Shopping Guide uploaded successfully!', 'success')
    }

    setIsUploadModalOpen(false)
    resetForm()
  }

  // Handle Delete
  const handleConfirmDelete = () => {
    if (deleteConfirmGuide) {
      setGuides(prev => prev.filter(g => g.id !== deleteConfirmGuide.id))
      triggerToast(`Deleted "${deleteConfirmGuide.title}" successfully`, 'success')
      setDeleteConfirmGuide(null)
    }
  }

  // Toggle Published/Draft status
  const handleToggleStatus = (guideId) => {
    setGuides(prev =>
      prev.map(g => {
        if (g.id === guideId) {
          const newStatus = g.status === 'Published' ? 'Draft' : 'Published'
          triggerToast(`Guide status changed to ${newStatus}`, 'success')
          return { ...g, status: newStatus }
        }
        return g
      })
    )
  }

  // Reset to default sample guides
  const handleResetDefaults = () => {
    setGuides(DEFAULT_SHOPPING_GUIDES)
    try {
      localStorage.setItem('shopnow4u_shopping_guides', JSON.stringify(DEFAULT_SHOPPING_GUIDES))
    } catch {}
    triggerToast('Shopping guides refreshed to default library', 'success')
  }

  // Filter & Search Logic
  const filteredGuides = useMemo(() => {
    return guides.filter(guide => {
      // Search matches
      const query = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !query ||
        guide.title.toLowerCase().includes(query) ||
        (guide.excerpt && guide.excerpt.toLowerCase().includes(query)) ||
        (guide.author && guide.author.toLowerCase().includes(query)) ||
        (guide.category && guide.category.toLowerCase().includes(query)) ||
        (guide.tags && guide.tags.some(t => t.toLowerCase().includes(query)))

      // Category matches
      const matchesCategory =
        selectedCategory === 'All Categories' || guide.category === selectedCategory

      // Status matches
      const matchesStatus =
        selectedStatus === 'All Status' || guide.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    }).sort((a, b) => {
      if (sortBy === 'newest') {
        return getGuideTimestamp(b) - getGuideTimestamp(a)
      }
      if (sortBy === 'oldest') {
        return getGuideTimestamp(a) - getGuideTimestamp(b)
      }
      if (sortBy === 'views') {
        return (b.views || 0) - (a.views || 0)
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })
  }, [guides, searchQuery, selectedCategory, selectedStatus, sortBy])

  // Metrics counts
  const totalCount = guides.length
  const publishedCount = guides.filter(g => g.status === 'Published').length
  const draftCount = guides.filter(g => g.status === 'Draft').length
  const totalViews = guides.reduce((acc, curr) => acc + (curr.views || 0), 0)

  return (
    <div className="shopping-guide-page">
      {/* ─────────────────────────────────────────
          Header Section
      ───────────────────────────────────────── */}
      <div className="sg-header-wrapper">
        <div className="sg-title-group">
          <h1>
            <BookOpen size={28} color="#84cc16" />
            Shopnow4u Shopping Guide
            <span className="sg-badge-brand">Blog & Guides</span>
          </h1>
          <p>
            Create, manage, and publish shopping guides, product reviews, and blog articles for Shopnow4u customers.
          </p>
        </div>

        <div className="sg-header-actions">
          <button
            className="sg-btn-secondary"
            onClick={handleResetDefaults}
            title="Refresh default library"
          >
            <RotateCw size={16} />
            Reset Data
          </button>
          <button
            className="sg-btn-primary"
            onClick={handleOpenUploadModal}
          >
            <Plus size={18} />
            Upload New Blog
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          Metrics Overview Cards
      ───────────────────────────────────────── */}
      <div className="sg-metrics-grid">
        <div className="sg-metric-card">
          <div className="sg-metric-icon total">
            <BookOpen size={24} />
          </div>
          <div className="sg-metric-info">
            <span className="sg-metric-label">Total Guides</span>
            <span className="sg-metric-value">{totalCount}</span>
          </div>
        </div>

        <div className="sg-metric-card">
          <div className="sg-metric-icon published">
            <CheckCircle2 size={24} />
          </div>
          <div className="sg-metric-info">
            <span className="sg-metric-label">Published Blogs</span>
            <span className="sg-metric-value">{publishedCount}</span>
          </div>
        </div>

        <div className="sg-metric-card">
          <div className="sg-metric-icon draft">
            <Clock size={24} />
          </div>
          <div className="sg-metric-info">
            <span className="sg-metric-label">Draft Guides</span>
            <span className="sg-metric-value">{draftCount}</span>
          </div>
        </div>

        <div className="sg-metric-card">
          <div className="sg-metric-icon views">
            <TrendingUp size={24} />
          </div>
          <div className="sg-metric-info">
            <span className="sg-metric-label">Total Reader Views</span>
            <span className="sg-metric-value">{totalViews.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          Controls Toolbar (Search & Filter)
      ───────────────────────────────────────── */}
      <div className="sg-controls-bar">
        <div className="sg-search-box">
          <Search size={16} className="sg-search-icon" />
          <input
            type="text"
            placeholder="Search guides by title, category, author, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="sg-filter-group">
          {/* Category Dropdown */}
          <select
            className="sg-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES_LIST.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            className="sg-select"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="All Status">All Status</option>
            <option value="Published">Published Only</option>
            <option value="Draft">Drafts Only</option>
          </select>

          {/* Sort Dropdown */}
          <select
            className="sg-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="views">Most Views</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {/* View Mode Toggle */}
          <div className="sg-view-toggle">
            <button
              className={`sg-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Card View"
            >
              <LayoutGrid size={17} />
            </button>
            <button
              className={`sg-view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="List Table View"
            >
              <List size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────
          Content: Grid View or Table View
      ───────────────────────────────────────── */}
      {filteredGuides.length === 0 ? (
        <div className="sg-empty-state">
          <div className="sg-empty-icon">
            <FileText size={32} />
          </div>
          <h3>No Shopping Guides Found</h3>
          <p>Try refining your search query or filters, or upload your first shopping guide blog post.</p>
          <button className="sg-btn-primary" onClick={handleOpenUploadModal} style={{ marginTop: '12px' }}>
            <Plus size={16} />
            Upload New Blog
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="sg-cards-grid">
          {filteredGuides.map(guide => (
            <div key={guide.id} className="sg-card">
              <div className="sg-card-thumbnail-wrap">
                <img
                  src={guide.coverImage}
                  alt={guide.title}
                  className="sg-card-img"
                  onError={(e) => {
                    e.target.src = blog1Img
                  }}
                />
                <div className="sg-card-badges">
                  <span className="sg-category-badge">{guide.category}</span>
                  <button
                    className={`sg-status-badge ${guide.status.toLowerCase()}`}
                    onClick={() => handleToggleStatus(guide.id)}
                    title="Click to toggle status"
                    style={{ pointerEvents: 'auto', cursor: 'pointer', border: 'none' }}
                  >
                    {guide.status === 'Published' ? <Check size={12} /> : <Clock size={12} />}
                    {guide.status}
                  </button>
                </div>

                {guide.featured && (
                  <div className="sg-featured-ribbon">
                    <Sparkles size={12} />
                    Featured
                  </div>
                )}
              </div>

              <div className="sg-card-body">
                <div className="sg-card-meta">
                  <span className="sg-card-meta-item">
                    <Calendar size={13} />
                    {guide.publishedDate}
                  </span>
                  <span>•</span>
                  <span className="sg-card-meta-item">
                    <Clock size={13} />
                    {guide.readTime}
                  </span>
                  <span>•</span>
                  <span className="sg-card-meta-item">
                    <Eye size={13} />
                    {(guide.views || 0).toLocaleString()}
                  </span>
                </div>

                <h3 className="sg-card-title" title={guide.title}>
                  {guide.title}
                </h3>

                <p className="sg-card-excerpt">
                  {guide.excerpt}
                </p>

                {Array.isArray(guide.tags) && guide.tags.length > 0 && (
                  <div className="sg-card-tags">
                    {guide.tags.map(t => (
                      <span key={t} className="sg-tag-pill">#{t}</span>
                    ))}
                  </div>
                )}

                <div className="sg-card-footer">
                  <div className="sg-author-info">
                    <img
                      src={guide.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150'}
                      alt={guide.author}
                      className="sg-author-avatar"
                    />
                    <span className="sg-author-name">{guide.author}</span>
                  </div>

                  <div className="sg-card-actions">
                    <button
                      className="sg-action-icon-btn view"
                      title="Preview Article"
                      onClick={() => setPreviewGuide(guide)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="sg-action-icon-btn edit"
                      title="Edit Guide"
                      onClick={() => handleOpenEditModal(guide)}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="sg-action-icon-btn delete"
                      title="Delete Guide"
                      onClick={() => setDeleteConfirmGuide(guide)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="sg-table-container">
          <div className="sg-table-responsive">
            <table className="sg-table">
              <thead>
                <tr>
                  <th>Blog / Guide Title</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Read Time</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuides.map(guide => (
                  <tr key={guide.id}>
                    <td>
                      <div className="sg-table-blog-cell">
                        <img
                          src={guide.coverImage}
                          alt={guide.title}
                          className="sg-table-thumbnail"
                          onError={(e) => {
                            e.target.src = blog1Img
                          }}
                        />
                        <div>
                          <div className="sg-table-title">{guide.title}</div>
                          <div className="sg-table-excerpt">{guide.excerpt}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="sg-category-badge" style={{ background: '#e2e8f0', color: '#1e293b' }}>
                        {guide.category}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>{guide.author}</span>
                    </td>
                    <td>{guide.publishedDate}</td>
                    <td>{guide.readTime}</td>
                    <td>{(guide.views || 0).toLocaleString()}</td>
                    <td>
                      <button
                        className={`sg-status-badge ${guide.status.toLowerCase()}`}
                        onClick={() => handleToggleStatus(guide.id)}
                        title="Click to toggle status"
                        style={{ cursor: 'pointer', border: 'none' }}
                      >
                        {guide.status === 'Published' ? <Check size={12} /> : <Clock size={12} />}
                        {guide.status}
                      </button>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="sg-card-actions" style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="sg-action-icon-btn view"
                          title="Preview Article"
                          onClick={() => setPreviewGuide(guide)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="sg-action-icon-btn edit"
                          title="Edit Guide"
                          onClick={() => handleOpenEditModal(guide)}
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          className="sg-action-icon-btn delete"
                          title="Delete Guide"
                          onClick={() => setDeleteConfirmGuide(guide)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          Modal 1: Upload / Edit Shopping Guide
      ───────────────────────────────────────── */}
      {isUploadModalOpen && (
        <div className="sg-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
          <div className="sg-modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="sg-modal-header">
              <h2>
                <BookOpen size={22} color="#84cc16" />
                {isEditMode ? 'Edit Shopping Guide Blog' : 'Upload New Shopping Guide Blog'}
              </h2>
              <button
                className="sg-modal-close-btn"
                onClick={() => setIsUploadModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGuide} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div className="sg-modal-body">
                <div className="sg-form-grid">
                  {/* Blog Title */}
                  <div className="sg-form-group full">
                    <label className="sg-label">
                      <span>Guide / Blog Title <span className="required">*</span></span>
                    </label>
                    <input
                      type="text"
                      className="sg-input"
                      placeholder="e.g. 10 Smart Tips for a Better Online Shopping Experience"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="sg-form-group">
                    <label className="sg-label">Category</label>
                    <select
                      className="sg-form-select"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                    >
                      {CATEGORIES_LIST.filter(c => c !== 'All Categories').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Read Time */}
                  <div className="sg-form-group">
                    <label className="sg-label">Read Time</label>
                    <input
                      type="text"
                      className="sg-input"
                      placeholder="e.g. 4 min read"
                      value={formReadTime}
                      onChange={(e) => setFormReadTime(e.target.value)}
                    />
                  </div>

                  {/* Author Name */}
                  <div className="sg-form-group">
                    <label className="sg-label">Author / Publisher</label>
                    <input
                      type="text"
                      className="sg-input"
                      placeholder="e.g. Shopnow4u Team"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="sg-form-group">
                    <label className="sg-label">Publishing Status</label>
                    <select
                      className="sg-form-select"
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="Published">Published (Live for customers)</option>
                      <option value="Draft">Draft (Saved privately)</option>
                    </select>
                  </div>

                  {/* Cover Image Uploader */}
                  <div className="sg-form-group full">
                    <label className="sg-label">Cover Banner Image</label>
                    
                    {formCoverImage ? (
                      <div className="sg-upload-preview-wrap">
                        <img
                          src={formCoverImage}
                          alt="Cover Preview"
                          className="sg-upload-preview-img"
                        />
                        <button
                          type="button"
                          className="sg-preview-remove-btn"
                          onClick={() => setFormCoverImage('')}
                        >
                          <X size={14} /> Remove Image
                        </button>
                      </div>
                    ) : (
                      <div
                        className="sg-upload-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="sg-upload-icon-circle">
                          <Upload size={22} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                            Click to upload image from computer
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            PNG, JPG, WEBP up to 5MB
                          </div>
                        </div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}

                    {/* Presets from Assets */}
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>
                        Or choose from project asset covers:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {ASSET_IMAGES.map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setFormCoverImage(item.img)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '5px 10px',
                              border: formCoverImage === item.img ? '2px solid #84cc16' : '1px solid #cbd5e1',
                              borderRadius: '8px',
                              background: formCoverImage === item.img ? '#f7fee7' : '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            <img src={item.img} alt={item.name} style={{ width: '28px', height: '20px', objectFit: 'cover', borderRadius: '4px' }} />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ marginTop: '8px' }}>
                      <input
                        type="url"
                        className="sg-input"
                        placeholder="Or enter direct image URL (e.g. https://images.unsplash.com/...)"
                        value={formCoverImage}
                        onChange={(e) => setFormCoverImage(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Excerpt / Summary */}
                  <div className="sg-form-group full">
                    <label className="sg-label">
                      <span>Short Excerpt / Summary (Shown on cards)</span>
                    </label>
                    <textarea
                      className="sg-textarea"
                      placeholder="A short, catchy summary that introduces the blog guide..."
                      rows={2}
                      value={formExcerpt}
                      onChange={(e) => setFormExcerpt(e.target.value)}
                    />
                  </div>

                  {/* Full Article Content */}
                  <div className="sg-form-group full">
                    <label className="sg-label">
                      <span>Full Blog Content <span className="required">*</span></span>
                    </label>
                    <textarea
                      className="sg-textarea large"
                      placeholder="Write your shopping advice, tips, recommendations, and reviews here..."
                      rows={8}
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      required
                    />
                  </div>

                  {/* Tags */}
                  <div className="sg-form-group full">
                    <label className="sg-label">Tags / Keywords</label>
                    <div className="sg-tags-input-container">
                      {formTags.map(tag => (
                        <span key={tag} className="sg-tag-chip">
                          #{tag}
                          <button
                            type="button"
                            className="sg-tag-chip-remove"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="sg-tag-inline-input"
                        placeholder="Type tag and press Enter or add..."
                        value={formTagInput}
                        onChange={(e) => setFormTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                      />
                      {formTagInput && (
                        <button
                          type="button"
                          className="sg-btn-secondary"
                          onClick={handleAddTag}
                          style={{ padding: '4px 10px', fontSize: '12px' }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Featured Toggle */}
                  <div className="sg-form-group full" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="featured-checkbox" style={{ fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                      Mark as Featured Guide (Highlighted on banners and top lists)
                    </label>
                  </div>
                </div>
              </div>

              <div className="sg-modal-footer">
                <button
                  type="button"
                  className="sg-btn-secondary"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sg-btn-primary"
                >
                  {isEditMode ? 'Save Changes' : 'Publish Blog Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          Modal 2: Preview / Article Reader View
      ───────────────────────────────────────── */}
      {previewGuide && (
        <div className="sg-modal-overlay" onClick={() => setPreviewGuide(null)}>
          <div className="sg-modal-container large" onClick={(e) => e.stopPropagation()}>
            <div className="sg-modal-header">
              <h2>
                <BookOpen size={20} color="#84cc16" />
                Blog Reader Preview
              </h2>
              <button
                className="sg-modal-close-btn"
                onClick={() => setPreviewGuide(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sg-modal-body" style={{ padding: 0 }}>
              <div className="sg-preview-hero">
                <img
                  src={previewGuide.coverImage}
                  alt={previewGuide.title}
                  className="sg-preview-hero-img"
                  onError={(e) => {
                    e.target.src = blog1Img
                  }}
                />
              </div>

              <div className="sg-preview-article-body">
                <div className="sg-preview-meta">
                  <span className="sg-category-badge">{previewGuide.category}</span>
                  <span className="sg-card-meta-item">
                    <Calendar size={14} />
                    {previewGuide.publishedDate}
                  </span>
                  <span className="sg-card-meta-item">
                    <Clock size={14} />
                    {previewGuide.readTime}
                  </span>
                  <span className="sg-card-meta-item">
                    <Eye size={14} />
                    {(previewGuide.views || 0).toLocaleString()} Views
                  </span>
                  <span className={`sg-status-badge ${previewGuide.status.toLowerCase()}`}>
                    {previewGuide.status}
                  </span>
                </div>

                <h1 className="sg-preview-title">{previewGuide.title}</h1>

                {previewGuide.excerpt && (
                  <p className="sg-preview-excerpt">{previewGuide.excerpt}</p>
                )}

                <div className="sg-preview-content">
                  {previewGuide.content}
                </div>

                {Array.isArray(previewGuide.tags) && previewGuide.tags.length > 0 && (
                  <div className="sg-preview-tags-section">
                    <Tag size={16} color="#64748b" />
                    {previewGuide.tags.map(t => (
                      <span key={t} className="sg-tag-pill">#{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sg-modal-footer">
              <button
                type="button"
                className="sg-btn-secondary"
                onClick={() => setPreviewGuide(null)}
              >
                Close Preview
              </button>
              <button
                type="button"
                className="sg-btn-primary"
                onClick={() => {
                  const toEdit = previewGuide
                  setPreviewGuide(null)
                  handleOpenEditModal(toEdit)
                }}
              >
                <Edit3 size={16} />
                Edit This Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          Modal 3: Delete Confirmation
      ───────────────────────────────────────── */}
      {deleteConfirmGuide && (
        <div className="sg-modal-overlay" onClick={() => setDeleteConfirmGuide(null)}>
          <div className="sg-modal-container small" onClick={(e) => e.stopPropagation()}>
            <div className="sg-modal-header">
              <h2 style={{ color: '#dc2626' }}>
                <Trash2 size={20} />
                Delete Shopping Guide
              </h2>
              <button
                className="sg-modal-close-btn"
                onClick={() => setDeleteConfirmGuide(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="sg-modal-body">
              <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, color: '#334155' }}>
                Are you sure you want to permanently delete <strong>"{deleteConfirmGuide.title}"</strong>?
              </p>
              <p style={{ margin: '8px 0 0 0', fontSize: '12.5px', color: '#64748b' }}>
                This action cannot be undone. Customers will no longer be able to read this shopping guide.
              </p>
            </div>

            <div className="sg-modal-footer">
              <button
                type="button"
                className="sg-btn-secondary"
                onClick={() => setDeleteConfirmGuide(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="sg-btn-primary"
                style={{ background: '#dc2626', color: '#ffffff', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
