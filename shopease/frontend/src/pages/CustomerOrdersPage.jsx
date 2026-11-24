import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Calendar, Clock, ShoppingBag, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export const CustomerOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to load orders', err);
        setError('Failed to fetch your orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Order History
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and review all footwear purchases placed under <strong className="text-slate-700">{user?.email}</strong>
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          Continue Shopping
        </Link>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="mt-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4 animate-pulse">
              <div className="h-5 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-12 bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-16 text-center max-w-md mx-auto py-12 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-sm text-slate-500 mt-1">
            You haven't bought any shoes yet. Explore our latest arrivals and place your first order today!
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 transition-all"
          >
            Explore Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Order Card Header */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-500">
                  <div>
                    <span className="block text-slate-400 font-medium">ORDER NUMBER</span>
                    <span className="text-sm font-bold font-mono text-slate-800">#{order.id}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">DATE PLACED</span>
                    <span className="text-sm font-semibold text-slate-700">{formatDate(order.created_at)}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 font-medium">TOTAL AMOUNT</span>
                    <span className="text-sm font-bold text-indigo-600">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      order.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {order.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items List */}
              <div className="p-6 divide-y divide-slate-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center shrink-0">
                        {item.product_image ? (
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Layers className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">
                          {item.product_name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quantity: <strong className="text-slate-700">{item.quantity}</strong> &times; Unit Price: <strong className="text-slate-700">${parseFloat(item.price).toFixed(2)}</strong> (Historical Snapshot)
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-medium">Subtotal</span>
                      <span className="text-sm font-bold text-slate-800 font-mono">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
