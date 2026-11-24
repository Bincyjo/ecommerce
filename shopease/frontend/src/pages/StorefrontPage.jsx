import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  RefreshCw, 
  PackageOpen, 
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { ProductCard } from '../components/ProductCard';
import { BuyNowModal } from '../components/BuyNowModal';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

export const StorefrontPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory ? parseInt(urlCategory, 10) : null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync category param from URL
  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(parseInt(urlCategory, 10));
    } else {
      setSelectedCategory(null);
    }
  }, [urlCategory]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (ordering) params.ordering = ordering;

      const data = await productService.getProducts(params);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
      setError('Failed to load products. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts();
    }, 200);
    return () => clearTimeout(timeout);
  }, [selectedCategory, searchQuery, ordering]);

  const handleBuyNow = (product) => {
    setSelectedProduct(product);
    setIsBuyModalOpen(true);
  };

  const handleOrderSuccess = (order) => {
    setLastPlacedOrder(order);
    setIsSuccessModalOpen(true);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col">
      
      {/* 1. HERO SECTION (Astra DNK Blue Summer Theme) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#004e7c] via-[#0074b7] to-[#0084d6] text-white py-24 sm:py-32">
        {/* Subtle decorative glow & overlay pattern */}
        <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-left space-y-6">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
              Raining Offers For <br />Hot Summer!
            </h1>

            <p className="text-xl sm:text-2xl font-medium tracking-wide text-white/95">
              25% Off On All Products
            </p>

            {/* Buttons: Solid White and Transparent Outline */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#products-section"
                className="px-8 py-3.5 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                Shop Now
              </a>
              <a
                href="#featured-banners"
                className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xs active:scale-95"
              >
                Find More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND LOGOS STRIP (DNK Style Monochrome Logos) */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all">
            <div className="flex items-center gap-1.5 font-bold tracking-tighter text-lg text-slate-800">
              <span className="w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center text-[10px]">L</span>
              <span>logoipsum</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold tracking-tight text-lg text-slate-800">
              <span className="w-4 h-4 bg-slate-800 rounded-xs" />
              <span>BRANDSTORE</span>
            </div>
            <div className="flex items-center gap-1 font-mono tracking-widest text-lg font-black text-slate-800">
              <span>[LOGO]</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold tracking-tighter text-lg text-slate-800">
              <span className="w-5 h-5 rounded-full border-2 border-slate-800 flex items-center justify-center text-[10px]">C</span>
              <span>logoispum</span>
            </div>
            <div className="flex items-center gap-1.5 font-semibold tracking-tight text-lg text-slate-800">
              <span className="w-3.5 h-3.5 rotate-45 bg-slate-800" />
              <span>APPAREL</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE PROMOTIONAL BANNER CARDS (DNK Signature Grid) */}
      <section id="featured-banners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Warm Red / Coral Tint */}
          <div className="relative h-96 overflow-hidden rounded-xs bg-gradient-to-t from-rose-950/90 via-rose-900/60 to-rose-800/40 text-white p-8 flex flex-col justify-end group shadow-md">
            <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                20% Off On Running Shoes
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                High-performance engineered soles with lightweight responsive cushioning.
              </p>
              <div className="pt-2">
                <a
                  href="#products-section"
                  onClick={() => setSelectedCategory(categories.find(c => c.name.toLowerCase().includes('running'))?.id || null)}
                  className="inline-block px-6 py-2.5 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xs"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Cool Ocean / Teal Tint */}
          <div className="relative h-96 overflow-hidden rounded-xs bg-gradient-to-t from-sky-950/90 via-sky-900/60 to-sky-800/40 text-white p-8 flex flex-col justify-end group shadow-md">
            <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Latest Footwear For You
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                Discover retro trainers and iconic streetwear styles tailored for every day.
              </p>
              <div className="pt-2">
                <a
                  href="#products-section"
                  onClick={() => setSelectedCategory(categories.find(c => c.name.toLowerCase().includes('casual'))?.id || null)}
                  className="inline-block px-6 py-2.5 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xs"
                >
                  Shop Now
                </a>
              </div>
            </div>
          </div>

          {/* Card 3: Deep Plum / Wine Tint */}
          <div className="relative h-96 overflow-hidden rounded-xs bg-gradient-to-t from-purple-950/90 via-purple-900/60 to-purple-800/40 text-white p-8 flex flex-col justify-end group shadow-md">
            <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Step Up In Style!
              </h3>
              <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                Handcrafted premium leather oxfords and basketball court dominators.
              </p>
              <div className="pt-2">
                <a
                  href="#products-section"
                  onClick={() => setSelectedCategory(null)}
                  className="inline-block px-6 py-2.5 bg-white text-slate-900 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition-all shadow-xs"
                >
                  Check Out
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURED PRODUCTS CATALOG */}
      <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        
        {/* Section Header with Blue Underline */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Featured Products
          </h2>
          <div className="w-14 h-0.5 bg-[#0084d6] mx-auto mt-2.5" />
          <p className="text-sm text-slate-500 mt-2">
            Top-rated footwear crafted for peak performance and refined urban elegance
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="bg-white p-4 sm:p-5 rounded-xs border border-slate-200/80 shadow-xs space-y-4 mb-8">
          
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by title or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xs border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-[#0084d6] focus:border-[#0084d6]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline uppercase tracking-wider">
                Sort:
              </span>
              <select
                value={ordering}
                onChange={(e) => setOrdering(e.target.value)}
                className="py-2 px-3 rounded-xs border border-slate-200 text-xs sm:text-sm bg-white text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#0084d6] focus:border-[#0084d6]"
              >
                <option value="-created_at">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (Astra DNK Style) */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xs ${
                selectedCategory === null
                  ? 'bg-[#0084d6] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-xs whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#0084d6] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Showing <strong className="text-slate-800">{products.length}</strong> {products.length === 1 ? 'product' : 'products'}
            {selectedCategory && categories.find((c) => c.id === selectedCategory) && (
              <span> in <strong className="text-[#0084d6]">{categories.find((c) => c.id === selectedCategory).name}</strong></span>
            )}
          </span>
          {(selectedCategory || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="text-[#0084d6] hover:text-[#0073bb] font-bold text-xs uppercase flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-100 p-5 space-y-4 animate-pulse">
                <div className="w-full aspect-square bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded-none w-3/4" />
                <div className="h-3 bg-slate-200 rounded-none w-1/2" />
                <div className="h-8 bg-slate-200 rounded-none" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 p-8 text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="font-semibold text-rose-900 text-base">{error}</h3>
            <button
              onClick={fetchProducts}
              className="mt-4 px-4 py-2 bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center max-w-md mx-auto py-16 px-4 bg-white border border-slate-200/80">
            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <PackageOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Products Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              No products found matching your current filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="mt-5 px-6 py-2.5 bg-[#0084d6] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0073bb] transition-colors"
            >
              Show All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* Buy Now Checkout Drawer / Modal */}
      <BuyNowModal
        product={selectedProduct}
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Success Confirmation */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
};
