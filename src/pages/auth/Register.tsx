
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen flex flex-col font-['Jost'] transition-colors duration-300 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-zinc-900'}`}>
      {/* Standalone Nav */}
      <nav className="w-full py-6 px-8 md:px-12 bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold tracking-widest uppercase text-black dark:text-white">
            VITINH<span className="text-zinc-400">.</span>
          </Link>
          <div className="flex items-center space-x-6 text-gray-500">
             <button className="hover:text-black dark:hover:text-white transition">
              <span className="material-symbols-outlined">search</span>
            </button>
            <button onClick={toggleDarkMode} className="hover:text-black dark:hover:text-white transition">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 md:p-10 shadow-2xl border border-gray-100 dark:border-zinc-800">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-3xl font-light text-zinc-900 dark:text-white uppercase tracking-wide leading-tight">
              Đăng Ký <span className="font-bold">Tài Khoản</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tạo tài khoản để theo dõi đơn hàng và nhận ưu đãi
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Họ và tên" 
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bg-transparent focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black outline-none transition text-sm dark:text-white"
              />
              <input 
                type="tel" 
                placeholder="Số điện thoại" 
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bg-transparent focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black outline-none transition text-sm dark:text-white"
              />
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bg-transparent focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black outline-none transition text-sm dark:text-white"
              />
              <input 
                type="password" 
                placeholder="Mật khẩu" 
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bg-transparent focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black outline-none transition text-sm dark:text-white"
              />
              <input 
                type="password" 
                placeholder="Xác nhận mật khẩu" 
                className="w-full px-4 py-3 border border-gray-200 dark:border-zinc-700 bg-transparent focus:ring-1 focus:ring-black dark:focus:ring-white focus:border-black outline-none transition text-sm dark:text-white"
              />
            </div>

            <div className="flex items-start py-2">
              <div className="flex items-center h-5">
                <input type="checkbox" id="agree" className="w-4 h-4 text-black border-gray-300 rounded-none focus:ring-black" />
              </div>
              <label htmlFor="agree" className="ml-3 text-[11px] text-gray-500 dark:text-gray-400">
                Tôi đồng ý với <a href="#" className="font-bold underline text-zinc-900 dark:text-white">Điều khoản & Chính sách</a> của Vitinh.com
              </label>
            </div>

            <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-lg">
              ĐĂNG KÝ
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-gray-300 uppercase tracking-widest">HOẶC ĐĂNG KÝ VỚI</span>
              <div className="flex-grow border-t border-gray-100 dark:border-zinc-800"></div>
            </div>

            <button className="w-full border border-gray-200 dark:border-zinc-700 py-3 flex items-center justify-center space-x-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
              <svg className="w-5 h-5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"></path>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"></path>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"></path>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L14.9973 2.36864C13.4632 0.936818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"></path>
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-200">GOOGLE</span>
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-8">
            Đã có tài khoản? <Link to="/login" className="font-bold text-zinc-900 dark:text-white hover:underline">Đăng nhập ngay</Link>
          </p>
        </div>
      </main>

      <footer className="py-10 text-center border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">© 2024 VITINH.COM. BẢO LƯU MỌI QUYỀN.</p>
      </footer>
    </div>
  );
};

export default Register;
