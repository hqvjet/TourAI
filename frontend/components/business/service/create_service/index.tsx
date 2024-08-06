'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { serviceAPI } from '@/apis/service';
import { authAPI } from '@/apis/auth';
import { RcFile } from 'antd/es/upload';

const { Option } = Select;

const CreateServiceForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  useEffect(() => {
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

    fetchUserId();
  }, []);

  const onFinish = async (values: any) => {
    if (userId === null) {
      message.error('User not authenticated.');
      return;
    }

    const serviceValues = { ...values, user_id: userId };

    message.info(`Form values: ${JSON.stringify(serviceValues)}`);

    setLoading(true);
    try {
      const serviceResponse = await serviceAPI.createService(serviceValues);
      const serviceId = serviceResponse.data.id;

      const imageUploadPromises = fileList.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj as RcFile);
        formData.append('service_id', serviceId.toString());

        await serviceAPI.createServiceImage(serviceId, formData);
      });

      await Promise.all(imageUploadPromises);

      message.success('Service created successfully with images!');
      console.log('Service created successfully with images:', serviceResponse.data);
      router.push('/business');
    } catch (error) {
      console.error('Error creating service:', error);
      message.error('Creation failed. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = ({ fileList }: { fileList: any[] }) => setFileList(fileList);

  return (
    <div>
      <h1 className="text-4xl text-center text-white font-bold mb-4 ml-20">Create Service</h1>
      <Form
        name="create_service"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the service name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input the service description!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please input the service address!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Type"
          name="type"
          rules={[{ required: true, message: 'Please select the service type!' }]}
        >
          <Select>
            <Option value="hotel">Hotel</Option>
            <Option value="restaurant">Restaurant</Option>
            <Option value="grab">Grab</Option>
            <Option value="airline">Airline</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Phone"
          name="phone"
          rules={[{ required: true, message: 'Please input the service phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Website"
          name="website"
          rules={[{ required: true, message: 'Please input the service website!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input the service email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Images">
          <Upload
            action={undefined}
            listType="picture"
            fileList={fileList}
            onChange={handleChange}
            beforeUpload={() => false}
            maxCount={5}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 13, span: 16 }}>
          <Button style={{ background: "#1944BA" }} type="primary" htmlType="submit" loading={loading}>
            Create Service
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateServiceForm;