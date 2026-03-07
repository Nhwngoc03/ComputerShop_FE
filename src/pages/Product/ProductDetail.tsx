
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../constants/index';
import { Product } from '../../types/index';
import ProductCard from '../../components/ui/ProductCard';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'reviews'>('specs');
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const navigate = useNavigate();

  useEffect(() => {
    const found = PRODUCTS.find(p => p.id === id);
    if (found) setProduct(found);
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate('/login');
      return;
    }

    if (product) {
      // For simplicity in this demo, we add the item 'quantity' times
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      // Optional: show a toast or redirect
      if (window.confirm('Đã thêm vào giỏ hàng! Bạn có muốn xem giỏ hàng ngay không?')) {
        navigate('/cart');
      }
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua hàng.');
      navigate('/login');
      return;
    }

    if (product) {
      addToCart(product);
      navigate('/checkout');
    }
  };

  const handleInstallment = () => {
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để mua trả góp.');
      navigate('/login');
      return;
    }

    if (product) {
      addToCart(product);
      navigate('/checkout');
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-light uppercase tracking-widest">Sản phẩm không tồn tại</h2>
        <Link to="/" className="text-sm font-bold underline uppercase tracking-widest">Quay lại trang chủ</Link>
      </div>
    );
  }

  // Lấy các sản phẩm liên quan (cùng category nhưng khác ID)
  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Jost']">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="hover:text-black transition">Trang chủ</Link></li>
          <li><span className="text-gray-300">/</span></li>
          <li><Link to="/shop" className="hover:text-black transition">{product.category}</Link></li>
          <li><span className="text-gray-300">/</span></li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-16 lg:items-start">
        {/* Left: Image Gallery */}
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto no-scrollbar">
            {[1, 2, 3, 4].map((_, i) => (
              <button key={i} className={`relative h-20 w-20 flex-shrink-0 border transition-all ${i === 0 ? 'border-black' : 'border-transparent hover:border-gray-200'}`}>
                <img src={product.image} alt="" className="w-full h-full object-contain p-2" />
              </button>
            ))}
          </div>
          {/* Main Image */}
          <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative group overflow-hidden">
            {product.tag && (
              <span className="absolute top-4 left-4 z-10 bg-black text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                {product.tag}
              </span>
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-110 mix-blend-multiply" 
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="mt-10 px-0 sm:mt-16 lg:mt-0">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">{product.brand}</p>
          <h1 className="text-3xl lg:text-4xl font-light text-gray-900 uppercase tracking-wide leading-tight mb-4">
            {product.name}
          </h1>

          <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6">
            <div className="space-y-1">
              <p className="text-3xl font-medium text-gray-900">${product.price.toLocaleString()}</p>
              {product.originalPrice && (
                <p className="text-sm text-gray-400 line-through">${product.originalPrice.toLocaleString()}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} className="material-symbols-outlined text-sm fill-current">star</span>
                ))}
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(24 Đánh giá)</p>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            {product.description || "Trải nghiệm đỉnh cao hiệu năng với dòng sản phẩm hàng đầu của chúng tôi. Được thiết kế cho những người dùng khắt khe nhất, mang lại sự ổn định và tốc độ vượt trội."}
          </p>

          {/* Highlights */}
          {product.specs && (
            <div className="mb-8 space-y-3">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 mb-4">Thông số nổi bật</h3>
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex items-center text-sm text-gray-600">
                  <span className="material-symbols-outlined text-lg mr-3 text-gray-300">check_circle</span>
                  {/* Fix: Explicitly cast value to string to ensure it's treated as a valid ReactNode */}
                  <span className="font-medium mr-2">{key}:</span> {String(value)}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex border border-gray-200 h-14">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 hover:bg-gray-50 transition"
                >−</button>
                <input 
                  type="number" 
                  value={quantity}
                  readOnly
                  className="w-12 text-center border-none focus:ring-0 text-sm font-bold"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 hover:bg-gray-50 transition"
                >+</button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-black text-white text-[11px] font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-xl"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleInstallment}
                className="flex-1 border border-gray-200 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-gray-50 transition"
              >
                Mua trả góp 0%
              </button>
              <button 
                onClick={() => product && (isInCompare(product.id) ? removeFromCompare(product.id) : addToCompare(product))}
                className={`w-14 flex items-center justify-center border transition ${
                  product && isInCompare(product.id) ? 'bg-black text-white border-black' : 'border-gray-200 hover:text-black hover:border-black'
                }`}
                title="So sánh sản phẩm"
              >
                <span className="material-symbols-outlined">compare_arrows</span>
              </button>
              <button className="w-14 flex items-center justify-center border border-gray-200 hover:text-red-500 hover:border-red-500 transition">
                <span className="material-symbols-outlined">favorite</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center space-x-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-lg mr-2">verified_user</span>
              Bảo hành chính hãng
            </div>
            <div className="flex items-center">
              <span className="material-symbols-outlined text-lg mr-2">local_shipping</span>
              Giao hàng hỏa tốc
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-24">
        <div className="flex space-x-12 border-b border-gray-100 mb-10">
          {[
            { id: 'specs', label: 'Thông số kỹ thuật' },
            { id: 'desc', label: 'Mô tả chi tiết' },
            { id: 'reviews', label: 'Đánh giá (24)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab.id ? 'text-black' : 'text-gray-300 hover:text-gray-500'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-px bg-black"></div>}
            </button>
          ))}
        </div>

        <div className="max-w-3xl">
          {activeTab === 'specs' && (
            <div className="border border-gray-100 divide-y divide-gray-100">
              {Object.entries(product.specs || {}).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 p-5">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{key}</span>
                  {/* Fix: Explicitly cast value to string to avoid ReactNode error */}
                  <span className="col-span-2 text-sm text-gray-900">{String(value)}</span>
                </div>
              ))}
              {!product.specs && <p className="p-5 text-sm text-gray-500 italic">Đang cập nhật thông số...</p>}
            </div>
          )}
          {activeTab === 'desc' && (
            <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed">
              <p>Sản phẩm mang lại hiệu năng vượt trội cho mọi tác vụ từ gaming đến đồ họa chuyên nghiệp. Thiết kế hiện đại, tối ưu luồng khí và tính thẩm mỹ cao.</p>
              <p>Chính sách đổi trả trong vòng 30 ngày nếu có lỗi từ nhà sản xuất. Hỗ trợ kỹ thuật 24/7 trọn đời sản phẩm.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-32">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-light uppercase tracking-widest">Sản phẩm <span className="font-bold">Liên quan</span></h2>
            <Link to="/shop" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black underline underline-offset-8">Xem tất cả</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
