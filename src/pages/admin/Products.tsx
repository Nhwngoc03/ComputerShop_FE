
import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { PRODUCTS } from '../../constants/index';
import { Product } from '../../types/index';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    brand: '',
    category: 'Linh kiện',
    price: 0,
    image: 'https://picsum.photos/seed/pc/400/400',
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      ...newProduct as Product,
      id: Date.now().toString(),
    };
    setProducts([product, ...products]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      brand: '',
      category: 'Linh kiện',
      price: 0,
      image: 'https://picsum.photos/seed/pc/400/400',
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <AdminLayout 
      title="Danh Sách Sản Phẩm" 
      subtitle={`Quản lý ${products.length} sản phẩm trong hệ thống.`}
      requiredRole="staff"
      actions={
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition flex items-center"
        >
          <span className="material-symbols-outlined mr-2">add</span>
          Thêm Mới
        </button>
      }
    >
      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Tìm kiếm theo tên hoặc thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition"
          />
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition flex-1 md:flex-none">
            <option>Tất cả danh mục</option>
            <option>Linh kiện</option>
            <option>Laptop</option>
            <option>Bàn phím</option>
          </select>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <span className="material-symbols-outlined text-gray-600">filter_list</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sản phẩm</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Danh mục</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Giá bán</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg p-2 border border-gray-100 flex-shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-900">${product.price.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest ${
                      product.tag === 'Hết hàng' ? 'text-red-500' : 'text-green-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        product.tag === 'Hết hàng' ? 'bg-red-500' : 'bg-green-600'
                      }`}></span>
                      {product.tag === 'Hết hàng' ? 'Hết hàng' : 'Đang bán'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" title="Chỉnh sửa">
                        <span className="material-symbols-outlined text-xl">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition" 
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">inventory_2</span>
                    <p className="text-gray-500 text-sm">Không tìm thấy sản phẩm nào khớp với tìm kiếm.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Thêm Sản Phẩm Mới</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tên sản phẩm</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  placeholder="Ví dụ: Laptop Gaming MSI..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Thương hiệu</label>
                  <input 
                    type="text" 
                    required
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                    placeholder="MSI, ASUS..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Danh mục</label>
                  <select 
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Linh kiện">Linh kiện</option>
                    <option value="CPU">CPU</option>
                    <option value="VGA">VGA</option>
                    <option value="RAM">RAM</option>
                    <option value="Màn hình">Màn hình</option>
                    <option value="Phụ kiện">Phụ kiện</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Giá bán ($)</label>
                <input 
                  type="number" 
                  required
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">URL Hình ảnh</label>
                <input 
                  type="text" 
                  required
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                >
                  Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
