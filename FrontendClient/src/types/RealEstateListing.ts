export type RealEstateListing = {
    listingId: number;
    title: string;
    price: number;
    area: number;
    pricePerSquareMeter: number;
    bedrooms: number;
    bathrooms: number;
    address: string;
    detailedAddress: string | null;
    description: string;
    contactPhoneNumber: string;
    createdAt: string;
    updatedAt: string | null;
    mediaList: RealEstateMedia
    user: User
};


export type RealEstateMedia = {
    map(arg0: (media: import("../redux/thunks/realestate").EstateMedia) => string): string[];
    mediaId: number;
    mediaUrl: string;
    mediaType: string;
    seq: number;
};

interface User {
    id: null;
    username: string;
    firstName: string;
    lastName: string;
    avatar: string;
    roles: Role[];
  }
  
  interface Role {
    name: string;
    description: string;
    permissions: any[];
  }