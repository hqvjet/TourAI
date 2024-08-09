import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import CommentIcon from '@mui/icons-material/Comment';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ProgressBar from '../progress_bar';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import PhoneIcon from '@mui/icons-material/Phone';
import { commentAPI } from '@/apis/comment';
import { message, Card, Button } from 'antd';

interface ServiceDetailProps {
  name: string;
  address: string;
  geolocation: string;
  website?: string;
  type: string;
  phone: string;
  imageUrls?: string[];
  description?: string;
  id: number;
  user_id?: number;
  positive?: number;
  negative?: number;
  neutral?: number;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({
  name,
  address,
  geolocation,
  website,
  type,
  phone,
  imageUrls = [],
  description,
  id,
  user_id,
}) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const latlng = {
    lat: Number(geolocation.split(',')[0]),
    lng: Number(geolocation.split(',')[1])
  }

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getCommentById(id);
      setComments(response.data);

      const totalComments = response.data.length;
      const positiveCount = response.data.filter((comment: { rating: number; }) => comment.rating === 3).length;
      const neutralCount = response.data.filter((comment: { rating: number; }) => comment.rating === 2).length;
      const negativeCount = response.data.filter((comment: { rating: number; }) => comment.rating === 1).length;

      setPositive((positiveCount / totalComments) * 100);
      setNeutral((neutralCount / totalComments) * 100);
      setNegative((negativeCount / totalComments) * 100);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const handleReviewSubmit = async () => {
    const predictionData = {
      title: reviewTitle,
      content: reviewContent,
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        throw new Error('Failed to predict');
      }

      const predictionResult = await response.json();
      const [negative, neutral, positive] = predictionResult.prediction[0];
      const maxPrediction = Math.max(negative, neutral, positive);
      let rating;

      if (maxPrediction === positive) {
        rating = 3;
      } else if (maxPrediction === neutral) {
        rating = 2;
      } else {
        rating = 1;
      }

      const newComment = {
        title: reviewTitle,
        content: reviewContent,
        rating: rating,
        service_id: id,
        users_id: user_id,
      };
      await commentAPI.createComment(newComment);
      setReviewTitle('');
      setReviewContent('');
      fetchComments();
      message.success('Bình luận đã được đăng!')
    } catch (error) {
      message.error('Ôi, bình luận của bạn hiện tại không thể đăng ở dịch vụ này, vui lòng kiểm tra lại!')
    }
    finally {
      setLoading(false);
    }
  };
  const formattedImageUrls = imageUrls.map((url) => ({
    original: url.startsWith('http') ? url : `http://localhost:8000${url}`,
    thumbnail: url.startsWith('http') ? url : `http://localhost:8000${url}`,
  }));
  return (
    <div className="w-7/12 mx-auto px-4 py-8">
      <div className="rounded-lg">
        <h2 className="text-5xl font-bold">{name}</h2>
        <p className='mt-2 text-gray-700'><CommentIcon /> {`${comments.length} đánh giá`}</p>
        <p className="mt-2 text-gray-700">
          <LocationOnIcon /> {address}
        </p>
        {website && (
          <p className="mt-2 text-gray-700">
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <LanguageIcon /> Website
            </a>
          </p>
        )}
        <p className="mt-2 text-gray-700">
          <PhoneIcon /> {phone}
        </p>
      </div>

      <div className="mb-4 mt-4 rounded-lg">
        <ImageGallery
          items={formattedImageUrls}
          showPlayButton={false}
          showThumbnails={false}
          showFullscreenButton={false}
          renderItem={(item) => (
            <div className="w-full h-full md:h-[600px] max-h-[600px] overflow-hidden rounded-xl">
              <img
                src={item.original}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        />
      </div>

      <div className="mt-6 border border-gray-300 rounded-lg">
        <h3 className="text-2xl font-bold mb-2 mt-4 ml-4 ">Vị trí</h3>
        <p className="mb-2 ml-4 text-gray-700">
          <LocationOnIcon /> {address}
        </p>
        <div className="w-full h-[400px] md:h-[600px] bg-slate-300 drop-shadow-sm">
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_API as string}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={latlng}
              zoom={18}
              options={{ mapTypeId: 'hybrid' }}
            >
              <Marker position={latlng} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>

      <Card title={<h1 className='text-3xl'>Giới thiệu</h1>} className='mt-8'>
        <div className="mt-4">
          <p className="mt-2">{description}</p>
        </div>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="col-span-1 border border-gray-300 rounded-lg p-4">
          <div className="mt-4">
            <div className="col-span-1 border border-gray-300 rounded-lg p-4">
              <ProgressBar
                positive={positive}
                neutral={neutral}
                negative={negative}
              />
            </div>
            <div className="mt-2">
              <div className="text-green-500 font-bold">Tích cực: {positive}%</div>
              <div className="text-gray-500">Bình thường: {neutral}%</div>
              <div className="text-red-500 font-bold">Tiêu cực: {negative}%</div>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:border md:border-gray-300 md:rounded-lg md:p-4 overflow-auto">
          <div className="mt-4">
            <h3 className="text-lg font-bold">Thông tin liên hệ:</h3>
            {address && (
              <p className="mt-2">
                <LocationOnIcon /> Địa chỉ: {address}
              </p>
            )}
            {website && (
              <p className="mt-2">
                <LanguageIcon /> Website:{' '}
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {website}
                </a>
              </p>
            )}
            {phone && (
              <p className="mt-2">
                <PhoneIcon /> Hotline: {phone}
              </p>
            )}
            {type && (
              <p className="mt-2">
                <RoomServiceIcon /> Loại: {type}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-6">Bạn đã trải nghiệm dịch vụ này chưa? nếu có thì để lại một bình luận nhé:</h3>
        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            id="reviewTitle"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewContent" className="block text-sm font-medium text-gray-700">
            Nội dung
          </label>
          <textarea
            id="reviewContent"
            value={reviewContent}
            rows={5}
            onChange={(e) => setReviewContent(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <Button
          onClick={handleReviewSubmit}
          loading={loading}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Đăng ngay!
        </Button>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 mt-8">
        <h3 className="text-lg font-bold mb-2">Bình luận:</h3>
        <div className="h-auto">
          {comments.length > 0 ? (
            comments.slice(0, 10).map((comment) => (
              <div
                key={`${comment.service_id}-${comment.users_id}`}
                className="mb-4 border border-gray-300 rounded-lg p-4"
              >
                <h4 className="text-lg font-bold text-gray-700 inline w-full">
                  {comment.full_name} <i className='text-gray-500 text-sm'>- đã đăng vào {comment.created_at.slice(0, 10)} - </i>
                </h4>
                {comment.rating == 3 ? (<i className='text-green-500'>
                  Bình luận tích cực
                </i>) :
                  (
                    <>
                      {comment.rating == 2 ? (<i className='text-orange-400'>
                        Bình luận trung tính
                      </i>) :
                        (<i className='text-red-500'>
                          Bình luận tiêu cực
                        </i>)

                      }
                    </>
                  )
                }
                <h2 className="text-lg font-bold mt-3">{comment.title}</h2>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>Vẫn chưa có bình luận nào về loại dịch vụ này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
