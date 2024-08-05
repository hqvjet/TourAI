import React, { useState, useEffect } from "react";
import { serviceAPI } from "@/apis/service";
import ServicesPage from "@/components/service";

export default function Trending() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await serviceAPI.getServices({ page, limit });
        const allServices = response.data.services;
        const serviceTypes = ["hotel", "restaurant", "grab", "airline"];
        const topRatedServices: any[] = [];

        for (const type of serviceTypes) {
          const filteredServices = allServices.filter((service: any) => service.type === type);
          filteredServices.sort((a: any, b: any) => (b.average_rating || 0) - (a.average_rating || 0));

          if (filteredServices.length > 0) {
            topRatedServices.push(filteredServices[0]);
          }
        }

        setServices(topRatedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, limit]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ServicesPage services={services} />
      )}
    </div>
  );
}
