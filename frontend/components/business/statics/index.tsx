import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Spin, Alert, Statistic, List, message } from 'antd';
import { serviceAPI } from '@/apis/service';
import { commentAPI } from '@/apis/comment';
import { authAPI } from '@/apis/auth';

const Statistics = () => {
  const [services, setServices] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
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

  const fetchData = async (userId: number) => {
    setLoading(true);
    try {
      const [serviceResponse, commentResponse] = await Promise.all([
        serviceAPI.getMyServices(userId),
        commentAPI.getComments({})
      ]);

      setServices(serviceResponse.data);
      setComments(commentResponse.data);
    } catch (err) {
      setError('Failed to fetch data.');
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
      fetchData(userId);
    }
  }, [userId]);

  const serviceStatistics = services.map((service: any) => {
    const serviceComments = comments.filter((comment: any) => comment.service_id === service.id);
    const totalRating = serviceComments.reduce((total: number, comment: any) => total + comment.rating, 0);
    const averageRating = serviceComments.length ? (totalRating / serviceComments.length).toFixed(2) : 0;
    return {
      ...service,
      totalComments: serviceComments.length,
      averageRating,
      totalRating
    };
  });

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Statistics</h1>
      <Row gutter={16}>
        {serviceStatistics.map((service: any) => (
          <Col key={service.id} span={8}>
            <Card title={service.name} bordered={false} className="mb-4">
              <Statistic title="Total Comments" value={service.totalComments} />
              <Statistic title="Total Rating" value={service.totalRating} precision={2} />
              <Statistic title="Average Rating" value={service.averageRating} precision={2} />
              <List
                header={<div>Comments</div>}
                bordered
                dataSource={comments.filter((comment: any) => comment.service_id === service.id)}
                renderItem={(comment: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={`Rating: ${comment.rating}`}
                      description={comment.content}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Statistics;
