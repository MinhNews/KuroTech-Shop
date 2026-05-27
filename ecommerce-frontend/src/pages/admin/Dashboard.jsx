// src/pages/admin/Dashboard.jsx
import { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, Activity } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [statsData, setStatsData] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    chartData: []
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl text-sm border border-slate-700">
          <p className="font-semibold mb-1">{label}</p>
          <p className="text-blue-400">
            Doanh thu: {payload[0].value.toLocaleString('vi-VN')} ₫
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
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
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">Doanh thu theo tháng</h2>
          <p className="text-sm text-slate-500">Thống kê doanh thu từ các đơn hàng giao thành công</p>
        </div>
        
        <div className="h-[400px] w-full">
          {statsData.chartData && statsData.chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={statsData.chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
