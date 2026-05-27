// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, Activity } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/stats/dashboard');
        setStatsData(res.data);
      } catch (error) {
        console.error("Lỗi lấy số liệu dashboard:", error);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: "Tổng Sản Phẩm", value: statsData.products, icon: <ShoppingBag size={24} className="text-blue-500" />, bg: "bg-blue-50" },
    { title: "Đơn Hàng", value: statsData.orders, icon: <Activity size={24} className="text-green-500" />, bg: "bg-green-50" },
    { title: "Khách Hàng", value: statsData.users, icon: <Users size={24} className="text-purple-500" />, bg: "bg-purple-50" },
    { title: "Doanh Thu", value: `${statsData.revenue.toLocaleString('vi-VN')} ₫`, icon: <DollarSign size={24} className="text-orange-500" />, bg: "bg-orange-50" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[400px] flex items-center justify-center">
        <p className="text-slate-400 font-medium text-lg">Biểu đồ thống kê sẽ hiển thị ở đây</p>
      </div>
    </div>
  );
};

export default Dashboard;
