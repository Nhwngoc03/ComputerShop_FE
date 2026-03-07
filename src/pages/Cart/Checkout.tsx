import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'installment'>('cod');
  const [installmentPlan, setInstallmentPlan] = useState<'3' | '6' | '12'>('6');
  const [isProcessing, setIsProcessing] = useState(false);

  const monthlyPayment = (totalPrice / parseInt(installmentPlan)).toFixed(2);

  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart.length, navigate]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert('Đơn hàng đã được đặt thành công! Cảm ơn bạn đã mua sắm.');
      clearCart();
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 font-['Jost']">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <h1 className="text-4xl font-light uppercase tracking-tight text-black mb-10">
            Thanh <span className="font-bold">Toán</span>
          </h1>

          <form onSubmit={handlePlaceOrder} className="space-y-12">
            {/* Shipping Info */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-100 pb-2">Thông tin giao hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Họ và tên</label>
                  <input 
                    type="text" 
                    defaultValue={user?.name || ''}
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm rounded-xl focus:ring-1 focus:ring-black outline-none transition"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Số điện thoại</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm rounded-xl focus:ring-1 focus:ring-black outline-none transition"
                    placeholder="0901 234 567"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Địa chỉ nhận hàng</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border-none p-4 text-sm rounded-xl focus:ring-1 focus:ring-black outline-none transition"
                    placeholder="Số nhà, tên đường, phường/xã..."
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 border-b border-gray-100 pb-2">Phương thức thanh toán</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${paymentMethod === 'cod' ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <span className="material-symbols-outlined">local_shipping</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Khi nhận hàng (COD)</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${paymentMethod === 'bank' ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <span className="material-symbols-outlined">account_balance</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Chuyển khoản</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setPaymentMethod('installment')}
                  className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 ${paymentMethod === 'installment' ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <span className="material-symbols-outlined">credit_card</span>
                  <span className="text-xs font-bold uppercase tracking-widest">Trả góp 0%</span>
                </button>
              </div>

              {/* Installment Options */}
              {paymentMethod === 'installment' && (
                <div className="mt-8 p-8 bg-gray-50 rounded-3xl animate-in fade-in slide-in-from-top-4 duration-500">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Chọn kỳ hạn trả góp</h4>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {['3', '6', '12'].map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => setInstallmentPlan(plan as any)}
                        className={`py-4 rounded-xl text-xs font-bold transition-all ${installmentPlan === plan ? 'bg-black text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
                      >
                        {plan} Tháng
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mỗi tháng trả</p>
                      <p className="text-xl font-black text-black">${monthlyPayment}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Lãi suất 0%</p>
                      <p className="text-[10px] text-gray-400">Trả trước $0</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white py-6 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition rounded-2xl shadow-2xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="w-full lg:w-96">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 sticky top-32 shadow-2xl shadow-black/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black mb-8 border-b border-gray-50 pb-4">Đơn hàng của bạn</h3>
            
            <div className="max-h-[300px] overflow-y-auto mb-8 space-y-4 pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-black truncate">{item.name}</h4>
                    <p className="text-[10px] text-gray-400">SL: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-black">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Tổng tiền hàng</span>
                <span className="font-bold text-black">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Phí vận chuyển</span>
                <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Miễn phí</span>
              </div>
              <div className="pt-4 border-t border-gray-50 flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-widest text-black">Tổng thanh toán</span>
                <p className="text-2xl font-black text-black leading-none">${totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
