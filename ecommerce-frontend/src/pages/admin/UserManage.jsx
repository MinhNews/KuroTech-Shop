import { useState, useEffect } from 'react';
import { Trash2, Users, Shield, ShieldAlert, User, CheckCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import useAuthStore from '../../store/useAuthStore';
import { Navigate } from 'react-router-dom';

const UserManage = () => {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Chỉ Admin mới được vào trang này
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await axiosClient.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (user?.role !== 'admin') {
    return <Navigate to="/admin/orders" replace />;
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axiosClient.put(`/users/${userId}/role`, { role: newRole });
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      alert("Lỗi cập nhật phân quyền!");
      console.error(error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa (khóa) người dùng này?")) return;
    try {
      await axiosClient.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert("Lỗi khi xóa người dùng!");
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-primary" size={24} />
          Quản lý Tài khoản ({users.length})
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-medium">Người dùng</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Ngày đăng ký</th>
              <th className="p-4 font-medium">Quyền hạn (Role)</th>
              <th className="p-4 font-medium text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(item => (
              <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-medium text-slate-800">{item.username}</div>
                  </div>
                </td>
                <td className="p-4 text-slate-600">{item.email}</td>
                <td className="p-4 text-slate-600">
                  {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="p-4">
                  {/* Select box đổi quyền */}
                  {item.role === 'admin' && item.email === 'admin@kurotech.com' ? (
                    <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full text-xs">
                      <ShieldAlert size={14} /> SUPREME ADMIN
                    </span>
                  ) : (
                    <select
                      value={item.role}
                      onChange={(e) => handleRoleChange(item._id, e.target.value)}
                      className={`text-sm font-medium px-3 py-1.5 rounded-full border outline-none cursor-pointer ${
                        item.role === 'admin' ? 'bg-red-50 text-red-600 border-red-200' :
                        item.role === 'staff' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="staff">Nhân viên (Staff)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  )}
                </td>
                <td className="p-4 text-center">
                  {!(item.role === 'admin' && item.email === 'admin@kurotech.com') && (
                    <button 
                      onClick={() => handleDeleteUser(item._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      title="Khóa tài khoản"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManage;
