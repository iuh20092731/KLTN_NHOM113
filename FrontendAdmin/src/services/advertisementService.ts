import instance from '../config/axios.config';
import { Advertisement } from '../interfaces/Advertisement';
import { handleAuthError } from '../utils/auth';

export interface MainAdvertisementCreationRequest {
  mainAdvertisementName: string;
  serviceId: number;
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
  openingHourStart: string;
  openingHourEnd: string;
  googleMapLink: string;
  websiteLink: string;
  adStatus: 'Pending' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
  deliveryAvailable: boolean;
  mediaList: {
    name: string;
    content: string;
    url: string;
    type: 'BANNER' | 'VIDEO' | 'IMAGE';
  }[];
  zaloLink: string;
  facebookLink: string;
}

export const createAdvertisement = async (data: Advertisement) => {
    try {
        // Transform the data to match API requirements
        const requestData: MainAdvertisementCreationRequest = {
          mainAdvertisementName: data.mainAdvertisementName,
          serviceId: data.serviceId,
          advertiserId: data.advertiserId || '',
          adminId: data.adminId || '',
          adStartDate: new Date(data.adStartDate).toISOString(),
          adEndDate: new Date(data.adEndDate).toISOString(),
          reviewNotes: data.reviewNotes || '',
          description: data.description || '',
          detailedDescription: data.detailedDescription || '',
          address: data.address,
          phoneNumber: data.phoneNumber || '',
          priceRangeLow: data.priceRangeLow?.toString() || '0',
          priceRangeHigh: data.priceRangeHigh?.toString() || '0',
          openingHourStart: `${String(data.openingHourStart.hour).padStart(
            2,
            '0',
          )}:${String(data.openingHourStart.minute).padStart(2, '0')}:00`,
          openingHourEnd: `${String(data.openingHourEnd.hour).padStart(
            2,
            '0',
          )}:${String(data.openingHourEnd.minute).padStart(2, '0')}:00`,
          googleMapLink: data.googleMapLink || '',
          websiteLink: data.websiteLink || '',
          adStatus: 'Pending',
          deliveryAvailable: data.deliveryAvailable || false,
          mediaList: data.mediaList.map((media) => ({
            name: media.name || '',
            content: media.content || '',
            url: media.url || '',
            type: media.type,
          })),
          zaloLink: data.zaloLink || '',
          facebookLink: data.facebookLink || '',
        };

        const response = await instance.post('/api/v2/main-advertisements', requestData);
        return response.data;
    } catch (error: any) {
        if (handleAuthError(error)) {
            throw new Error('AUTH_ERROR');
        }
        console.error('Error creating advertisement:', error);
        throw error;
    }
};

export const uploadMedia = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await instance.post('/api/v1/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data; // Giả sử response trả về {url: string}
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
}; 