"use client";

export default function Category() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      <div className="flex flex-col items-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2F23c133e0c1637be1e07d-be55c16c6d91e6ac40d594f7e280b390.ssl.cf1.rackcdn.com%2Fu%2Fgpch%2FPark-Hotel-Group---Explore---Grand-Park-City-Hall-Facade.jpg&f=1&nofb=1&ipt=2ffac31e80489e27db05f3ba17cb18471aa6730bf8fbeae18abdbafd29b2450c&ipo=images"
          alt="hotel"
          className="rounded-lg h-[100px] lg:h-[200px] w-full object-cover"
        />
        <div className="text-xl font-bold mt-2">#Khách Sạn</div>
      </div>
      <div className="flex flex-col items-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2F2%2F20%2FNagoya_Airport_view_from_promenade.jpg&f=1&nofb=1&ipt=7c56c52338df9086656e589fc59c83f0f0c5b4a28338c9bce415c1148bb4a19d&ipo=images"
          alt="airline"
          className="rounded-lg h-[100px] lg:h-[200px] w-full object-cover"
        />
        <div className="text-xl font-bold mt-2">#Hãng Hàng Không</div>
      </div>
      <div className="flex flex-col items-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimage.cnbcfm.com%2Fapi%2Fv1%2Fimage%2F107198637-1677138152014-gettyimages-1240756029-SINGAPORE_GRAB.jpeg%3Fv%3D1677167959&f=1&nofb=1&ipt=9323290a4df08e4da9c2d793c2ba5b3b95d39349c7602bc5ab7b964cab0c56b2&ipo=images"
          alt="grab"
          className="rounded-lg h-[100px] lg:h-[200px] w-full object-cover"
        />
        <div className="text-xl font-bold mt-2">#Grab</div>
      </div>
      <div className="flex flex-col items-center">
        <img
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.parisunlocked.com%2Fwp-content%2Fuploads%2F2020%2F05%2Fle-train-blleu-salle-rejane-trainbleu-owner.jpg&f=1&nofb=1&ipt=94411e6fdd7cb65b8c3cf7aaadc09e25c2fc3474376127cd90f9ed2b3236c6d1&ipo=images"
          alt="restaurant"
          className="rounded-lg h-[100px] lg:h-[200px] w-full object-cover"
        />
        <div className="text-xl font-bold mt-2">#Nhà Hàng</div>
      </div>
    </div>
  );
}
