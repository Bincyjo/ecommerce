import React from 'react';
import { Globe, Award, Tag, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer id="footer-section" className="bg-white border-t border-slate-200 mt-20">
      
      {/* 4 Feature Highlights */}
      <div className="border-b border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center sm:text-left">
            
            <div className="flex flex-col items-center sm:items-start space-y-2">
              <Globe className="w-8 h-8 text-[#0084d6]" />
              <h4 className="text-base font-bold text-slate-800">Worldwide Shipping</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Prompt and safe door-to-door delivery on all footwear orders.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start space-y-2">
              <Award className="w-8 h-8 text-[#0084d6]" />
              <h4 className="text-base font-bold text-slate-800">Best Quality</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% genuine products with manufacturer authenticity guarantee.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start space-y-2">
              <Tag className="w-8 h-8 text-[#0084d6]" />
              <h4 className="text-base font-bold text-slate-800">Best Offers</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Seasonal discounts, flash sales, and unbeatable value pricing.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-start space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#0084d6]" />
              <h4 className="text-base font-bold text-slate-800">Secure Payments</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                End-to-end encrypted transactions and protected checkout.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Footer Navigation Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xs bg-[#0084d6] flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-[#0084d6]">
                ShopEase
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The best look anytime, anywhere. Leading destination for modern runners, streetwear trainers, and casual footwear.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-800">For Her</h5>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Women Running</a></li>
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Classic Sneakers</a></li>
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Performance Court</a></li>
            </ul>
          </div>

          {/* Men's Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-800">For Him</h5>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Men Runners</a></li>
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Leather Dress Shoes</a></li>
              <li><a href="#products-section" className="hover:text-[#0084d6] transition-colors">Trail & Outdoor Boots</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-slate-800">Information</h5>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><span className="hover:text-[#0084d6] transition-colors cursor-pointer">About Us</span></li>
              <li><span className="hover:text-[#0084d6] transition-colors cursor-pointer">Customer Support</span></li>
              <li><span className="hover:text-[#0084d6] transition-colors cursor-pointer">Returns & Exchanges</span></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-slate-100 py-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>
            Copyright &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 font-mono text-[11px]">
            <span>INR (₹)</span>
            <span>&bull;</span>
            <span>SECURE CHECKOUT</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
