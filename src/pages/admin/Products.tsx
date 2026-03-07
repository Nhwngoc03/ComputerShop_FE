import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { productService } from '../../api/services/productService';
import { ProductResponse } from '../../api/types/product';
import { categoryService } from '../../api/services/categoryService';
import { brandService } from '../../api/services/brandService';
import { CategoryResponse } from '../../api/types/category';
import { BrandResponse } from '../../api/types/brand';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    categoryId: 0,
    brandId: 0,
    basePrice: 0,
  });
  const [images, setImages] = useState<File[]>([]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getAllProducts();
      console.log('Products data:', data);
      setProducts(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndBrands = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoryService.getAllCategories(),
        brandService.getAllBrands(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (err: any) {
      console.error('Error fetching categories/brands:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndBrands();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     p.productName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    p.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategoryId === 0 || p.categoryId === selectedCategoryId;
    
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productName.trim() || formData.categoryId === 0 || formData.brandId === 0) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await productService.createProduct({
        name: formData.productName.trim(), // Backend uses 'name'
        description: formData.description.trim() || undefined,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        basePrice: formData.basePrice,
      }, images.length > 0 ? images : undefined);
      
      setShowAddModal(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to create product');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      // Only send fields that have been changed
      const updateData: any = {};
      const currentName = selectedProduct.name || selectedProduct.productName;
      
      if (formData.productName.trim() && formData.productName !== currentName) {
        updateData.name = formData.productName.trim();
      }
      
      if (formData.description.trim() !== (selectedProduct.description || '')) {
        updateData.description = formData.description.trim() || undefined;
      }
      
      if (formData.categoryId && formData.categoryId !== selectedProduct.categoryId) {
        updateData.categoryId = formData.categoryId;
      }
      
      if (formData.brandId && formData.brandId !== selectedProduct.brandId) {
        updateData.brandId = formData.brandId;
      }
      
      if (formData.basePrice && formData.basePrice !== selectedProduct.basePrice) {
        updateData.basePrice = formData.basePrice;
      }
      
      // Check if there are any changes
      if (Object.keys(updateData).length === 0 && images.length === 0) {
        alert('Không có thay đổi nào để cập nhật');
        return;
      }
      
      await productService.updateProduct(
        selectedProduct.productId, 
        updateData,
        images.length > 0 ? images : undefined
      );
      
      setShowEditModal(false);
      setSelectedProduct(null);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      console.error('Update error:', err);
      alert(err.message || 'Failed to update product');
    }
  };

  const openEditModal = (product: ProductResponse) => {
    setSelectedProduct(product);
    setFormData({
      productName: (product.name || product.productName) || '',
      description: product.description || '',
      categoryId: product.categoryId || 0,
      brandId: product.brandId || 0,
      basePrice: product.basePrice || 0,
    });
    setImages([]);
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      description: '',
      categoryId: 0,
      brandId: 0,
      basePrice: 0,
    });
    setImages([]);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
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
          <select 
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition flex-1 md:flex-none"
          >
            <option value={0}>Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
            ))}
          </select>
          <button 
            onClick={() => {
              setSearchTerm('');
              setSelectedCategoryId(0);
            }}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            title="Xóa bộ lọc"
          >
            <span className="material-symbols-outlined text-gray-600">filter_list_off</span>
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={fetchProducts} className="text-xs underline mt-2 hover:text-red-800">
            Thử lại
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Sản phẩm</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Danh mục</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Thương hiệu</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Giá bán</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tồn kho</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProducts.map((product) => (
                  <tr key={product.productId} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {(product.thumbnailUrl || product.imageUrls?.[0] || product.primaryImage) && (
                          <div className="w-12 h-12 bg-gray-50 rounded-lg p-2 border border-gray-100 flex-shrink-0">
                            <img src={product.thumbnailUrl || product.imageUrls?.[0] || product.primaryImage} alt="" className="w-full h-full object-contain" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name || product.productName}</p>
                          <p className="text-xs text-gray-500">ID: {product.productId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-widest rounded">
                        {product.categoryName || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{product.brandName || '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{formatCurrency(product.basePrice)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center text-[10px] font-bold uppercase tracking-widest ${
                        ((product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0) > 0) ? 'text-green-600' : 'text-red-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                          ((product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0) > 0) ? 'bg-green-600' : 'bg-red-500'
                        }`}></span>
                        {product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition" 
                          title="Chỉnh sửa"
                        >
                          <span className="material-symbols-outlined text-xl">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product.productId)}
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
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <span className="material-symbols-outlined text-5xl text-gray-200 mb-4">inventory_2</span>
                      <p className="text-gray-500 text-sm">Không tìm thấy sản phẩm nào.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Thêm Sản Phẩm Mới</h2>
              <button onClick={() => { setShowAddModal(false); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu *</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option value={0}>Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá cơ bản (USD) *</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{images.length} file(s) đã chọn</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Tạo Sản Phẩm
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Chỉnh Sửa Sản Phẩm</h2>
              <button onClick={() => { setShowEditModal(false); setSelectedProduct(null); resetForm(); }} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tên sản phẩm</label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={0}>Chọn danh mục</option>
                    {categories.map(cat => (
                      <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Thương hiệu</label>
                  <select
                    value={formData.brandId}
                    onChange={(e) => setFormData({ ...formData, brandId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={0}>Chọn thương hiệu</option>
                    {brands.map(brand => (
                      <option key={brand.brandId} value={brand.brandId}>{brand.brandName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Giá cơ bản (USD)</label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  min={0}
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh mới (tùy chọn)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">{images.length} file(s) đã chọn</p>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Cập Nhật
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); setSelectedProduct(null); resetForm(); }}
                  className="px-6 py-2.5 border border-gray-200 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Hủy
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
