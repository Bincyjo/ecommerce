import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Search, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Calendar, 
  User, 
  Mail,
  RefreshCw
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatCurrency';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [completingId, setCompletingId] = useState(null);
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders', err);
      toast.error('Failed to load customer orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleMarkCompleted = async (orderId) => {
    setCompletingId(orderId);
    try {
      const response = await orderService.completeOrder(orderId);
      toast.success(`Order #${orderId} marked as completed!`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: 'completed' } : o))
      );
    } catch (err) {
      console.error('Failed to complete order', err);
      toast.error('Failed to update order status.');
    } finally {
      setCompletingId(null);
    }
  };

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

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      o.id.toString().includes(searchLower) ||
      o.customer_name?.toLowerCase().includes(searchLower) ||
      o.customer_email?.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Order Fulfillment Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review customer orders, verify items and prices, and mark shipments completed
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setStatusFilter('placed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'placed'
                ? 'bg-white text-amber-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Placed ({orders.filter((o) => o.status === 'placed').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              statusFilter === 'completed'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed ({orders.filter((o) => o.status === 'completed').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-16 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No orders found matching the filter.
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden"
            >
              {/* Header Details */}
              <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-xs text-slate-600">
                  <div>
                    <span className="block text-slate-400 font-medium">ORDER ID</span>
                    <span className="text-sm font-bold font-mono text-slate-900">#{ord.id}</span>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-medium">CUSTOMER</span>
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ord.customer_name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{ord.customer_email}</span>
                    </div>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-medium">DATE</span>
                    <span className="text-xs font-semibold text-slate-700">{formatDate(ord.created_at)}</span>
                  </div>

                  <div>
                    <span className="block text-slate-400 font-medium">TOTAL AMOUNT</span>
                    <span className="text-base font-extrabold text-indigo-600 font-mono">
                      {formatINR(ord.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {ord.status === 'completed' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {ord.status}
                  </span>

                  {ord.status === 'placed' && (
                    <button
                      onClick={() => handleMarkCompleted(ord.id)}
                      disabled={completingId === ord.id}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      {completingId === ord.id ? 'Completing...' : 'Mark as Completed'}
                    </button>
                  )}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="p-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Purchased Products ({ord.items?.length || 0})
                </span>

                <div className="divide-y divide-slate-100">
                  {ord.items?.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/60 p-1 flex items-center justify-center shrink-0">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {item.product_name}
                          </h4>
                          <span className="text-xs text-slate-500">
                            Quantity: <strong className="text-slate-800">{item.quantity}</strong> &times; Unit Price: <strong className="text-slate-800">{formatINR(item.price)}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs text-slate-400 block">Item Subtotal</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {formatINR(parseFloat(item.price) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
