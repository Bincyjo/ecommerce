import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  FolderTree, 
  ClipboardList, 
  Users, 
  DollarSign, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Plus,
  RefreshCw
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const toast = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await orderService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats', err);
      toast.error('Could not load analytics summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCompleteOrder = async (orderId) => {
    setCompletingId(orderId);
    try {
      await orderService.completeOrder(orderId);
      toast.success(`Order #${orderId} marked as completed!`);
      // Update local state
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recent_orders: prev.recent_orders.map((o) =>
            o.id === orderId ? { ...o, status: 'completed' } : o
          ),
          placed_orders: Math.max(0, (prev.placed_orders || 1) - 1),
          completed_orders: (prev.completed_orders || 0) + 1,
        };
      });
    } catch (err) {
      console.error('Failed to complete order', err);
      toast.error('Failed to update order status.');
    } finally {
      setCompletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Store Performance Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time catalog metrics, registered customers, and incoming transactions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Manage Products
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards Required + Revenue */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-8 bg-slate-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Total Products */}
          <Link
            to="/admin/products"
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Products
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.total_products || 0}
              </span>
              <span className="text-xs font-medium text-indigo-600 flex items-center gap-0.5">
                View catalog <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Total Categories */}
          <Link
            to="/admin/categories"
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Categories
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FolderTree className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.total_categories || 0}
              </span>
              <span className="text-xs font-medium text-indigo-600 flex items-center gap-0.5">
                Organize <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Total Orders */}
          <Link
            to="/admin/orders"
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.total_orders || 0}
              </span>
              <span className="text-xs font-medium text-slate-500">
                {stats?.placed_orders || 0} placed / {stats?.completed_orders || 0} done
              </span>
            </div>
          </Link>

          {/* Total Customers */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Customers
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {stats?.total_customers || 0}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Registered buyers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Card Summary */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-indigo-300">
            CUMULATIVE GROSS REVENUE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
            ${parseFloat(stats?.total_revenue || 0).toFixed(2)}
          </h2>
          <p className="text-xs text-slate-300 mt-2">
            Aggregated sum of all historical customer orders calculated directly through server-side snapshots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-5 py-3 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors shadow-md"
          >
            Review All Orders
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest transactions submitted by customers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View Full Order Log</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_orders?.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            No orders placed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Items</th>
                  <th className="px-6 py-3.5">Total Amount</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recent_orders?.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">
                      #{ord.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{ord.customer_name}</div>
                      <div className="text-xs text-slate-400">{ord.customer_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-600">
                        {ord.items?.length} item(s) ({ord.items_count} units)
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      ${parseFloat(ord.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          ord.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Clock className="w-3 h-3 text-amber-600" />
                        )}
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {ord.status === 'placed' && (
                        <button
                          onClick={() => handleCompleteOrder(ord.id)}
                          disabled={completingId === ord.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                        >
                          {completingId === ord.id ? 'Updating...' : 'Mark Completed'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
