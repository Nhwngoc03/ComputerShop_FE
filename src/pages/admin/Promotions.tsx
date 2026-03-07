
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

interface Promotion {
  id: string;
  code: string;
  discount: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'scheduled';
}

const INITIAL_PROMOTIONS: Promotion[] = [
  { id: '1', code: 'SUMMER2024', discount: '20%', startDate: '2024-06-01', endDate: '2024-08-31', status: 'active' },
  { id: '2', code: 'WELCOME50', discount: '50k', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active' },
  { id: '3', code: 'BLACKFRIDAY', discount: '30%', startDate: '2023-11-20', endDate: '2023-11-30', status: 'expired' },
  { id: '4', code: 'NEWYEAR2025', discount: '15%', startDate: '2025-01-01', endDate: '2025-01-10', status: 'scheduled' },
];

const AdminPromotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);

  const getStatusStyle = (status: Promotion['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600';
      case 'expired': return 'bg-red-100 text-red-600';
      case 'scheduled': return 'bg-blue-100 text-blue-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: Promotion['status']) => {
    switch (status) {
      case 'active': return 'Đang chạy';
      case 'expired': return 'Hết hạn';
      case 'scheduled': return 'Sắp tới';
      default: return status;
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa mã khuyến mãi này?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  return (
    <AdminLayout 
      title="Quản Lý Khuyến Mãi" 
      subtitle="Quản lý các chương trình giảm giá và mã voucher."
      requiredRole="staff"
      actions={
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center">
          <span className="material-symbols-outlined mr-2">add</span>
          Tạo Khuyến Mãi
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Mã / Giảm giá</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Thời gian</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Trạng thái</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {promotions.map((promo) => (
              <tr key={promo.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{promo.code}</span>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Giảm {promo.discount}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs text-gray-500">
                    <span>Từ: {promo.startDate}</span>
                    <span>Đến: {promo.endDate}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${getStatusStyle(promo.status)}`}>
                    {getStatusLabel(promo.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(promo.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
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

export default AdminPromotions;
