
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Laptop', slug: 'laptop', productCount: 25 },
  { id: '2', name: 'Linh kiện', slug: 'linh-kien', productCount: 45 },
  { id: '3', name: 'CPU', slug: 'cpu', productCount: 12 },
  { id: '4', name: 'VGA', slug: 'vga', productCount: 18 },
  { id: '5', name: 'RAM', slug: 'ram', productCount: 30 },
];

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <AdminLayout 
      title="Quản Lý Danh Mục" 
      subtitle="Phân loại các sản phẩm trong hệ thống."
      requiredRole="staff"
      actions={
        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center">
          <span className="material-symbols-outlined mr-2">add</span>
          Thêm Danh Mục
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tên danh mục</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Slug</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Số lượng sản phẩm</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{cat.name}</p>
                </td>
                <td className="px-6 py-4">
                  <code className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{cat.slug}</code>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-600">{cat.productCount} sản phẩm</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDelete(cat.id)}
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

export default AdminCategories;
