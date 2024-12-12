import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Breadcrumb from '../Breadcrumbs/Breadcrumb';
import DatePickerOne from '../Forms/DatePicker/DatePickerOne';
import SelectGroupTwo from '../Forms/SelectGroup/SelectGroupTwo';

// Định nghĩa interface cho Advertisement
interface OpeningHour {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

interface Media {
  name: string;
  content: string;
  url: string;
  type: string; // có thể là 'BANNER', 'VIDEO', 'IMAGE'
}

interface Advertisement {
  mainAdvertisementName: string;
  serviceId: string;
  advertiserId: string;
  adminId: string;
  adStartDate: string;
  adEndDate: string;
  reviewNotes: string;
  description: string;
  detailedDescription: string;
  address: string;
  phoneNumber: string;
  priceRangeLow: string;
  priceRangeHigh: string;
  openingHourStart: OpeningHour;
  openingHourEnd: OpeningHour;
  googleMapLink: string;
  websiteLink: string;
  adStatus: string; // 'Active' hoặc 'Inactive'
  mediaList: Media[];
}

const AdvertiseForm = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const itemString = queryParams.get('item');
  const item = itemString ? JSON.parse(decodeURIComponent(itemString)) : null;

  const [advertisement, setAdvertisement] = useState<Advertisement>({
    mainAdvertisementName: '',
    serviceId: '',
    advertiserId: '',
    adminId: '',
    adStartDate: '',
    adEndDate: '',
    reviewNotes: '',
    description: '',
    detailedDescription: '',
    address: '',
    phoneNumber: '',
    priceRangeLow: '',
    priceRangeHigh: '',
    openingHourStart: { hour: 0, minute: 0, second: 0, nano: 0 },
    openingHourEnd: { hour: 0, minute: 0, second: 0, nano: 0 },
    googleMapLink: '',
    websiteLink: '',
    adStatus: 'Inactive',
    mediaList: [{ name: '', content: '', url: '', type: 'BANNER' }],
  });

  useEffect(() => {
    if (item) {
      setAdvertisement(item); // Nạp dữ liệu vào state từ item
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAdvertisement((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const mediaList = [...advertisement.mediaList];
    mediaList[index][name] = value;
    setAdvertisement((prev) => ({ ...prev, mediaList }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Gọi API để cập nhật advertisement ở đây
    console.log(advertisement);
    // Bạn có thể thêm logic gọi API ở đây
  };

  return (
    <>
      <Breadcrumb pageName="Update Advertisement" />
      {/* <div>
        <h2>Update Advertisement</h2>
        {item && (
          <div>
            <h3>Selected Item:</h3>
            <pre>{JSON.stringify(item, null, 2)}</pre>
          </div>
        )}
      </div> */}
      <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white rounded-md shadow-md">
        <div>
          <label className="block mb-2">Google Map Link</label>
          <input
            type="text"
            name="googleMapLink"
            value={advertisement.googleMapLink}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Service ID</label>
          <input
            type="text"
            name="serviceId"
            value={advertisement.serviceId}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Advertiser ID</label>
          <input
            type="text"
            name="advertiserId"
            value={advertisement.advertiserId}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Admin ID</label>
          <input
            type="text"
            name="adminId"
            value={advertisement.adminId}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Ad Start Date</label>
          <DatePickerOne
            selected={new Date(advertisement.adStartDate)}
            onChange={(date: Date) => setAdvertisement({ ...advertisement, adStartDate: date.toISOString() })}
          />
        </div>

        <div>
          <label className="block mb-2">Ad End Date</label>
          <DatePickerOne
            selected={new Date(advertisement.adEndDate)}
            onChange={(date: Date) => setAdvertisement({ ...advertisement, adEndDate: date.toISOString() })}
          />
        </div>

        <div>
          <label className="block mb-2">Review Notes</label>
          <textarea
            name="reviewNotes"
            value={advertisement.reviewNotes}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">Description</label>
          <textarea
            name="description"
            value={advertisement.description}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">Detailed Description</label>
          <textarea
            name="detailedDescription"
            value={advertisement.detailedDescription}
            onChange={handleChange}
            className="w-full border rounded p-2"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={advertisement.address}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={advertisement.phoneNumber}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Price Range Low</label>
          <input
            type="text"
            name="priceRangeLow"
            value={advertisement.priceRangeLow}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Price Range High</label>
          <input
            type="text"
            name="priceRangeHigh"
            value={advertisement.priceRangeHigh}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Opening Hour Start</label>
          <input
            type="time"
            name="openingHourStart"
            value={`${advertisement.openingHourStart.hour}:${advertisement.openingHourStart.minute}`}
            onChange={(e) => {
              const [hour, minute] = e.target.value.split(':');
              setAdvertisement((prev) => ({
                ...prev,
                openingHourStart: { ...prev.openingHourStart, hour: Number(hour), minute: Number(minute) },
              }));
            }}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Opening Hour End</label>
          <input
            type="time"
            name="openingHourEnd"
            value={`${advertisement.openingHourEnd.hour}:${advertisement.openingHourEnd.minute}`}
            onChange={(e) => {
              const [hour, minute] = e.target.value.split(':');
              setAdvertisement((prev) => ({
                ...prev,
                openingHourEnd: { ...prev.openingHourEnd, hour: Number(hour), minute: Number(minute) },
              }));
            }}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Google Map Link</label>
          <input
            type="text"
            name="googleMapLink"
            value={advertisement.googleMapLink}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Website Link</label>
          <input
            type="text"
            name="websiteLink"
            value={advertisement.websiteLink}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block mb-2">Ad Status</label>
          <SelectGroupTwo
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
            value={advertisement.adStatus}
            onChange={(value: string) => setAdvertisement({ ...advertisement, adStatus: value })}
          />
        </div>

        <div>
          <h3 className="font-bold mt-5 mb-2">Media List</h3>
          {advertisement.mediaList.map((media, index) => (
            <div key={index} className="border p-4 mb-4 rounded">
              <div>
                <label className="block mb-2">Media Name</label>
                <input
                  type="text"
                  name="name"
                  value={media.name}
                  onChange={(e) => handleMediaChange(index, e)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-2">Content</label>
                <input
                  type="text"
                  name="content"
                  value={media.content}
                  onChange={(e) => handleMediaChange(index, e)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-2">URL</label>
                <input
                  type="text"
                  name="url"
                  value={media.url}
                  onChange={(e) => handleMediaChange(index, e)}
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block mb-2">Media Type</label>
                <select
                  name="type"
                  value={media.type}
                  onChange={(e) => handleMediaChange(index, e)}
                  className="w-full border rounded p-2"
                >
                  <option value="BANNER">BANNER</option>
                  <option value="VIDEO">VIDEO</option>
                  <option value="IMAGE">IMAGE</option>
                </select>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setAdvertisement((prev) => ({
                ...prev,
                mediaList: [...prev.mediaList, { name: '', content: '', url: '', type: 'BANNER' }],
              }))
            }
            className="mt-2 p-2 bg-blue-500 text-white rounded"
          >
            Add More Media
          </button>
        </div>

        <button type="submit" className="mt-4 p-2 bg-green-500 text-white rounded">
          Update Advertisement
        </button>
      </form>
    </>
  );
};

export default AdvertiseForm;
