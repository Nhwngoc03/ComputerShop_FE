
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  requiredRole?: 'admin' | 'staff';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle, actions, requiredRole }) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/admin" />;
  }

  const navItems = [
    { path: '/admin', label: 'Tổng Quan', icon: 'dashboard' },
    { path: '/admin/products', label: 'Sản Phẩm', icon: 'inventory_2' },
    { path: '/admin/categories', label: 'Danh Mục', icon: 'category' },
    { path: '/admin/brands', label: 'Thương Hiệu', icon: 'branding_watermark' },
    { path: '/admin/orders', label: 'Đơn Hàng', icon: 'shopping_cart' },
    { path: '/admin/promotions', label: 'Khuyến Mãi', icon: 'sell' },
    { path: '/admin/users', label: 'Người Dùng', icon: 'group', adminOnly: true },
    { path: '#', label: 'Cấu Hình', icon: 'settings' },
  ];

  const filteredNavItems = navItems.filter(item => !item.adminOnly || user?.role === 'admin');

  return (
    <div className="min-h-screen bg-gray-50 flex font-['Jost']">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100">
          <Link to="/admin" className="text-xl font-bold text-blue-600 uppercase tracking-tight">
            ViTinh<span className="text-gray-900">.admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                  isActive 
                    ? 'bg-blue-50 text-blue-600 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="material-symbols-outlined mr-3 text-xl">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition">
            <span className="material-symbols-outlined mr-3 text-xl">logout</span>
            Thoát Quản Trị
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-3">
              {actions}
            </div>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
