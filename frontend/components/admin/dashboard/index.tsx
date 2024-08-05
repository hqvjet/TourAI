"use client";
import React, { useEffect, useState } from "react";
import { userAPI } from "@/apis/user";
import { serviceAPI } from "@/apis/service";
import { commentAPI } from "@/apis/comment";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line, AreaChart, Area } from 'recharts';
import { Table, Spin, Alert } from 'antd';

const Dashboard = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<{ users: boolean; services: boolean; comments: boolean }>({ users: true, services: true, comments: true });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, serviceResponse, commentResponse] = await Promise.all([
          userAPI.getAllUser({}),
          serviceAPI.getAllServices({}),
          commentAPI.getComments({})
        ]);

        setUsers(userResponse.data);
        setServices(serviceResponse.data);
        setComments(commentResponse.data);
      } catch (error) {
        setError("Failed to fetch data.");
      } finally {
        setLoading({ users: false, services: false, comments: false });
      }
    };

    fetchData();
  }, []);

  if (loading.users || loading.services || loading.comments) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  const totalTourists = users.filter(user => user.role === "tourist").length;
  const totalBusinesses = users.filter(user => user.role === "business").length;

  const pieData = [
    { name: 'Tourists', value: totalTourists },
    { name: 'Businesses', value: totalBusinesses }
  ];

  const barData = services.map(service => ({
    name: `Dịch Vụ ${service.name}`,
    value: comments.filter(comment => comment.service_id === service.id).length
  }));

  const lineData = services.map(service => ({
    name: service.name,
    count: comments.filter(comment => comment.service_id === service.id).length
  }));

  const areaData = comments.reduce((acc, comment) => {
    const date = new Date(comment.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const areaChartData = Object.entries(areaData).map(([date, count]) => ({ date, count }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Thống Kê Tổng Quan</h2>
        <p className="text-gray-700 mb-2">Tổng Số Người Dùng: <span className="font-semibold">{users.length}</span> ({totalTourists} Tourist, {totalBusinesses} Business)</p>
        <p className="text-gray-700 mb-2">Tổng Số Dịch Vụ: <span className="font-semibold">{services.length}</span></p>
        <p className="text-gray-700 mb-2">Tổng Số Đánh Giá: <span className="font-semibold">{comments.length}</span></p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Biểu Đồ Thống Kê</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Phân Chia Người Dùng</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={150}
                fill="#8884d8"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#8884d8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Số Lượng Đánh Giá Theo Dịch Vụ</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Số Lượng Đánh Giá Theo Dịch Vụ</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Đánh Giá Theo Ngày</h3>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activities</h2>
        <Table
          columns={[
            { title: 'Service ID', dataIndex: 'serviceId', key: 'serviceId' },
            { title: 'Service Name', dataIndex: 'serviceName', key: 'serviceName' },
            { title: 'Rating', dataIndex: 'rating', key: 'rating' },
            { title: 'Content', dataIndex: 'content', key: 'content' },
          ]}
          dataSource={comments.map(comment => {
            const service = services.find(service => service.id === comment.service_id);
            return {
              serviceId: `${comment.service_id}`,
              serviceName: service ? service.name : 'Unknown',
              rating: comment.rating,
              content: comment.content
            };
          })}
          rowKey="id"
          className="rounded-md overflow-hidden"
        />
      </div>
    </div>
  );
};

export default Dashboard;
