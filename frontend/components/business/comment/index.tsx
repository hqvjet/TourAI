import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Select, InputNumber, Button, message } from 'antd';
import { commentAPI } from '@/apis/comment';
import { authAPI } from '@/apis/auth';

const { Option } = Select;

const Comments = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [type, setType] = useState<string | undefined>(undefined);
  const [minRating, setMinRating] = useState<number | undefined>(undefined);
  const [maxRating, setMaxRating] = useState<number | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);

  const fetchComments = async (filters: any = {}) => {
    setLoading(true);
    try {
      const response = await commentAPI.getCommentsByBusiness(userId!, filters);
      setComments(response.data);
    } catch (err) {
      setError('Failed to fetch comments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserId = async () => {
    try {
      const response = await authAPI.cookie();
      const fetchedUserId = response.data.user_id;
      setUserId(fetchedUserId);
      message.info(`ID: ${response.data.user_id}`);
    } catch (error) {
      console.error('Failed to fetch user ID from cookie:', error);
    }
  };

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchComments();
    }
  }, [userId]);

  const handleFilterChange = () => {
    const filters: any = {};
    if (type) filters.type = type;
    if (minRating !== undefined) filters.min_rating = minRating;
    if (maxRating !== undefined) filters.max_rating = maxRating;
    if (sortBy) filters.sort_by = sortBy;

    fetchComments(filters);
  };

  if (loading) return <Spin size="large" />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Comments</h1>
      <div style={{ marginBottom: 16 }}>
        <Select
          placeholder="Select type"
          style={{ width: 200, marginRight: 16 }}
          value={type}
          onChange={setType}
          allowClear
        >
          <Option value="airline">Airline</Option>
          <Option value="hotel">Hotel</Option>
          <Option value="grab">Grab</Option>
          <Option value="restaurant">Restaurant</Option>
        </Select>
        <InputNumber
          placeholder="Min Rating"
          style={{ marginRight: 16 }}
          value={minRating}
          onChange={setMinRating}
        />
        <InputNumber
          placeholder="Max Rating"
          style={{ marginRight: 16 }}
          value={maxRating}
          onChange={setMaxRating}
        />
        <Select
          placeholder="Sort by"
          style={{ width: 200, marginRight: 16 }}
          value={sortBy}
          onChange={setSortBy}
          allowClear
        >
          <Option value="rating_asc">Rating Ascending</Option>
          <Option value="rating_desc">Rating Descending</Option>
          <Option value="created_at_asc">Created At Ascending</Option>
          <Option value="created_at_desc">Created At Descending</Option>
        </Select>
        <Button type="primary" onClick={handleFilterChange} className='bg-green-600'>
          Apply Filters
        </Button>
      </div>
      <Table
        columns={[
          { title: 'Service ID', dataIndex: 'service_id', key: 'service_id' },
          { title: 'User ID', dataIndex: 'users_id', key: 'users_id' },
          { title: 'Title', dataIndex: 'title', key: 'title' },
          { title: 'Content', dataIndex: 'content', key: 'content' },
          { title: 'Rating', dataIndex: 'rating', key: 'rating' },
          { title: 'Created At', dataIndex: 'created_at', key: 'created_at' },
          { title: 'User Full Name', dataIndex: 'full_name', key: 'full_name' },
        ]}
        dataSource={comments}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default Comments;
