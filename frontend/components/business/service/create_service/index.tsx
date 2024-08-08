'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select, Upload, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { serviceAPI } from '@/apis/service';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { authAPI } from '@/apis/auth';
import { RcFile } from 'antd/es/upload';

const { Option } = Select;
const center = {
  lat: 21.0285,
  lng: 105.8542, // Tọa độ của Hà Nội, Việt Nam
};

const CreateServiceForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });
  const [selected, setSelected] = useState({ lat: 0, lng: 0 });
  const [geolocation, setGeolocation] = useState<string | null>('');
  const [form] = Form.useForm();

  const onMapClick = useCallback((event: any) => {
    setSelected({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setGeolocation(event.latLng.lat().toString() + ',' + event.latLng.lng().toString());
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await authAPI.cookie();
        const fetchedUserId = response.data.user_id;
        setUserId(fetchedUserId);
      } catch (error) {
        console.error('Failed to fetch user ID from cookie:', error);
      }
    };

    fetchUserId();
  }, []);

  const onFinish = async (values: any) => {
    if (userId === null) {
      message.error('Bạn cần phải xác thức người dùng trước khi sử dụng tính năng này');
      return;
    }
    
    if (geolocation == '') {
      message.error('Bạn chưa chọn vị trí địa lý!');
      return;
    }

    let serviceValues = { ...values, user_id: userId, geolocation: geolocation};
    // serviceValues = { ...serviceValues, image_urls: serviceValues.image_urls.fileList};

    // message.info(`Form values: ${JSON.stringify(serviceValues)}`);
    console.log(serviceValues);
    console.log(JSON.stringify(serviceValues));

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

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <div className='flex flex-col items-center justify-center rounded-2xl bg-white shadow py-14 pl-20 pr-32'>
        <h1 className="text-4xl text-center text-black font-bold mb-10 ml-20 ">Bắt đầu kinh doanh ngay nào!</h1>
        <Form
          name="create_service"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >

          <Form.Item
            label="Tên"
            name="name"
            rules={[{ required: true, message: 'Xin hãy nhập tên thương hiệu' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giới Thiệu"
            name="description"
            rules={[{ required: true, message: 'Xin hãy nhập giới thiệu thương hiệu' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Địa Chỉ"
            name="address"
            rules={[{ required: true, message: 'Xin hãy nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phân Loại"
            name="type"
            rules={[{ required: true, message: 'Xin hãy chọn phân loại thương hiệu' }]}
          >
            <Select>
              <Option value="hotel">Khách sạn</Option>
              <Option value="restaurant">Nhà hàng</Option>
              <Option value="grab">Grab</Option>
              <Option value="airline">Hàng không</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Hotline"
            name="phone"
            rules={[{ required: true, message: 'Xin hãy nhập hotline' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[{ required: true, message: 'Xin hãy nhập website!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Xin hãy nhập email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Images"
            name="image_urls"
          >
            <Upload
              action={undefined}
              listType="picture"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={() => false}
              maxCount={15}
              multiple
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Card
            title={<h1 className='text-xl text-gray-800'>Xin hãy chọn vị trí dịch vụ của bạn</h1>}
            className='w-auto h-auto ml-28'
            cover={
              <GoogleMap
                mapContainerStyle={{
                  width: '450px',
                  height: '400px',
                }}
                zoom={8}
                center={center}
                onClick={onMapClick}
              >
                {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
              </GoogleMap>
            }
          >
            <p>{`Vị trí địa lý: ${geolocation}`}</p>
          </Card>

          <Form.Item wrapperCol={{ offset: 13, span: 16 }} className='mt-10 mr-20'>
            <Button className='bg-red-400 px-10 py-5 text-lg' type="primary" htmlType="submit" loading={loading}>
              Xong
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div >
  );
};

export default CreateServiceForm;