import HomeIcon from "@mui/icons-material/Home";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import { HotelOutlined } from "@mui/icons-material";
import { useEffect } from 'react';
import { serviceAPI } from '@/apis/service';

type SearchProps = {
  type: string;
  setType: (type: string) => void;
  setResults: (results: any) => void;
  handleTypeChange: (newType: string) => void;
  page: number;
  limit: number;
};

const SearchBox = ({ type, setType, setResults, handleTypeChange, page, limit }: SearchProps) => {
  useEffect(() => {
    fetchResultsByType(type, page, limit);
  }, [type, page, limit]);

  const fetchResultsByType = async (selectedType: string, page: number, limit: number) => {
    try {
      let response;
      if (selectedType === "all") {
        response = await serviceAPI.getServices({ page, limit });
      } else {
        response = await serviceAPI.getServices({ type: selectedType, page, limit });
      }
      setResults(response.data.services);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleTypeChangeInternal = (newType: string) => {
    setType(newType);
    handleTypeChange(newType);
  };

  return (
    <div className="auto-scroll overflow-x-scroll text-gray-700 mt-3">
      <div className="flex justify-center w-[700px] md:w-[800px] text-2xl space-x-5 md:mx-auto">
        <div
          className={`nav_bar_components ${type === "all" ? "border-gray-600" : ""}`}
          onClick={() => handleTypeChangeInternal("all")}
        >
          <HomeIcon />
          <span>Tất cả</span>
        </div>
        <div
          className={`nav_bar_components ${type === "airline" ? "border-gray-600" : ""}`}
          onClick={() => handleTypeChangeInternal("airline")}
        >
          <FlightOutlinedIcon />
          <span>Hàng không</span>
        </div>
        <div
          className={`nav_bar_components ${type === "hotel" ? "border-gray-600" : ""}`}
          onClick={() => handleTypeChangeInternal("hotel")}
        >
          <HotelOutlined />
          <span>Khách sạn</span>
        </div>
        <div
          className={`nav_bar_components ${type === "grab" ? "border-gray-600" : ""}`}
          onClick={() => handleTypeChangeInternal("grab")}
        >
          <TwoWheelerOutlinedIcon />
          <span>Grab</span>
        </div>
        <div
          className={`nav_bar_components ${type === "restaurant" ? "border-gray-600" : ""}`}
          onClick={() => handleTypeChangeInternal("restaurant")}
        >
          <RestaurantMenuIcon />
          <span>Nhà hàng</span>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
