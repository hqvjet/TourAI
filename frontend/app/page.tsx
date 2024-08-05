'use client'
import { useState, useEffect } from 'react';
import SearchBox from "@/components/search/searchbox";
import Search from "@/components/search/search";
import ServicesPage from "@/components/service";
import Trending from "@/components/trending";
import Category from "@/components/category";
import { serviceAPI } from '@/apis/service'; 
import { message, Pagination } from 'antd';

export default function Home() {
  const [type, setType] = useState<string>("all");
  const [results, setResults] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    fetchResults(currentPage);
  }, [currentPage, type]);

  const fetchResults = async (page: number) => {
    try {
      const response = await serviceAPI.getServices({ type, page, limit: 8 });
      setResults(response.data.services);
      // message.info(`Fetched comments:, ${JSON.stringify(response.data.services)}`);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setCurrentPage(1); 
    fetchResults(1);
  };

  const handleSearch = (newResults: any[]) => {
    setResults(newResults);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchResults(page);
  };

  return (
    <main>
      <div className="hidden md:block font-bold text-6xl text-center mt-24 mb-12">
        Đi Đâu Bro?
      </div>

      <SearchBox
        type={type}
        setType={setType}
        setResults={handleSearch}
        handleTypeChange={handleTypeChange}
        page={currentPage}
        limit={8}
      />

      <Search results={results} setResults={handleSearch} typeFilter={type} services={[]} />

      <ServicesPage services={results} />

      <Pagination
        current={currentPage}
        total={total}
        pageSize={8}
        onChange={handlePageChange}
        className="my-5 flex justify-center"
      />

      <div className="max-w-7xl mx-auto block md:flex bg-[#f2b203] p-5 space-x-5 my-10">
        <div>
          <img src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.explicit.bing.net%2Fth%3Fid%3DOIP.5yJ1ulwQCBN7z28ixlU16AHaFc%26pid%3DApi&f=1&ipt=a2ae5625ac7adae58c5900fc212c545632157c5262a06b16d27fffb1398eb83d&ipo=images" alt="Banner" />
        </div>

        <div className="mt-5 md:mt-0">
          <p className="text-3xl font-bold text-white mb-5 text-center">
            Vòng Quanh Việt Nam
          </p>
          <p className="text-lg font-light text-white mt-10 md:mt-0 text-center">
            Chúng tôi chào đón bạn với những dịch vụ chất lượng, từ khách sạn sang trọng đến các chuyến bay và dịch vụ di chuyển tiện lợi. Hãy khám phá và tận hưởng!
            <br />
            <br />
            <button className="btn mt-3">Khám phá ngay</button>
          </p>
        </div>
      </div>

      <div className="bg-[#faf1ed] my-5">
        <div className="mx-auto max-w-7xl p-2">
          <div className="m-3">
            <div className="text-3xl font-medium">Những dịch vụ đang hot</div>
            <div className="text-lg font-light">Các dịch vụ xếp hạng cao nhất</div>
          </div>
          <Trending />
        </div>
      </div>

      <div className="bg-white my-5">
        <div className="mx-auto max-w-7xl p-2">
          <div className="m-3">
            <div className="text-3xl font-medium">
              Những hoạt động hàng đầu theo từng danh mục
            </div>
            <div className="text-lg font-light">
              Các địa điểm được chọn lựa bởi khách hàng, những người chiến thắng "Best of the Best"
            </div>
          </div>
          <Category />
        </div>
      </div>
    </main>
  );
}
