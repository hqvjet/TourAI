import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Spin, Alert, message } from 'antd';
import { commentAPI } from '@/apis/comment';
import { serviceAPI } from '@/apis/service';
import { authAPI } from '@/apis/auth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF5733'];

interface RatingData {
  name: string;
  value: number;
  percentage: string;
}

const RatingDistribution: React.FC = () => {
  const [ratings, setRatings] = useState<RatingData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserId = async () => {
    try {
      const response = await authAPI.cookie();
      setUserId(response.data.user_id);
      message.info(`User ID: ${response.data.user_id}`);
    } catch (error) {
      setError('Failed to fetch user ID from cookie.');
      console.error(error);
    }
  };

  const fetchRatings = async (userId: number) => {
    setLoading(true);
    try {
      const [servicesResponse, commentsResponse] = await Promise.all([
        serviceAPI.getMyServices(userId),
        commentAPI.getComments({})
      ]);

      const ownedServiceIds = new Set(servicesResponse.data.map((service: any) => service.id));
      const ownedComments = commentsResponse.data.filter((comment: any) =>
        ownedServiceIds.has(comment.service_id)
      );

      const ratingCounts: Record<string, number> = ownedComments.reduce((acc: Record<string, number>, comment: any) => {
        const rating = comment.rating as number;
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      const totalComments = ownedComments.length;
      const ratingsData: RatingData[] = Object.entries(ratingCounts).map(([rating, count]) => ({
        name: `${rating} Star`,
        value: count,
        percentage: ((count / totalComments) * 100).toFixed(2) + '%'
      }));

      setRatings(ratingsData);
    } catch (err) {
      setError('Failed to fetch ratings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUserId();
    };
    initialize();
  }, []);

  useEffect(() => {
    if (userId !== null) {
      fetchRatings(userId);
    }
  }, [userId]);

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Rating Distribution</h1>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={ratings}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            fill="#8884d8"
            label={(entry) => entry.name}
          >
            {ratings.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage})`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingDistribution;
