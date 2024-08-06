import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Spin, Alert, message } from 'antd';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { serviceAPI } from '@/apis/service';
import { commentAPI } from '@/apis/comment';
import { authAPI } from '@/apis/auth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733'];

const Dashboard = () => {
  const [services, setServices] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await authAPI.cookie();
        const fetchedUserId = response.data.user_id;
        setUserId(fetchedUserId);
      } catch (error) {
        console.error('Failed to fetch user ID from cookie:', error);
        setError('Failed to fetch user ID.');
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [serviceResponse, commentResponse] = await Promise.all([
            serviceAPI.getMyServices(userId),
            commentAPI.getComments({})
          ]);

          const ownedServiceIds = new Set(serviceResponse.data.map((service: any) => service.id));
          const ownedComments = commentResponse.data.filter((comment: any) =>
            ownedServiceIds.has(comment.service_id)
          );

          setServices(serviceResponse.data);
          setComments(ownedComments);
        } catch (err) {
          setError('Failed to fetch data.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [userId]);

  const serviceRatings = services.reduce((acc: any, service: any) => {
    const serviceComments = comments.filter((comment: any) => comment.service_id === service.id);
    const totalRating = serviceComments.reduce((total: number, comment: any) => total + comment.rating, 0);
    const averageRating = serviceComments.length ? (totalRating / serviceComments.length).toFixed(1) : 0;
    acc[service.name] = averageRating;
    return acc;
  }, {});

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Services" value={services.length} />
            <Statistic title="Total Comments" value={comments.length} className="mt-4" />
          </Card>
        </Col>
        <Col span={16}>
          <Card>
            <h2 className="text-xl font-bold mb-4">Service Rating Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={Object.entries(serviceRatings).map(([name, value]) => ({ name, value: Number(value) }))}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={150}
                  fill="#8884d8"
                  label
                >
                  {Object.entries(serviceRatings).map(([name, value], index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value} Star`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
