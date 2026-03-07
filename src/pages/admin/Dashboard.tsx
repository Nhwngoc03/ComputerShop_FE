
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import AdminLayout from '../../components/layout/AdminLayout';

const data = [
  { name: 'T1', rev: 400 },
  { name: 'T2', rev: 600 },
  { name: 'T3', rev: 800 },
  { name: 'T4', rev: 500 },
  { name: 'T5', rev: 900 },
  { name: 'T6', rev: 1100 },
  { name: 'T7', rev: 1300 },
];

const Dashboard: React.FC = () => {
  return (
    <AdminLayout 
      title="Quản Trị Hệ Thống" 
      subtitle="Báo cáo hoạt động kinh doanh thời gian thực."
      requiredRole="staff"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Doanh Thu', val: '24,560,000 đ', trend: '+12.5%', color: 'blue' },
          { label: 'Đơn Hàng', val: '1,342', trend: '+5.2%', color: 'indigo' },
          { label: 'Khách Hàng', val: '892', trend: '-2.1%', color: 'orange' },
          { label: 'Chờ Xử Lý', val: '45', trend: 'Cần chú ý', color: 'red' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between mb-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <span className={`material-symbols-outlined text-${stat.color}-600`}>insights</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.val}</h3>
            <p className={`text-xs mt-2 ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-bold mb-6">Biểu Đồ Doanh Thu</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="rev" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <h2 className="text-lg font-bold mb-6">Trạng Thái Tồn Kho</h2>
          <div className="space-y-6">
            {[
              { name: 'Laptop', pct: 75, color: 'blue' },
              { name: 'Linh Kiện', pct: 42, color: 'orange' },
              { name: 'Phụ Kiện', pct: 28, color: 'red' },
            ].map((cat, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-bold mb-2 uppercase tracking-wide">
                  <span>{cat.name}</span>
                  <span>{cat.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${cat.color}-600 rounded-full transition-all duration-1000`} 
                    style={{ width: `${cat.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
