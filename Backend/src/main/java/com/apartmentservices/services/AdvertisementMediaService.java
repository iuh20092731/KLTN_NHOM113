package com.apartmentservices.services;

import com.apartmentservices.dto.request.AdvertisementMediaUpdateReq;
import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest;
import com.apartmentservices.dto.request.AdvertisementMediaUpdateRequest_V2;
import com.apartmentservices.dto.response.AdvertisementMediaResponse;
import com.apartmentservices.models.AdvertisementMedia;

import java.util.List;

public interface AdvertisementMediaService {
    AdvertisementMedia createMedia(AdvertisementMedia media);
    List<AdvertisementMedia> getAllMediaByAdvertisement(Integer advertisementId);
    List<AdvertisementMedia> getMediaByAdvertisementAndType(Integer advertisementId, AdvertisementMedia.MediaType type);
    AdvertisementMediaResponse updateMedia(Integer mediaId, AdvertisementMediaUpdateReq updatedMedia);

    AdvertisementMediaResponse updateMedia_V2(Integer mediaId, AdvertisementMediaUpdateRequest_V2 updatedMedia);

    AdvertisementMedia updateMediaByAdvertisementId(Integer advertisementId, AdvertisementMediaUpdateRequest updatedMediaRequest);
    void deleteMedia(Integer mediaId);


    List<AdvertisementMediaResponse> getTop5Banners();
}
