import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { motion } from 'motion/react';

const Compare: React.FC = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center">
        <span className="material-symbols-outlined text-6xl text-gray-200 mb-4">compare_arrows</span>
        <h1 className="text-3xl font-light uppercase tracking-tight text-black mb-4">So sánh sản phẩm</h1>
        <p className="text-gray-500 mb-8">Bạn chưa chọn sản phẩm nào để so sánh.</p>
        <Link 
          to="/shop" 
          className="inline-block px-8 py-3 bg-black text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition"
        >
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const allSpecKeys: string[] = Array.from(
    new Set(
      compareItems.flatMap((item) => (item.specs ? Object.keys(item.specs) : []))
    )
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-['Jost']">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-light uppercase tracking-tight text-black">So sánh <span className="font-bold">Sản phẩm</span></h1>
          <p className="text-gray-400 mt-2 text-[10px] font-bold uppercase tracking-[0.2em]">So sánh chi tiết cấu hình và giá bán</p>
        </div>
        <button 
          onClick={clearCompare}
          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          Xóa tất cả
        </button>
      </div>

      <div className="overflow-x-auto pb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 bg-gray-50 border border-gray-100 w-48 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Đặc điểm</th>
              {compareItems.map((item) => (
                <th key={item.id} className="p-6 bg-white border border-gray-100 min-w-[280px] relative group">
                  <button 
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
                  >
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                  <Link to={`/product/${item.id}`} className="block">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-32 h-32 object-contain mx-auto mb-4 group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <h3 className="text-sm font-bold text-black line-clamp-2 mb-2 h-10">{item.name}</h3>
                    <p className="text-lg font-black text-black">
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>
                  </Link>
                  <button 
                    onClick={() => addToCart(item)}
                    className="mt-4 w-full py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-gray-800 transition"
                  >
                    Thêm vào giỏ
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* General Info */}
            <tr className="bg-gray-50/50">
              <td colSpan={compareItems.length + 1} className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100">Thông tin chung</td>
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">Thương hiệu</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-6 border border-gray-100 text-sm font-medium text-gray-600 text-center">
                  {item.brand}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">Danh mục</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-6 border border-gray-100 text-sm font-medium text-gray-600 text-center">
                  {item.category}
                </td>
              ))}
            </tr>

            {/* Technical Specs */}
            <tr className="bg-gray-50/50">
              <td colSpan={compareItems.length + 1} className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100">Thông số kỹ thuật</td>
            </tr>
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="p-4 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">{key}</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="p-6 border border-gray-100 text-sm text-gray-600 text-center">
                    {item.specs && item.specs[key] ? String(item.specs[key]) : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}

            {/* Ratings & Status */}
            <tr className="bg-gray-50/50">
              <td colSpan={compareItems.length + 1} className="p-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border border-gray-100">Đánh giá & Tình trạng</td>
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">Đánh giá</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-6 border border-gray-100 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-yellow-400 text-sm fill-current">star</span>
                    <span className="text-sm font-bold">{item.rating}</span>
                    <span className="text-xs text-gray-400">({item.reviews})</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tình trạng</td>
              {compareItems.map((item) => (
                <td key={item.id} className="p-6 border border-gray-100 text-center">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Còn hàng</span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compare;
