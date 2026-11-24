import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, ShieldCheck, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { formatINR } from '../utils/formatCurrency';

export const BuyNowModal = ({ product, isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen || !product) return null;

  const { isAuthenticated, isCustomer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const unitPrice = parseFloat(product.price);
  const calculatedSubtotal = (unitPrice * quantity).toFixed(2);

  const handleQuantityChange = (delta) => {
    setErrorMessage('');
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleConfirmOrder = async () => {
    setErrorMessage('');

    if (!isAuthenticated) {
      toast.info('Please log in to place an order.');
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    if (isAdmin) {
      setErrorMessage('Administrators cannot place customer orders. Please sign in with a customer account.');
      return;
    }

    if (quantity > product.stock) {
      setErrorMessage(`Only ${product.stock} items currently in stock.`);
      return;
    }

    setLoading(true);

    try {
      // Send order request to DRF backend
      // Backend calculates total_amount server-side directly from DB price!
      const response = await orderService.createOrder({
        items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      });

      toast.success('Order placed successfully!');
      onOrderSuccess(response.order);
      onClose();
    } catch (err) {
      console.error('Order error:', err);
      const serverError =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        (Array.isArray(err.response?.data) ? err.response.data[0] : null) ||
        'Unable to complete purchase. Please check stock and try again.';
      setErrorMessage(typeof serverError === 'object' ? JSON.stringify(serverError) : serverError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={!loading ? onClose : undefined}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-fade-in">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-slate-800 text-lg">Confirm Purchase</h3>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Error Banner */}
            {errorMessage && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{errorMessage}</div>
              </div>
            )}

            {/* Product Summary */}
            <div className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 items-center">
              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-200/60 p-1 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-slate-400">No Image</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0084d6]">
                  {product.category_name || product.category?.name}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {product.name}
                </h4>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {formatINR(unitPrice)} <span className="text-xs font-normal text-slate-400">each</span>
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Available in stock: <span className="font-semibold text-slate-700">{product.stock}</span>
                </p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl">
              <div>
                <span className="text-sm font-medium text-slate-800 block">Select Quantity</span>
                <span className="text-xs text-slate-400">Max {product.stock} per purchase</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || loading}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-slate-800 text-base">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || loading}
                  className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Unit Price</span>
                <span>{formatINR(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Quantity</span>
                <span>x {quantity}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-base">
                <span>Total Amount</span>
                <span className="text-[#0084d6]">{formatINR(calculatedSubtotal)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Price verified server-side with database row lock.</span>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmOrder}
              disabled={loading || product.stock <= 0}
              className="px-6 py-2.5 rounded-xs bg-[#0084d6] hover:bg-[#0073bb] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm & Place Order</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
