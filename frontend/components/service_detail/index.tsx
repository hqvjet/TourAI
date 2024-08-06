import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ProgressBar from '../progress_bar';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import PhoneIcon from '@mui/icons-material/Phone';
import { commentAPI } from '@/apis/comment';
import { message, Card } from 'antd';

interface ServiceDetailProps {
  name: string;
  address: string;
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
  website,
  type,
  phone,
  imageUrls = [],
  description,
  id,
  user_id,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [neutral, setNeutral] = useState(0);

  const mapContainerStyle = {
    width: '100%',
    height: '600px',
  };

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${address}&key=${process.env.NEXT_PUBLIC_MAP_API}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch map data');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          setMapCenter({ lat: location.lat, lng: location.lng });
          setMapLoaded(true);
        } else {
          throw new Error('No results found');
        }
      } catch (error) {
        console.error('Error fetching map data:', error);
      }
    };

    fetchMapData();
  }, [address, process.env.NEXT_PUBLIC_MAP_API]);

  const fetchComments = async () => {
    try {
      message.info(`Fetching comments for id: ${id}`);
      message.info(`Users id: ${user_id}`);
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
      message.info(`New comment data: ${JSON.stringify(newComment)}`);
      await commentAPI.createComment(newComment);
      setReviewTitle('');
      setReviewContent('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  return (
    <div className="w-7/12 mx-auto px-4 py-8">
      <div className="rounded-lg">
        <h2 className="text-5xl font-bold">{name}</h2>
        <p className='mt-2 text-gray-700'>{`${comments.length} đánh giá`}</p>
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

      <div className="mb-4 mt-4 border border-gray-300 rounded-lg">
        <ImageGallery
          items={imageUrls.map((url) => ({
            original: url,
            thumbnail: url,
          }))}
          showPlayButton={false}
          showThumbnails={false}
          showFullscreenButton={false}
          renderItem={(item) => (
            <div className="w-full h-full md:h-[600px] max-h-[600px] overflow-hidden">
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
          {!mapLoaded && <div className="p-4">Loading map...</div>}
          {mapLoaded && (
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_MAP_API as string}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={18}
                options={{ mapTypeId: 'hybrid' }}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>

      <Card title={<h1 className='text-3xl'>Giới thiệu</h1>} className='mt-8'>
        <div className="mt-4">
          <h3 className="text-lg font-bold">Description:</h3>
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
              <div className="text-green-500 font-bold">Positive: {positive}%</div>
              <div className="text-gray-500">Neutral: {neutral}%</div>
              <div className="text-red-500 font-bold">Negative: {negative}%</div>
            </div>
          </div>
        </div>
        <div className="col-span-1 md:border md:border-gray-300 md:rounded-lg md:p-4 overflow-auto">
          <div className="mt-4">
            <h3 className="text-lg font-bold">Contact Information:</h3>
            {address && (
              <p className="mt-2">
                <LocationOnIcon /> Address: {address}
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
                <PhoneIcon /> Phone: {phone}
              </p>
            )}
            {type && (
              <p className="mt-2">
                <RoomServiceIcon /> Type: {type}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-bold mb-6">Leave a Review:</h3>
        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700">
            Title
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
            Content
          </label>
          <textarea
            id="reviewContent"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <button
          onClick={handleReviewSubmit}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit Review
        </button>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 mt-8">
        <h3 className="text-lg font-bold mb-2">Comments:</h3>
        <div className="max-h-60 overflow-y-auto">
          {comments.length > 0 ? (
            comments.slice(0, 10).map((comment) => (
              <div
                key={`${comment.service_id}-${comment.users_id}`}
                className="mb-4 border border-gray-300 rounded-lg p-4"
              >
                <h4 className="text-lg font-bold text-gray-600">
                  by {comment.full_name}
                </h4>
                <h2 className="text-lg font-bold">{comment.title}</h2>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
