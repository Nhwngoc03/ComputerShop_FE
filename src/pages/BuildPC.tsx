import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../api/services/productService';
import { cartService } from '../api/services/cartService';
import { ProductResponse } from '../api/types/product';

const BUILD_CATEGORIES = [
  { id: 'cpu', name: 'CPU - Vi xử lý', filter: 'CPU' },
  { id: 'mainboard', name: 'Mainboard - Bo mạch chủ', filter: 'Mainboard' },
  { id: 'ram', name: 'RAM - Bộ nhớ trong', filter: 'RAM' },
  { id: 'vga', name: 'VGA - Card màn hình', filter: 'VGA' },
  { id: 'ssd', name: 'SSD - Ổ cứng', filter: 'SSD' },
  { id: 'psu', name: 'PSU - Nguồn máy tính', filter: 'PSU' },
  { id: 'case', name: 'Case - Vỏ máy tính', filter: 'Case' },
];

const BuildPC: React.FC = () => {
  const { refreshCart } = useCart();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedParts, setSelectedParts] = useState<Record<string, ProductResponse | null>>({
    cpu: null,
    mainboard: null,
    ram: null,
    vga: null,
    ssd: null,
    psu: null,
    case: null,
  });

  const [selectingCategory, setSelectingCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = useMemo(() => {
    return (Object.values(selectedParts) as (ProductResponse | null)[]).reduce(
      (sum: number, part) => sum + (part?.discountedPrice || part?.basePrice || 0), 
      0
    );
  }, [selectedParts]);

  const availableProducts = useMemo(() => {
    if (!selectingCategory) return [];
    const category = BUILD_CATEGORIES.find(c => c.id === selectingCategory);
    if (!category) return [];
    
    return products.filter(p => 
      p.categoryName?.toLowerCase().includes(category.filter.toLowerCase()) ||
      p.name.toLowerCase().includes(category.filter.toLowerCase())
    );
  }, [selectingCategory, products]);

  const handleSelectPart = (product: ProductResponse) => {
    if (selectingCategory) {
      setSelectedParts(prev => ({ ...prev, [selectingCategory]: product }));
      setSelectingCategory(null);
    }
  };

  const handleRemovePart = (categoryId: string) => {
    setSelectedParts(prev => ({ ...prev, [categoryId]: null }));
  };

  const handleAddToCartAll = async () => {
    const parts = Object.values(selectedParts).filter(p => p !== null) as ProductResponse[];
    if (parts.length === 0) {
      alert('Vui lòng chọn ít nhất một linh kiện.');
      return;
    }
    
    setAddingToCart(true);
    let successCount = 0;
    let failCount = 0;
    
    // Add each part by calling API directly
    for (const part of parts) {
      if (part.variants && part.variants.length > 0) {
        try {
          await cartService.addToCart({
            variantId: part.variants[0].variantId,
            quantity: 1,
          });
          successCount++;
          console.log(`Added ${part.name} to cart`);
        } catch (error) {
          console.error(`Failed to add ${part.name}:`, error);
          failCount++;
        }
      } else {
        console.warn(`Product ${part.name} has no variants`);
        failCount++;
      }
    }
    
    // Refresh cart once after all items added
    await refreshCart();
    setAddingToCart(false);
    
    if (successCount > 0) {
      alert(`Đã thêm ${successCount} sản phẩm vào giỏ hàng${failCount > 0 ? `. ${failCount} sản phẩm thất bại.` : '!'}`);
    } else {
      alert('Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.');
    }
  };

  const handleSaveConfig = () => {
    const parts = Object.values(selectedParts).filter(p => p !== null) as ProductResponse[];
    if (parts.length === 0) {
      alert('Vui lòng chọn ít nhất một linh kiện để lưu cấu hình.');
      return;
    }

    const configName = prompt('Nhập tên cấu hình:');
    if (!configName) return;

    const savedConfigs = JSON.parse(localStorage.getItem('pc_configs') || '[]');
    const newConfig = {
      id: Date.now(),
      name: configName,
      parts: selectedParts,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    savedConfigs.push(newConfig);
    localStorage.setItem('pc_configs', JSON.stringify(savedConfigs));
    alert('Đã lưu cấu hình thành công!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-['Jost']">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-light uppercase tracking-tight text-black">
                Xây dựng <span className="font-bold">Cấu hình PC</span>
              </h1>
              <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest">Tự tay thiết kế dàn máy trong mơ của bạn</p>
            </div>
            <div className="bg-black text-white p-6 rounded-2xl shadow-xl min-w-[240px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-1">Tổng cộng dự tính</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black">${totalPrice.toFixed(2)}</span>
                <span className="text-xs opacity-60 uppercase font-bold">USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 mt-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {BUILD_CATEGORIES.map((category, index) => {
            const selectedPart = selectedParts[category.id];
            
            return (
              <div 
                key={category.id} 
                className={`flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 ${index !== BUILD_CATEGORIES.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                {/* Category Icon & Name */}
                <div className="w-full md:w-1/4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                    <span className="material-symbols-outlined">
                      {category.id === 'cpu' ? 'memory' : 
                       category.id === 'mainboard' ? 'developer_board' :
                       category.id === 'ram' ? 'sd_card' :
                       category.id === 'vga' ? 'videogame_asset' :
                       category.id === 'ssd' ? 'storage' :
                       category.id === 'psu' ? 'power' : 'computer'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">{category.name}</h3>
                  </div>
                </div>

                {/* Selected Part Info */}
                <div className="flex-1 w-full">
                  {selectedPart ? (
                    <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-300">
                      <img 
                        src={selectedPart.thumbnailUrl || '/placeholder.png'} 
                        alt={selectedPart.name} 
                        className="w-16 h-16 object-cover rounded-lg bg-gray-50"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.png';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-black truncate">{selectedPart.name}</h4>
                        <p className="text-xs text-gray-400 uppercase font-bold mt-1">
                          ${(selectedPart.discountedPrice || selectedPart.basePrice).toFixed(2)}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRemovePart(category.id)}
                        className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 transition rounded-lg"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center md:justify-start">
                      <p className="text-sm text-gray-300 italic">Chưa chọn linh kiện</p>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="w-full md:w-auto">
                  <button 
                    onClick={() => setSelectingCategory(category.id)}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${
                      selectedPart 
                      ? 'bg-gray-50 text-gray-400 hover:bg-gray-100' 
                      : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10'
                    }`}
                  >
                    {selectedPart ? 'Thay đổi' : 'Chọn linh kiện'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Final Actions */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Tiếp tục mua sắm
          </Link>
          <div className="flex gap-4 w-full md:w-auto">
            <button 
              onClick={handleSaveConfig}
              className="flex-1 md:flex-none px-8 py-4 border border-black text-black text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition rounded-xl"
            >
              Lưu cấu hình
            </button>
            <button 
              onClick={handleAddToCartAll}
              disabled={addingToCart}
              className="flex-1 md:flex-none px-10 py-4 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition rounded-xl shadow-2xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Đang thêm...' : 'Thêm tất cả vào giỏ'}
            </button>
          </div>
        </div>
        </div>
      )}

      {/* Selection Modal */}
      {selectingCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSelectingCategory(null)}
          ></div>
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase tracking-tight">
                Chọn {BUILD_CATEGORIES.find(c => c.id === selectingCategory)?.name}
              </h2>
              <button 
                onClick={() => setSelectingCategory(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {availableProducts.length > 0 ? (
                availableProducts.map(product => (
                  <div 
                    key={product.productId}
                    className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl hover:border-black hover:shadow-md transition cursor-pointer group"
                    onClick={() => handleSelectPart(product)}
                  >
                    <img 
                      src={product.thumbnailUrl || '/placeholder.png'} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-xl bg-gray-50 group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-black truncate">{product.name}</h4>
                      <p className="text-xs text-gray-400 mt-1">{product.brandName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-black">
                        ${(product.discountedPrice || product.basePrice).toFixed(2)}
                      </p>
                      <button className="mt-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 hover:underline">Chọn</button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-200 mb-4">inventory_2</span>
                  <p className="text-gray-400 text-sm">Không tìm thấy sản phẩm phù hợp</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuildPC;
