
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types/index';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
      navigate('/login');
      return;
    }
    
    addToCart(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const isCompared = isInCompare(product.id);

  return (
    <div className="group flex flex-col bg-white border border-transparent hover:border-gray-100 transition duration-300 relative">
      <div 
        onClick={() => navigate(`/product/${product.id}`)}
        className="relative aspect-square bg-gray-50 overflow-hidden p-8 flex items-center justify-center cursor-pointer"
      >
        {product.tag && (
          <span className={`absolute top-4 left-4 z-10 text-[10px] font-bold px-2 py-1 uppercase tracking-widest shadow-sm ${
            product.tag === 'Giảm giá' ? 'bg-red-600 text-white' : 'bg-black text-white'
          }`}>
            {product.tag}
          </span>
        )}
        <button 
          onClick={handleCompare}
          className={`absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
            isCompared ? 'bg-black text-white' : 'bg-white text-gray-400 hover:text-black'
          }`}
          title={isCompared ? "Xóa khỏi so sánh" : "Thêm vào so sánh"}
        >
          <span className="material-symbols-outlined text-sm">compare_arrows</span>
        </button>
        <img 
          src={product.image} 
          alt={product.name} 
          className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
          <button 
            onClick={handleAddToCart}
            className="bg-white text-black px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition shadow-xl"
          >
            Thêm vào giỏ
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            className="bg-black text-white px-4 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition shadow-xl"
          >
            Chi tiết
          </button>
        </div>
      </div>
      <div className="p-4 text-center">
        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-[0.2em] mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition truncate">{product.name}</h3>
        </Link>
        <div className="mt-2 flex justify-center items-center space-x-3">
          <span className="text-sm font-bold">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
