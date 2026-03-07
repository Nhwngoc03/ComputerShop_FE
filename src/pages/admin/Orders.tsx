import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { orderService } from '../../api/services/orderService';
import { OrderResponse } from '../../api/types/order';

const AdminOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      console.log('Orders data:', data); // Debug log
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: number, status: string) => {
    try {
      console.log('Updating order status:', { orderId, status });
      const response = await orderService.updateOrderStatus(orderId, { status });
      console.log('Update response:', response);
      fetchOrders(); // Refresh list
    } catch (err: any) {
      console.error('Update status error:', err);
      alert(err.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'bg-orange-100 text-orange-600';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-600';
      case 'DELIVERED': return 'bg-indigo-100 text-indigo-600';
      case 'COMPLETED': return 'bg-green-100 text-green-600';
      case 'CANCELLED': return 'bg-red-100 text-red-600';
      case 'PAID': return 'bg-emerald-100 text-emerald-600';
      case 'FAILED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'Chờ xác nhận';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'DELIVERED': return 'Đang giao';
      case 'COMPLETED': return 'Hoàn thành';
      case 'CANCELLED': return 'Đã hủy';
      case 'PAID': return 'Đã thanh toán';
      case 'FAILED': return 'Thất bại';
      default: return status;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <AdminLayout 
      title="Quản Lý Đơn Hàng" 
      subtitle="Theo dõi và cập nhật trạng thái đơn hàng của khách hàng."
      requiredRole="staff"
    >
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={fetchOrders} className="text-xs underline mt-2 hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Mã đơn</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Khách hàng</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày đặt</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tổng tiền</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Thanh toán</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Trạng thái</th>
                <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <span className="text-xs font-bold text-blue-600">#{order.orderId}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{order.username || order.userName || 'N/A'}</p>
                      <p className="text-xs text-gray-400">User ID: {order.userId}</p>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-gray-500">{formatDate(order.orderDate || order.createdAt)}</td>
                  <td className="p-4 text-sm font-black text-gray-900">{formatCurrency(order.totalAmount)}</td>
                  <td className="p-4">
                    <span className="text-xs text-gray-600">{order.paymentType}</span>
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateStatus(order.orderId, e.target.value)}
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="PENDING">Chờ xác nhận</option>
                      <option value="CONFIRMED">Đã xác nhận</option>
                      <option value="DELIVERED">Đang giao</option>
                      <option value="COMPLETED">Hoàn thành</option>
                      <option value="CANCELLED">Đã hủy</option>
                      <option value="PAID">Đã thanh toán</option>
                      <option value="FAILED">Thất bại</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Xem chi tiết"
                    >
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">shopping_cart</span>
                    <p className="text-gray-500 text-sm">Chưa có đơn hàng nào.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
