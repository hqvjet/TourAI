'use client';
import React, { useEffect, useState } from 'react';
import ServiceDetail from '@/components/service_detail';
import { serviceAPI } from '@/apis/service';
import { authAPI } from '@/apis/auth';

interface ServiceDetailProps {
  id: number;
  name: string;
  address: string;
  website?: string;
  type: string;
  phone: string;
  imageUrls: string[];
  user_id?: number;
  description?: string;
  positive: number;
  negative: number;
  neutral: number;
}

const ServiceDetailPage: React.FC = () => {
  const [serviceData, setServiceData] = useState<ServiceDetailProps>({
    id: 0,
    name: '',
    address: '',
    type: '',
    phone: '',
    imageUrls: [],
    user_id: 0,
    positive: 0,
    negative: 0,
    neutral: 0,
  });

  const [userId, setUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const service_id = window.location.pathname.split('/').pop();
        const response = await serviceAPI.getServiceById(Number(service_id));
        const data = response.data;
        setServiceData({
          id: data.id,
          name: data.name,
          address: data.address,
          website: data.website,
          type: data.type,
          phone: data.phone,
          imageUrls: data.image_urls,
          user_id: userId || 0,
          description: data.description,
          positive: data.positive,
          negative: data.negative,
          neutral: data.neutral,
        });
      } catch (error) {
        console.error('Error fetching service data');
      }
    };

    if (userId !== null) {
      fetchServiceData();
    }
  }, [userId]);

  return (
    <div>
      <ServiceDetail
        id={serviceData.id}
        name={serviceData.name}
        address={serviceData.address}
        website={serviceData.website}
        type={serviceData.type}
        phone={serviceData.phone}
        imageUrls={serviceData.imageUrls}
        user_id={serviceData.user_id}
        description={serviceData.description}
        positive={serviceData.positive}
        negative={serviceData.negative}
        neutral={serviceData.neutral}
      />
    </div>
  );
};

export default ServiceDetailPage;
