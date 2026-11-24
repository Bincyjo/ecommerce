import React from 'react';
import { ShoppingCart, Check, AlertTriangle, Layers } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

export const ProductCard = ({ product, onBuyNow }) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Product Image Area */}
      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden flex items-center justify-center p-4">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 rounded-lg">
            <Layers className="w-10 h-10 mb-2 opacity-50" />
            <span className="text-xs font-medium">No Image Available</span>
          </div>
        )}

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-slate-200/60">
          {product.category_name || product.category?.name || 'General'}
        </span>

        {/* Stock Badge */}
        <span
          className={`absolute top-3 right-3 text-[11px] font-medium px-2 py-0.5 rounded-full shadow-sm ${
            isOutOfStock
              ? 'bg-rose-100 text-rose-800 border border-rose-200'
              : isLowStock
              ? 'bg-amber-100 text-amber-800 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}
        >
          {isOutOfStock ? 'Out of Stock' : `${product.stock} available`}
        </span>
      </div>

      {/* Card Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 text-base leading-snug">
            {product.name}
          </h3>

          <div className="mt-3 flex items-baseline justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Price</span>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                {formatINR(product.price)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Stock</span>
              <span className="text-xs font-semibold text-slate-700">
                {product.stock} units
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <button
            onClick={() => onBuyNow(product)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isOutOfStock ? 'Sold Out' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
