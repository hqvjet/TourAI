'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, message, Select } from 'antd';
import { serviceAPI } from '@/apis/service';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { authAPI } from '@/apis/auth';

const { Option } = Select;
const center = {
  lat: 21.0285,
  lng: 105.8542, // Tọa độ của Hà Nội, Việt Nam
};

const CreateServiceForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([{ image_url: '' }]);
  const [userId, setUserId] = useState<number | null>(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  });
  const [selected, setSelected] = useState({ lat: 0, lng: 0 });
  const [form] = Form.useForm();

  const onMapClick = useCallback((event: any) => {
    setSelected({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    form.setFieldsValue({
      address: event.latLng.lat().toString() + ',' + event.latLng.lng().toString()
    })
    
  }, []);

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
      const imagePromises = images.map((img) => {
        const imagePayload = {
          service_id: serviceId,
          image_url: img.image_url,
        };
        return serviceAPI.createServiceImage(serviceId, imagePayload);
      });
      await Promise.all(imagePromises);

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

  const handleAddImage = () => {
    setImages([...images, { image_url: '' }]);
  };

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      const newImages = images.filter((_, imgIndex) => imgIndex !== index);
      setImages(newImages);
    }
  };

  const handleImageChange = (index: number, field: string, value: string) => {
    const newImages = images.map((img, imgIndex) =>
      imgIndex === index ? { ...img, [field]: value } : img
    );
    setImages(newImages);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <div className='flex justify-center items-center w-full h-full'>
      <div className='flex flex-col items-center justify-center rounded-2xl bg-white shadow py-14 pl-20 pr-32'>
        <h1 className="text-4xl text-center text-black font-bold mb-10 ml-20 ">bắt đầu kinh doanh!</h1>
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

          <Form.Item label="Ảnh">
            {images.map((img, index) => (
              <div key={index}>
                <Form.Item
                  label={`Ảnh ${index + 1}`}
                  name={['images_data', index, 'image_url']}
                  rules={[{ required: true, message: 'xin hãy thêm ảnh!' }]}
                >
                  <Input
                    value={img.image_url}
                    onChange={(e: any) => handleImageChange(index, 'image_url', e.target.value)}
                  />
                </Form.Item>

                {images.length > 1 && index === images.length - 1 && (
                  <Button type="dashed" onClick={() => handleRemoveImage(index)} block>
                    Xóa ảnh
                  </Button>
                )}
              </div>
            ))}
            <Button type="dashed" onClick={handleAddImage} block>
              Thêm ảnh
            </Button>
          </Form.Item>

          <Form.Item
            label="Địa Chỉ"
            name="address"
            rules={[{ required: true, message: 'Xin hãy nhập địa chỉ' }]}
          >
            <Input />
          </Form.Item>

          <div className='w-full h-96 ml-10'>
            <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '100%',
              }}
              zoom={8}
              center={center}
              onClick={onMapClick}
            >
              {selected && <Marker position={{ lat: selected.lat, lng: selected.lng }} />}
            </GoogleMap>
          </div>

          <Form.Item wrapperCol={{ offset: 13, span: 16 }} className='mt-10 mr-20'>
            <Button className='bg-red-400 px-10 py-5 text-lg' type="primary" htmlType="submit" loading={loading}>
              Xong
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateServiceForm;
