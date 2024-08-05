import { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import { userAPI } from '@/apis/user';

interface User {
  id: number;
  user_name: string;
  full_name: string;
  age?: number;
  role: string;
}

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userAPI.getAllUser({});
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Spin tip="Loading..." />;
  if (error) return <Alert message="Error" description={error} type="error" />;

  return (
    <div>
      <h1>User</h1>
      <Table
        columns={[
          { title: 'ID', dataIndex: 'id', key: 'id' },
          { title: 'User Name', dataIndex: 'user_name', key: 'user_name' },
          { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
          { title: 'Age', dataIndex: 'age', key: 'age' },
          { title: 'Role', dataIndex: 'role', key: 'role' },
        ]}
        dataSource={users}
        rowKey="id"
      />
    </div>
  );
};

export default User;
