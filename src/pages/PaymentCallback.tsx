import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'failed'>('processing');
  const [message, setMessage] = useState('Đang xử lý thanh toán...');

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    const transactionStatus = searchParams.get('vnp_TransactionStatus');
    const orderId = searchParams.get('vnp_TxnRef');

    if (responseCode === '00' && transactionStatus === '00') {
      setStatus('success');
      setMessage('Thanh toán thành công!');
      
      // Redirect to order detail after 3 seconds
      setTimeout(() => {
        navigate('/orders');
      }, 3000);
    } else {
      setStatus('failed');
      setMessage('Thanh toán thất bại. Vui lòng thử lại.');
      
      // Redirect to cart after 3 seconds
      setTimeout(() => {
        navigate('/cart');
      }, 3000);
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Đang xử lý</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-green-600">check_circle</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thành công!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Đang chuyển hướng đến trang đơn hàng...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl text-red-600">cancel</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Thất bại</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <p className="text-sm text-gray-500">Đang chuyển hướng về giỏ hàng...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
