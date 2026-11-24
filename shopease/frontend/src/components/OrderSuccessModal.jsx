import React from 'react';
import { CheckCircle, Package, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatINR } from '../utils/formatCurrency';

export const OrderSuccessModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 text-center transform transition-all animate-fade-in">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success Icon */}
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">Order Placed Successfully!</h3>
          <p className="text-sm text-slate-500 mt-1">
            Thank you for shopping with ShopEase. Your order has been recorded.
          </p>

          {/* Order Details Card */}
          <div className="mt-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Order ID</span>
              <span className="font-mono font-bold text-slate-800">#{order.id}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Status</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 uppercase">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Total Paid</span>
              <span className="font-bold text-[#0084d6] text-base">
                {formatINR(order.total_amount)}
              </span>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div className="pt-2 border-t border-slate-200 mt-2 space-y-1">
                <span className="text-xs text-slate-400 font-medium block mb-1">Items in this order:</span>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700">
                    <span className="truncate max-w-[200px]">{item.product_name}</span>
                    <span>{item.quantity} × {formatINR(item.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2.5">
            <button
              onClick={() => {
                onClose();
                navigate('/orders');
              }}
              className="w-full py-2.5 px-4 rounded-xs bg-[#0084d6] hover:bg-[#0073bb] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all"
            >
              <Package className="w-4 h-4" />
              View Order in History
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-all"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
