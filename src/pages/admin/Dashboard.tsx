import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';
import { orderService } from '../../api/services/orderService';
import { userService } from '../../api/services/userService';
import { productService } from '../../api/services/productService';
import { OrderResponse } from '../../api/types/order';
import { UserResponse } from '../../api/types/user';
import { ProductResponse } from '../../api/types/product';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders().catch(() => []),
      userService.getAllUsers().catch(() => []),
      productService.getAllProducts().catch(() => []),
    ]).then(([o, u, p]) => {
      setOrders(o);
      setUsers(u);
      setProducts(p);
    }).finally(() => setLoading(false));
  }, []);

  // --- Stats ---
  const totalRevenue = orders
    .filter(o => ['COMPLETED', 'PAID', 'DELIVERED'].includes(o.status))
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

  // --- Chart: doanh thu theo tháng (từ orderDate) ---
  const revenueByMonth: Record<string, number> = {};
  orders
    .filter(o => ['COMPLETED', 'PAID', 'DELIVERED'].includes(o.status))
    .forEach(o => {
      const date = o.orderDate || o.createdAt;
      if (!date) return;
      const month = `T${new Date(date).getMonth() + 1}`;
      revenueByMonth[month] = (revenueByMonth[month] || 0) + o.totalAmount;
    });
  const chartData = Object.entries(revenueByMonth)
    .sort((a, b) => parseInt(a[0].slice(1)) - parseInt(b[0].slice(1)))
    .map(([name, rev]) => ({ name, rev: Math.round(rev) }));

  // --- Tồn kho theo category ---
  const stockByCategory: Record<string, { total: number; inStock: number }> = {};
  products.forEach(p => {
    const cat = p.categoryName || 'Khác';
    if (!stockByCategory[cat]) stockByCategory[cat] = { total: 0, inStock: 0 };
    const stock = p.stockQuantity ?? p.variants?.reduce((s, v) => s + v.stockQuantity, 0) ?? 0;
    stockByCategory[cat].total += 1;
    if (stock > 0) stockByCategory[cat].inStock += 1;
  });
  const stockItems = Object.entries(stockByCategory)
    .map(([name, { total, inStock }]) => ({
      name,
      pct: total > 0 ? Math.round((inStock / total) * 100) : 0,
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);

  const barColors = ['blue', 'indigo', 'orange', 'red', 'green'];

  // --- Recent orders ---
  const recentOrders = [...orders]
    .sort((a, b) => {
      const da = new Date(a.orderDate || a.createdAt || 0).getTime();
      const db = new Date(b.orderDate || b.createdAt || 0).getTime();
      return db - da;
    })
    .slice(0, 5);

  const statusLabel: Record<string, { label: string; color: string }> = {
    PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
    CONFIRMED: { label: 'Đã xác nhận',  color: 'bg-blue-100 text-blue-700' },
    DELIVERED: { label: 'Đang giao',    color: 'bg-purple-100 text-purple-700' },
    COMPLETED: { label: 'Hoàn thành',   color: 'bg-green-100 text-green-700' },
    CANCELLED: { label: 'Đã hủy',       color: 'bg-red-100 text-red-700' },
    PAID:      { label: 'Đã thanh toán',color: 'bg-emerald-100 text-emerald-700' },
    FAILED:    { label: 'Thất bại',     color: 'bg-gray-100 text-gray-500' },
  };

  return (
    <AdminLayout
      title="Quản Trị Hệ Thống"
      subtitle="Báo cáo hoạt động kinh doanh thời gian thực."
      requiredRole="staff"
    >
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                label: 'Doanh Thu',
                val: '$' + totalRevenue.toLocaleString(),
                icon: 'payments',
                color: 'blue',
                sub: `${orders.filter(o => ['COMPLETED','PAID','DELIVERED'].includes(o.status)).length} đơn hoàn thành`,
              },
              {
                label: 'Đơn Hàng',
                val: orders.length.toString(),
                icon: 'shopping_cart',
                color: 'indigo',
                sub: `${orders.filter(o => o.status === 'CANCELLED').length} đã hủy`,
              },
              {
                label: 'Khách Hàng',
                val: users.length.toString(),
                icon: 'group',
                color: 'orange',
                sub: `${users.filter(u => (u.roleName || u.role)?.toUpperCase() === 'MEMBER').length} thành viên`,
              },
              {
                label: 'Chờ Xử Lý',
                val: pendingOrders.toString(),
                icon: 'pending_actions',
                color: 'red',
                sub: pendingOrders > 0 ? 'Cần chú ý' : 'Không có',
              },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                  <span className={`material-symbols-outlined text-${stat.color}-500`}>{stat.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
                <p className={`text-xs mt-2 ${stat.color === 'red' && pendingOrders > 0 ? 'text-red-500' : 'text-gray-400'}`}>{stat.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-6">Doanh Thu Theo Tháng</h2>
              {chartData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                      <Tooltip
                        formatter={(v: number) => [`$${v.toLocaleString()}`, 'Doanh thu']}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Line type="monotone" dataKey="rev" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                  Chưa có dữ liệu doanh thu
                </div>
              )}
            </div>

            {/* Stock */}
            <div className="bg-white p-6 rounded-xl border border-gray-100">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 mb-6">Tồn Kho Theo Danh Mục</h2>
              {stockItems.length > 0 ? (
                <div className="space-y-5">
                  {stockItems.map((cat, idx) => (
                    <div key={cat.name}>
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                        <span className="truncate max-w-[140px]">{cat.name}</span>
                        <span>{cat.pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-${barColors[idx % barColors.length]}-500 rounded-full`}
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700">Đơn Hàng Gần Đây</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Mã đơn</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Khách hàng</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ngày đặt</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tổng tiền</th>
                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.length > 0 ? recentOrders.map(order => {
                    const st = statusLabel[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-500' };
                    const date = order.orderDate || order.createdAt;
                    return (
                      <tr key={order.orderId} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">#{order.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.username || order.userName || `User #${order.userId}`}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {date ? new Date(date).toLocaleDateString('vi-VN') : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          ${order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${st.color}`}>
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">Chưa có đơn hàng nào</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default Dashboard;
