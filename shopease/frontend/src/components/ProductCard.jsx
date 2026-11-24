import React from 'react';
import { ShoppingCart, Star, Layers } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

export const ProductCard = ({ product, onBuyNow }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group bg-white rounded-none border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Product Image Box */}
      <div className="relative aspect-square bg-[#f5f7f9] overflow-hidden flex items-center justify-center p-6">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
            <Layers className="w-12 h-12 mb-2 opacity-40" />
            <span className="text-[11px] font-medium tracking-wide">NO IMAGE</span>
          </div>
        )}

        {/* Sale / Stock Pill */}
        <span
          className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isOutOfStock
              ? 'bg-rose-500 text-white'
              : 'bg-[#0084d6] text-white shadow-xs'
          }`}
        >
          {isOutOfStock ? 'Sold Out' : 'Sale!'}
        </span>

        {/* Stock status indicator */}
        <span className="absolute bottom-2 right-3 text-[10px] font-medium text-slate-500 bg-white/80 px-1.5 py-0.5 rounded">
          {product.stock} in stock
        </span>
      </div>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between text-left">
        <div>
          {/* Category */}
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-1">
            {product.category_name || product.category?.name || 'Footwear'}
          </span>

          {/* Title */}
          <h3 className="font-bold text-slate-800 text-base leading-snug group-hover:text-[#0084d6] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* 5-Star Rating */}
          <div className="flex items-center gap-0.5 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
              />
            ))}
            <span className="text-[11px] text-slate-400 ml-1 font-medium">(5.0)</span>
          </div>

          {/* Price */}
          <div className="mt-1">
            <span className="text-base font-bold text-slate-900 font-sans">
              {formatINR(product.price)}
            </span>
          </div>
        </div>

        {/* Buy Now Button */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={() => onBuyNow(product)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xs font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-[#0084d6] hover:bg-[#0073bb] text-white shadow-xs active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
