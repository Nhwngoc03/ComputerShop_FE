import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Order } from '../../types/index';

const INITIAL_ORDERS: Order[] = [
  { id: 'ORD-001', customerName: 'Nguyễn Văn A', email: 'vana@gmail.com', date: '2024-03-01', total: 2500, paymentMethod: 'COD', status: 'Chờ xác nhận' },
  { id: 'ORD-002', customerName: 'Trần Thị B', email: 'thib@gmail.com', date: '2024-03-02', total: 1200, paymentMethod: 'Bank Transfer', status: 'Đang xử lý' },
  { id: 'ORD-003', customerName: 'Lê Văn C', email: 'vanc@gmail.com', date: '2024-03-03', total: 3999, paymentMethod: 'Installment', status: 'Đang giao' },
  { id: 'ORD-004', customerName: 'Phạm Minh D', email: 'minhd@gmail.com', date: '2024-03-04', total: 159, paymentMethod: 'COD', status: 'Hoàn thành' },
  { id: 'ORD-005', customerName: 'Hoàng Anh E', email: 'anhe@gmail.com', date: '2024-03-05', total: 589, paymentMethod: 'Bank Transfer', status: 'Đã hủy' },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  const updateStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-orange-100 text-orange-600';
      case 'Đang xử lý': return 'bg-blue-100 text-blue-600';
      case 'Đang giao': return 'bg-indigo-100 text-indigo-600';
      case 'Hoàn thành': return 'bg-green-100 text-green-600';
      case 'Đã hủy': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <AdminLayout 
      title="Quản Lý Đơn Hàng" 
      subtitle="Theo dõi và cập nhật trạng thái đơn hàng của khách hàng."
      requiredRole="staff"
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Mã đơn</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Khách hàng</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày đặt</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Tổng tiền</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Trạng thái</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <span className="text-xs font-bold text-blue-600">{order.id}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </div>
                </td>
                <td className="p-4 text-xs text-gray-500">{order.date}</td>
                <td className="p-4 text-sm font-black text-gray-900">${order.total.toLocaleString()}</td>
                <td className="p-4">
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as any)}
                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border-none focus:ring-0 cursor-pointer ${getStatusColor(order.status)}`}
                  >
                    <option value="Chờ xác nhận">Chờ xác nhận</option>
                    <option value="Đang xử lý">Đang xử lý</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-lg">print</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
