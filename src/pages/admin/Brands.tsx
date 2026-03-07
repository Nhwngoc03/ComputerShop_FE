
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
}

const INITIAL_BRANDS: Brand[] = [
  { id: '1', name: 'MSI', logo: 'https://picsum.photos/seed/msi/100/100', productCount: 12 },
  { id: '2', name: 'ASUS', logo: 'https://picsum.photos/seed/asus/100/100', productCount: 15 },
  { id: '3', name: 'Gigabyte', logo: 'https://picsum.photos/seed/gigabyte/100/100', productCount: 8 },
  { id: '4', name: 'Corsair', logo: 'https://picsum.photos/seed/corsair/100/100', productCount: 20 },
];

const AdminBrands: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>(INITIAL_BRANDS);

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      setBrands(brands.filter(b => b.id !== id));
    }
  };

  return (
    <AdminLayout 
      title="Quản Lý Thương Hiệu" 
      subtitle="Quản lý các hãng sản xuất thiết bị phần cứng."
      requiredRole="staff"
      actions={
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center">
          <span className="material-symbols-outlined mr-2">add</span>
          Thêm Thương Hiệu
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Thương hiệu</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Số lượng sản phẩm</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {brands.map((brand) => (
              <tr key={brand.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <img src={brand.logo} alt="" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">{brand.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-600">{brand.productCount} sản phẩm</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(brand.id)}
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

export default AdminBrands;
