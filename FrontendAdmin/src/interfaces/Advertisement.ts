import { MediaAdvertisement } from './MediaAdvertisement';

export interface Advertisement {
  advertisementId: number;
  mainAdvertisementName: string;
  categoryId: number;
  categoryNameNoDiacritics: string;
  serviceId: number;
  advertiserId: string;
  adminId: string | null;
  adStartDate: string; // Consider using Date type if you're handling date parsing
  adEndDate: string; // Same for Date type if necessary
  clicks: number | null;
  adStatus: string;
  reviewNotes: string;
  description: string;
  detailedDescription: string;
  address: string;
  phoneNumber: string;
  priceRangeLow: number;
  priceRangeHigh: number;
  openingHourStart: string;
  openingHourEnd: string;
  googleMapLink: string;
  websiteLink: string;
  deliveryAvailable: boolean;
  mediaList: MediaAdvertisement[];
}
