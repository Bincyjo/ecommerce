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

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#products-section"
                className="px-8 py-3.5 bg-white text-slate-900 font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all shadow-md active:scale-95"
              >
                Shop Now
              </a>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(null);
                  setSearchQuery('');
                  const el = document.getElementById('products-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xs active:scale-95"
              >
                View Catalog
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS CATALOG */}
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
