import React, { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
}

const INITIAL_USERS: UserItem[] = [
  { id: '1', name: 'Admin Root', email: 'admin@vitinh.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
  { id: '2', name: 'Nguyễn Văn Staff', email: 'staff@vitinh.com', role: 'staff', status: 'active', joinDate: '2024-02-15' },
  { id: '3', name: 'Trần Thị User', email: 'user@vitinh.com', role: 'user', status: 'active', joinDate: '2024-03-10' },
  { id: '4', name: 'Lê Văn Khách', email: 'khach@gmail.com', role: 'user', status: 'inactive', joinDate: '2024-03-12' },
];

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const changeRole = (id: string, newRole: 'admin' | 'staff' | 'user') => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  return (
    <AdminLayout 
      title="Quản Lý Người Dùng" 
      subtitle="Quản lý tài khoản khách hàng và nhân viên hệ thống."
      requiredRole="admin"
      actions={
        <button className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">person_add</span>
          Thêm nhân viên
        </button>
      }
    >
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Người dùng</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Vai trò</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Trạng thái</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ngày tham gia</th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <select 
                    value={user.role}
                    onChange={(e) => changeRole(user.id, e.target.value as any)}
                    className="text-xs font-bold uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer text-gray-600"
                  >
                    <option value="admin">Admin</option>
                    <option value="staff">Staff</option>
                    <option value="user">User</option>
                  </select>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    {user.status === 'active' ? 'Hoạt động' : 'Khóa'}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500">{user.joinDate}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`p-2 rounded-lg transition ${user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                      title={user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {user.status === 'active' ? 'block' : 'check_circle'}
                      </span>
                    </button>
                    <button className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition">
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
