'use client';
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import { serviceAPI } from '@/apis/service';

interface SearchProps {
  results: any[];
  setResults: (results: any[]) => void;
  services: any[];
  typeFilter: string;
}

const Search: React.FC<SearchProps> = ({ results, setResults, services, typeFilter }) => {
  const [search, setSearch] = useState<string>("");

  async function handleSearch() {
    try {
      let response;
      console.log("typeFilter:", typeFilter);
      
      if (typeFilter && typeFilter !== "all") {
        response = await serviceAPI.searchServices(search, typeFilter);
      } else {
        response = await serviceAPI.searchServices(search, "");
      }

      setResults(response.data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  }

  return (
    <div className="m-3">
      <div className="max-w-5xl md:flex mx-auto p-1 border-2 rounded-lg md:rounded-full shadow-md bg-white">
        <div className="flex-1 flex">
          <span className="my-auto ml-2">
            <SearchIcon className="text-4xl" />
          </span>

          <input
            type="text"
            className="flex-1 p-3 outline-none text-xl placeholder-shown:border-black"
            placeholder="Khách sạn, hàng không, grab..."
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button
          className="bg-green-400 p-3 px-5 rounded-md md:rounded-full text-xl font-bold w-full md:w-auto"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default Search;
