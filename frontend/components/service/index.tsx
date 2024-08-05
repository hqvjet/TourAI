"use client";
import React from "react";
import Link from "next/link";
import LanguageIcon from '@mui/icons-material/Language';

type Service = {
  id: number;
  name: string;
  address: string;
  website: string;
  type: string;
  image_urls: string[];
};

type ServicesPageProps = {
  services?: Service[];
};

const ServicesPage: React.FC<ServicesPageProps> = ({ services = [] }) => {
  if (!services) {
    return <p>No services available</p>;
  }

  return (
    <div className="flex justify-self-center items-center">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mx-auto max-w-7xl m-1">
        {services.map((service) => (
          <Link href={`/services/${service.id}`} key={service.id}>
            <div className="m-1 md:m-3 shadow-xl hover:cursor-pointer hover:underline bg-white">
              <img
                src={service.image_urls[0] || 'null'}
                className="transition duration-700 z-2 h-[200px] md:h-[200px] w-full object-cover"
              />
              <div className="mb-6">
                <div className="text-sm md:text-xl font-medium ml-2 pb-2 pt-2 text-center hover:underline transition duration-700 truncate">
                  {service.name}
                </div>
                <div className="p-1 rounded-full text-sm">
                  {service.address && <span>📍 {service.address}</span>}
                </div>
                {service.website ? (
                  <p className="hidden lg:flex space-x-1 pl-1">
                    <LanguageIcon />
                    <span className="my-auto">{service.website}</span>
                  </p>
                ) : null}
                <p className="p-1 rounded-full text-md font-semibold truncate">
                  #{service.type}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
